import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getDb, COLLECTIONS, clean, isDemoMode, audit } from '@/lib/relay/db'
import { resolveInputSchema, conversionSchema, partnerInquirySchema, ACTION_TYPES } from '@/lib/relay/schema'
import { sanitizeResolveInput } from '@/lib/relay/sanitize'
import { buildDestination, buildFallback } from '@/lib/relay/urltemplate'
import { selectOffer } from '@/lib/relay/scoring'
import { toMinor, groupByCurrency } from '@/lib/relay/money'
import { ensureSeed, purgeDemo } from '@/lib/relay/seed'
import {
  adminEmailsAllow, verifyPasscode, createSession, getSessionFromRequest, destroySession, SESSION_COOKIE,
} from '@/lib/relay/auth'

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function withHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Relay-Signature')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}
const json = (data, status = 200) => withHeaders(NextResponse.json(data, { status }))

export async function OPTIONS() {
  return withHeaders(new NextResponse(null, { status: 200 }))
}

function hashPercent(str) {
  const h = crypto.createHash('sha256').update(String(str || 'anon')).digest()
  return h[0] % 100
}

function baseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
}

// Simple in-memory rate limiter (transient, stores nothing personal).
const rlStore = new Map()
function rateLimit(key, limit = 60, windowMs = 60000) {
  const now = Date.now()
  const rec = rlStore.get(key)
  if (!rec || now > rec.reset) {
    rlStore.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  rec.count += 1
  return rec.count <= limit
}

function csv(rows, columns) {
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const head = columns.map((c) => esc(c.label)).join(',')
  const body = rows.map((r) => columns.map((c) => esc(c.get(r))).join(',')).join('\n')
  return head + '\n' + body
}

function clickFilter(sp) {
  const f = {}
  if (sp.get('app')) f.app = sp.get('app')
  if (sp.get('partner')) f.partner_slug = sp.get('partner')
  if (sp.get('market')) f.country = sp.get('market')
  if (sp.get('action')) f.action = sp.get('action')
  if (sp.get('category')) f.category = sp.get('category')
  if (sp.get('status') === 'fallback') f.fallback = true
  if (sp.get('status') === 'partner') f.fallback = false
  const from = sp.get('from')
  const to = sp.get('to')
  if (from || to) {
    f.resolved_at = {}
    if (from) f.resolved_at.$gte = new Date(from)
    if (to) f.resolved_at.$lte = new Date(to + 'T23:59:59')
  }
  return f
}

// ---------------------------------------------------------------------------
// core resolver
// ---------------------------------------------------------------------------
async function resolveIntent(db, input, { simulate = false } = {}) {
  const { clean: sane, rejected } = sanitizeResolveInput(input)
  const demo = isDemoMode()
  const clickId = crypto.randomUUID()

  const app = await db.collection(COLLECTIONS.applications).findOne({ slug: sane.app })
  const settings = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })

  // Candidate offers for this app.
  const offerQuery = { active: true, supportedApplications: sane.app }
  if (!demo) offerQuery.isDemo = { $ne: true }
  const offers = await db.collection(COLLECTIONS.offers).find(offerQuery).toArray()
  const partnerSlugs = [...new Set(offers.map((o) => o.partnerSlug))]
  const partners = await db.collection(COLLECTIONS.partners).find({ slug: { $in: partnerSlugs } }).toArray()
  const partnerBySlug = Object.fromEntries(partners.map((p) => [p.slug, p]))
  const candidates = offers.map((o) => ({ offer: o, partner: partnerBySlug[o.partnerSlug] })).filter((c) => c.partner)

  // Deterministic experiment allocation (optional).
  let experiment = null
  let forcedOfferId = null
  const exp = await db.collection(COLLECTIONS.experiments).findOne({
    app: sane.app, action: sane.action, active: true,
  })
  if (exp && exp.trafficPct > 0) {
    const bucket = hashPercent(sane.experimentKey || clickId)
    const variant = bucket < exp.trafficPct
    forcedOfferId = variant ? exp.variantOfferId : exp.controlOfferId
    experiment = { id: exp.id, name: exp.name, arm: variant ? 'variant' : 'control', bucket }
  }

  const ctx = {
    query: sane.query || '', country: sane.country || '', language: sane.language || '',
    category: sane.category || '', brand: sane.brand || '', model: sane.model || '',
    sku: sane.sku || '', click_id: clickId, source: sane.source || '',
  }

  let selection = null
  if (forcedOfferId) {
    const forced = candidates.find((c) => c.offer.id === forcedOfferId)
    if (forced) {
      const one = selectOffer([forced], sane)
      if (one) selection = one
    }
  }
  if (!selection) selection = selectOffer(candidates, sane)

  let result
  if (selection && !selection.blocked) {
    const dest = buildDestination(selection.offer, selection.partner, ctx)
    if (dest.url) {
      result = {
        fallback: false,
        partner_name: selection.partner.name,
        partner_slug: selection.partner.slug,
        offer_id: selection.offer.id,
        offer_currency: selection.offer.currency,
        destination_url: dest.url,
        sponsored: !!selection.offer.sponsored,
        disclosure: selection.offer.disclosure || (settings?.affiliateDisclosure || ''),
        reason: selection.reason,
        score: selection.score,
        candidates_considered: selection.candidatesConsidered,
      }
    } else {
      selection = { blocked: dest.error }
    }
  }

  if (!result) {
    const tmpl = (app && app.fallbackTemplate) || settings?.defaultFallbackTemplate || 'https://www.google.com/search?tbm=shop&q={query}'
    result = {
      fallback: true,
      partner_name: null,
      partner_slug: null,
      offer_id: null,
      offer_currency: null,
      destination_url: buildFallback(tmpl, ctx),
      sponsored: false,
      disclosure: 'No partner offer matched. This is a neutral search generated from your query and market — not a partner recommendation.',
      reason: selection?.blocked
        ? `No safe partner destination (${selection.blocked}); routed to neutral fallback search.`
        : 'No eligible partner offer for this application, action, category and market; routed to neutral fallback search.',
      score: 0,
      candidates_considered: candidates.length,
    }
  }

  const clickDoc = {
    id: clickId,
    app: sane.app,
    action: sane.action,
    country: sane.country || null,
    language: sane.language || null,
    category: sane.category || null,
    brand: sane.brand || null,
    model: sane.model || null,
    query: sane.query ? String(sane.query).slice(0, 120) : null, // non-personal product phrase
    source: sane.source || null,
    partner_slug: result.partner_slug,
    offer_id: result.offer_id,
    offer_currency: result.offer_currency,
    fallback: result.fallback,
    sponsored: result.sponsored,
    reason: result.reason,
    score: result.score,
    destination_url: result.destination_url, // stored server-side only; never open-redirect
    experiment,
    pii_stripped: rejected,
    simulate: !!simulate,
    status: 'resolved',
    resolved_at: new Date(),
    clicked_at: null,
  }
  await db.collection(COLLECTIONS.clickEvents).insertOne(clickDoc)

  if (experiment) {
    await db.collection(COLLECTIONS.experimentAssignments).insertOne({
      id: crypto.randomUUID(), experiment_id: experiment.id, click_id: clickId,
      arm: experiment.arm, created_at: new Date(),
    })
  }

  return {
    click_id: clickId,
    redirect_url: `${baseUrl()}/go/${clickId}`,
    destination_url: result.destination_url,
    partner_name: result.partner_name,
    partner_slug: result.partner_slug,
    disclosure: result.disclosure,
    sponsored: result.sponsored,
    fallback: result.fallback,
    reason: result.reason,
    score: result.score,
    experiment,
    app: sane.app,
    action: sane.action,
    pii_stripped: rejected,
  }
}

// ---------------------------------------------------------------------------
// router
// ---------------------------------------------------------------------------
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const seg = path
  const method = request.method
  const sp = request.nextUrl.searchParams

  try {
    const db = await getDb()
    await ensureSeed(db)

    // ---- health ----
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ service: 'Nytto Relay', status: 'ok', demo: isDemoMode() })
    }

    // ================= PUBLIC =================
    if (route === '/public/products' && method === 'GET') {
      const apps = await db.collection(COLLECTIONS.applications)
        .find({ publicVisible: true }).sort({ section: 1 }).toArray()
      const safe = apps.map((a) => ({
        name: a.name, slug: a.slug, description: a.description, url: a.url,
        category: a.category, status: a.status, section: a.section,
        primaryMarket: a.primaryMarket, icon: a.icon, actions: a.actions,
      }))
      return json({ products: safe })
    }

    if (route === '/public/settings' && method === 'GET') {
      const s = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })
      return json({
        businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Nytto Labs',
        legalName: s?.legalName || '',
        orgNumber: s?.orgNumber || '',
        vatNumber: s?.vatNumber || '',
        registeredAddress: s?.registeredAddress || '',
        supportEmail: s?.supportEmail || 'hello@nyttolabs.com',
        partnerEmail: s?.partnerEmail || 'partners@nyttolabs.com',
        defaultCurrency: s?.defaultCurrency || 'SEK',
        affiliateDisclosure: s?.affiliateDisclosure || '',
        demoMode: isDemoMode(),
      })
    }

    if (route === '/partner-inquiries' && method === 'POST') {
      if (!rateLimit('inquiry', 20)) return json({ error: 'rate_limited' }, 429)
      const body = await request.json()
      const parsed = partnerInquirySchema.safeParse(body)
      if (!parsed.success) return json({ error: 'validation', details: parsed.error.flatten() }, 400)
      const doc = {
        id: crypto.randomUUID(), ...parsed.data,
        consent_timestamp: new Date(), status: 'new', created_at: new Date(),
      }
      await db.collection(COLLECTIONS.partnerInquiries).insertOne(doc)
      // Email delivery is not configured — we store safely and surface in the dashboard.
      return json({ ok: true, id: doc.id, stored: true, emailed: false })
    }

    // ---- resolve (the engine) ----
    if (route === '/resolve' && method === 'POST') {
      if (!rateLimit('resolve', 120)) return json({ error: 'rate_limited' }, 429)
      const body = await request.json()
      const parsed = resolveInputSchema.safeParse(body)
      if (!parsed.success) return json({ error: 'validation', details: parsed.error.flatten() }, 400)
      const out = await resolveIntent(db, parsed.data)
      return json(out)
    }

    // ---- generic conversion webhook (signature + idempotency) ----
    if (route === '/event' && method === 'POST') {
      const raw = await request.text()
      const sig = request.headers.get('x-relay-signature') || ''
      const secret = process.env.RELAY_WEBHOOK_SECRET || ''
      const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex')
      const valid = secret && sig &&
        sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
      if (!valid) return json({ error: 'invalid_signature' }, 401)

      let body
      try { body = JSON.parse(raw) } catch { return json({ error: 'invalid_json' }, 400) }
      const parsed = conversionSchema.safeParse(body)
      if (!parsed.success) return json({ error: 'validation', details: parsed.error.flatten() }, 400)
      const c = parsed.data

      const dup = await db.collection(COLLECTIONS.conversions).findOne({ event_id: c.event_id })
      if (dup) return json({ ok: true, duplicate: true, id: dup.id })

      const click = await db.collection(COLLECTIONS.clickEvents).findOne({ id: c.click_id })
      const currency = (c.currency || click?.offer_currency || 'SEK').toUpperCase()
      const doc = {
        id: crypto.randomUUID(), event_id: c.event_id, click_id: c.click_id,
        app: click?.app || null, partner_slug: click?.partner_slug || null,
        offer_id: click?.offer_id || null, country: click?.country || null,
        currency, amountMinor: toMinor(c.amount, currency), status: c.status,
        source: 'webhook', meta: c.meta || {}, created_at: new Date(),
      }
      await db.collection(COLLECTIONS.conversions).insertOne(doc)
      return json({ ok: true, id: doc.id })
    }

    // ================= AUTH =================
    if (route === '/auth/login' && method === 'POST') {
      if (!rateLimit('login', 10)) return json({ error: 'rate_limited' }, 429)
      const { email, passcode } = await request.json()
      if (!adminEmailsAllow(email) || !verifyPasscode(passcode)) {
        return json({ error: 'invalid_credentials' }, 401)
      }
      const { token, expires } = await createSession(email)
      await audit(email, 'login', 'session', null)
      const res = json({ ok: true, email })
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', expires,
      })
      return res
    }
    if (route === '/auth/logout' && method === 'POST') {
      await destroySession(request)
      const res = json({ ok: true })
      res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
      return res
    }
    if (route === '/auth/me' && method === 'GET') {
      const session = await getSessionFromRequest(request)
      if (!session) return json({ authenticated: false }, 200)
      return json({ authenticated: true, email: session.email, demoMode: isDemoMode() })
    }

    // ================= ADMIN (protected) =================
    if (route.startsWith('/admin')) {
      const session = await getSessionFromRequest(request)
      if (!session) return json({ error: 'unauthorized' }, 401)
      const actor = session.email

      // ---- overview ----
      if (route === '/admin/overview' && method === 'GET') {
        const f = clickFilter(sp)
        const clicks = await db.collection(COLLECTIONS.clickEvents).find(f).toArray()
        const resolved = clicks.length
        const outbound = clicks.filter((c) => c.clicked_at).length
        const fallbacks = clicks.filter((c) => c.fallback).length
        const convs = await db.collection(COLLECTIONS.conversions).find({ status: 'approved' }).toArray()
        const revenue = groupByCurrency(convs)
        const byField = (field, list) => {
          const m = {}
          for (const c of list) {
            const k = c[field] || 'unknown'
            m[k] = m[k] || []
            m[k].push({ currency: c.currency, amountMinor: c.amountMinor })
          }
          return Object.entries(m).map(([k, rows]) => ({ key: k, totals: groupByCurrency(rows) }))
        }
        return json({
          resolvedActions: resolved,
          outboundClicks: outbound,
          conversions: convs.length,
          conversionRate: outbound ? convs.length / outbound : 0,
          revenueByCurrency: revenue,
          fallbackRate: resolved ? fallbacks / resolved : 0,
          revenueByApp: byField('app', convs),
          revenueByPartner: byField('partner_slug', convs),
          revenueByCountry: byField('country', convs),
          demoMode: isDemoMode(),
        })
      }

      // ---- generic collection CRUD ----
      const crud = {
        applications: COLLECTIONS.applications,
        partners: COLLECTIONS.partners,
        offers: COLLECTIONS.offers,
        experiments: COLLECTIONS.experiments,
      }
      const resource = seg[1]
      if (crud[resource]) {
        const col = db.collection(crud[resource])
        const id = seg[2]
        if (method === 'GET' && !id) {
          const items = await col.find({}).sort({ created_at: -1 }).toArray()
          return json({ items: clean(items) })
        }
        if (method === 'POST' && !id) {
          const body = await request.json()
          const doc = { id: crypto.randomUUID(), ...body, isDemo: false, created_at: new Date(), updated_at: new Date() }
          await col.insertOne(doc)
          await audit(actor, 'create', resource, doc.id)
          return json({ item: clean(doc) })
        }
        if (method === 'PUT' && id) {
          const body = await request.json()
          delete body._id; delete body.id
          body.updated_at = new Date()
          await col.updateOne({ id }, { $set: body })
          await audit(actor, 'update', resource, id, body)
          const updated = await col.findOne({ id })
          return json({ item: clean(updated) })
        }
        if (method === 'DELETE' && id) {
          await col.deleteOne({ id })
          await audit(actor, 'delete', resource, id)
          return json({ ok: true })
        }
      }

      // ---- actions catalogue ----
      if (route === '/admin/actions' && method === 'GET') {
        const clicks = await db.collection(COLLECTIONS.clickEvents).find({}).toArray()
        const usage = {}
        for (const c of clicks) usage[c.action] = (usage[c.action] || 0) + 1
        return json({ actions: ACTION_TYPES.map((a) => ({ type: a, uses: usage[a] || 0 })) })
      }

      // ---- clicks ----
      if (route === '/admin/clicks' && method === 'GET') {
        const items = await db.collection(COLLECTIONS.clickEvents).find(clickFilter(sp)).sort({ resolved_at: -1 }).limit(500).toArray()
        return json({ items: clean(items) })
      }

      // ---- conversions ----
      if (route === '/admin/conversions' && method === 'GET') {
        const items = await db.collection(COLLECTIONS.conversions).find({}).sort({ created_at: -1 }).limit(500).toArray()
        return json({ items: clean(items) })
      }
      if (route === '/admin/conversions' && method === 'POST') {
        const body = await request.json()
        const click = await db.collection(COLLECTIONS.clickEvents).findOne({ id: body.click_id })
        if (!click) return json({ error: 'unknown_click_id' }, 400)
        const currency = (body.currency || 'SEK').toUpperCase()
        const eventId = body.event_id || `manual-${crypto.randomUUID()}`
        const dup = await db.collection(COLLECTIONS.conversions).findOne({ event_id: eventId })
        if (dup) return json({ ok: true, duplicate: true, id: dup.id })
        const doc = {
          id: crypto.randomUUID(), event_id: eventId, click_id: body.click_id,
          app: click.app, partner_slug: click.partner_slug, offer_id: click.offer_id,
          country: click.country, currency, amountMinor: toMinor(body.amount || 0, currency),
          status: body.status || 'approved', source: 'manual', meta: {}, created_at: new Date(),
        }
        await db.collection(COLLECTIONS.conversions).insertOne(doc)
        await audit(actor, 'conversion.manual', 'conversion', doc.id)
        return json({ item: clean(doc) })
      }
      if (route === '/admin/conversions/import' && method === 'POST') {
        const { csv: text } = await request.json()
        const lines = String(text || '').trim().split(/\r?\n/)
        const header = lines.shift()?.split(',').map((s) => s.trim())
        let imported = 0
        for (const line of lines) {
          if (!line.trim()) continue
          const cols = line.split(',')
          const row = Object.fromEntries(header.map((h, i) => [h, (cols[i] || '').trim()]))
          if (!row.click_id) continue
          const click = await db.collection(COLLECTIONS.clickEvents).findOne({ id: row.click_id })
          const currency = (row.currency || 'SEK').toUpperCase()
          const eventId = row.event_id || `import-${row.click_id}-${row.amount || 0}`
          const dup = await db.collection(COLLECTIONS.conversions).findOne({ event_id: eventId })
          if (dup) continue
          await db.collection(COLLECTIONS.conversions).insertOne({
            id: crypto.randomUUID(), event_id: eventId, click_id: row.click_id,
            app: click?.app || null, partner_slug: click?.partner_slug || null, offer_id: click?.offer_id || null,
            country: click?.country || null, currency, amountMinor: toMinor(Number(row.amount || 0), currency),
            status: row.status || 'approved', source: 'import', meta: {}, created_at: new Date(),
          })
          imported++
        }
        await audit(actor, 'conversion.import', 'conversion', null, { imported })
        return json({ ok: true, imported })
      }

      // ---- revenue ----
      if (route === '/admin/revenue' && method === 'GET') {
        const convs = await db.collection(COLLECTIONS.conversions).find({ status: 'approved' }).toArray()
        return json({ totalsByCurrency: groupByCurrency(convs), count: convs.length })
      }

      // ---- inquiries ----
      if (route === '/admin/inquiries' && method === 'GET') {
        const items = await db.collection(COLLECTIONS.partnerInquiries).find({}).sort({ created_at: -1 }).toArray()
        return json({ items: clean(items) })
      }

      // ---- simulator ----
      if (route === '/admin/simulate' && method === 'POST') {
        const body = await request.json()
        const parsed = resolveInputSchema.safeParse(body)
        if (!parsed.success) return json({ error: 'validation', details: parsed.error.flatten() }, 400)
        const out = await resolveIntent(db, parsed.data, { simulate: true })
        return json(out)
      }

      // ---- settings ----
      if (route === '/admin/settings' && method === 'GET') {
        const s = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })
        return json({ settings: clean(s) })
      }
      if (route === '/admin/settings' && method === 'PUT') {
        const body = await request.json()
        delete body._id; delete body.key
        body.updated_at = new Date()
        await db.collection(COLLECTIONS.settings).updateOne({ key: 'global' }, { $set: body }, { upsert: true })
        await audit(actor, 'update', 'settings', 'global')
        const s = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })
        return json({ settings: clean(s) })
      }

      // ---- audit log ----
      if (route === '/admin/audit' && method === 'GET') {
        const items = await db.collection(COLLECTIONS.auditLogs).find({}).sort({ created_at: -1 }).limit(200).toArray()
        return json({ items: clean(items) })
      }

      // ---- demo data controls ----
      if (route === '/admin/seed-demo' && method === 'POST') {
        await ensureSeed(db)
        await audit(actor, 'seed-demo', 'system', null)
        return json({ ok: true })
      }
      if (route === '/admin/purge-demo' && method === 'POST') {
        await purgeDemo(db)
        await audit(actor, 'purge-demo', 'system', null)
        return json({ ok: true })
      }

      // ---- CSV export ----
      if (route === '/admin/export' && method === 'GET') {
        const type = sp.get('type') || 'clicks'
        let out = ''
        if (type === 'clicks') {
          const rows = await db.collection(COLLECTIONS.clickEvents).find(clickFilter(sp)).toArray()
          out = csv(rows, [
            { label: 'click_id', get: (r) => r.id }, { label: 'app', get: (r) => r.app },
            { label: 'action', get: (r) => r.action }, { label: 'country', get: (r) => r.country },
            { label: 'category', get: (r) => r.category }, { label: 'partner', get: (r) => r.partner_slug },
            { label: 'fallback', get: (r) => r.fallback }, { label: 'sponsored', get: (r) => r.sponsored },
            { label: 'clicked', get: (r) => !!r.clicked_at }, { label: 'resolved_at', get: (r) => r.resolved_at?.toISOString?.() },
          ])
        } else if (type === 'conversions') {
          const rows = await db.collection(COLLECTIONS.conversions).find({}).toArray()
          out = csv(rows, [
            { label: 'id', get: (r) => r.id }, { label: 'click_id', get: (r) => r.click_id },
            { label: 'app', get: (r) => r.app }, { label: 'partner', get: (r) => r.partner_slug },
            { label: 'country', get: (r) => r.country }, { label: 'currency', get: (r) => r.currency },
            { label: 'amount_minor', get: (r) => r.amountMinor }, { label: 'status', get: (r) => r.status },
            { label: 'created_at', get: (r) => r.created_at?.toISOString?.() },
          ])
        } else if (type === 'partners') {
          const rows = await db.collection(COLLECTIONS.partners).find({}).toArray()
          out = csv(rows, [
            { label: 'name', get: (r) => r.name }, { label: 'slug', get: (r) => r.slug },
            { label: 'network', get: (r) => r.affiliateNetwork }, { label: 'reliability', get: (r) => r.reliabilityScore },
            { label: 'active', get: (r) => r.active }, { label: 'demo', get: (r) => r.isDemo },
          ])
        }
        const res = new NextResponse(out, { status: 200 })
        res.headers.set('Content-Type', 'text/csv')
        res.headers.set('Content-Disposition', `attachment; filename="nytto-${type}.csv"`)
        return withHeaders(res)
      }
    }

    return json({ error: `Route ${route} not found` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return json({ error: 'internal_server_error' }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
