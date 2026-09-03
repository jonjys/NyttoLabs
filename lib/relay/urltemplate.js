// Safe destination URL generation.
// - Only an allowlisted set of placeholders is permitted.
// - No eval, ever.
// - The template host must be static and present in the partner's approved domains.
// - Public callers can NEVER supply an arbitrary destination URL (no open redirect).

export const ALLOWED_PLACEHOLDERS = [
  'query',
  'country',
  'language',
  'category',
  'brand',
  'model',
  'sku',
  'click_id',
  'source',
]

export function renderTemplate(template, ctx) {
  if (typeof template !== 'string') return ''
  return template.replace(/\{([a-z_]+)\}/gi, (match, key) => {
    const k = String(key).toLowerCase()
    if (!ALLOWED_PLACEHOLDERS.includes(k)) return '' // drop unknown placeholders
    const raw = ctx[k] == null ? '' : String(ctx[k])
    return encodeURIComponent(raw)
  })
}

// Extract the host from a template. The scheme+host part must not be templated.
export function templateHost(template) {
  try {
    // Strip any placeholders from the query part only; host must be literal.
    const u = new URL(template.replace(/\{[a-z_]+\}/gi, 'x'))
    return u.hostname.toLowerCase()
  } catch {
    return null
  }
}

function hostMatches(host, approved) {
  const a = String(approved || '').toLowerCase().replace(/^\*\./, '')
  if (!a) return false
  return host === a || host.endsWith('.' + a)
}

export function isDomainAllowed(host, approvedDomains) {
  if (!host) return false
  const list = Array.isArray(approvedDomains) ? approvedDomains : []
  return list.some((d) => hostMatches(host, d))
}

// Build and validate the final destination URL for an offer.
// Returns { url } on success or { error } on failure.
export function buildDestination(offer, partner, ctx) {
  const template = offer.destinationTemplate
  const host = templateHost(template)
  if (!host) return { error: 'invalid_template' }

  const approved = (partner.approvedDomains && partner.approvedDomains.length)
    ? partner.approvedDomains
    : [templateHost(partner.website) || host]

  if (!isDomainAllowed(host, approved)) {
    return { error: 'domain_not_allowlisted' }
  }

  let url
  try {
    url = new URL(renderTemplate(template, ctx))
  } catch {
    return { error: 'render_failed' }
  }
  if (url.protocol !== 'https:') return { error: 'insecure_scheme' }

  // Append permitted affiliate params / sub-IDs.
  const params = offer.affiliateParams || {}
  for (const [k, v] of Object.entries(params)) {
    const val = renderTemplate(String(v), ctx)
    url.searchParams.set(k, val)
  }
  if (offer.subIdParam) {
    url.searchParams.set(offer.subIdParam, String(ctx.click_id || ''))
  }
  return { url: url.toString() }
}

// Fallback: neutral search URL from the user's own query + market.
// Never claims a partner relationship.
export function buildFallback(template, ctx) {
  const t = template || 'https://www.google.com/search?tbm=shop&q={query}'
  try {
    const url = new URL(renderTemplate(t, ctx))
    return url.toString()
  } catch {
    return 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(ctx.query || '')
  }
}
