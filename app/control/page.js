'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard, Boxes, Zap, Handshake, Tags, MousePointerClick, BadgeDollarSign,
  FlaskConical, Inbox, Beaker, Settings as SettingsIcon, BookOpen, LogOut, Radio,
  RefreshCw, Trash2, Download, ArrowUpRight, ShieldAlert, Activity,
} from 'lucide-react'
import { formatMinor } from '@/lib/relay/money'

// ---------- api helpers ----------
const api = {
  get: (p) => fetch(`/api${p}`).then((r) => r.json()),
  post: (p, b) => fetch(`/api${p}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json()),
  put: (p, b) => fetch(`/api${p}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json()),
  del: (p) => fetch(`/api${p}`, { method: 'DELETE' }).then((r) => r.json()),
}
const arr = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean)

const NAV = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'applications', label: 'Applications', icon: Boxes },
  { key: 'actions', label: 'Actions', icon: Zap },
  { key: 'partners', label: 'Partners', icon: Handshake },
  { key: 'offers', label: 'Offers', icon: Tags },
  { key: 'clicks', label: 'Clicks', icon: MousePointerClick },
  { key: 'conversions', label: 'Conversions', icon: Activity },
  { key: 'revenue', label: 'Revenue', icon: BadgeDollarSign },
  { key: 'experiments', label: 'Experiments', icon: FlaskConical },
  { key: 'inquiries', label: 'Partner inquiries', icon: Inbox },
  { key: 'simulator', label: 'Simulator', icon: Beaker },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { key: 'docs', label: 'Integration docs', icon: BookOpen },
]

// ---------- primitives ----------
const card = 'rounded-lg border border-white/10 bg-[#1e1e1a] p-4'
const inputCls = 'w-full rounded-md border border-white/15 bg-[#141412] px-3 py-2 text-sm text-stone-100 outline-none focus:border-emerald-500'
const btn = 'inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50'
const btnGhost = 'inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-stone-200 hover:bg-white/5'

function Field({ label, children }) {
  return <label className="block text-xs font-medium text-stone-400">{label}<div className="mt-1">{children}</div></label>
}
function Table({ cols, rows, empty }) {
  if (!rows?.length) return <div className="rounded-lg border border-dashed border-white/10 bg-[#1a1a17] p-8 text-center text-sm text-stone-500">{empty || 'No data yet.'}</div>
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-[#232320] text-left text-xs uppercase tracking-wide text-stone-400">
          <tr>{cols.map((c) => <th key={c.k} className="px-3 py-2 font-medium">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => (
            <tr key={r.id || i} className="hover:bg-white/5">
              {cols.map((c) => <td key={c.k} className="px-3 py-2 text-stone-200">{c.render ? c.render(r) : String(r[c.k] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function Money({ totals }) {
  if (!totals?.length) return <span className="text-stone-500">0</span>
  return <span>{totals.map((t) => formatMinor(t.amountMinor, t.currency)).join(' \u00b7 ')}</span>
}
function DemoBadge() {
  return <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-amber-500/30">DEMO</span>
}

// =====================================================================
export default function ControlPage() {
  const [me, setMe] = useState(null)
  const [tab, setTab] = useState('overview')

  useEffect(() => { api.get('/auth/me').then(setMe).catch(() => setMe({ authenticated: false })) }, [])

  if (!me) return <div className="flex min-h-screen items-center justify-center bg-[#141412] text-stone-400">Loading\u2026</div>
  if (!me.authenticated) return <Login onDone={() => api.get('/auth/me').then(setMe)} />

  return (
    <div className="flex min-h-screen bg-[#141412] text-stone-200">
      <aside className="hidden w-60 flex-col border-r border-white/10 bg-[#1b1b18] p-3 md:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white"><Radio className="h-4 w-4" /></span>
          <span className="text-sm font-semibold tracking-wide">Relay Control</span>
        </div>
        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${tab === n.key ? 'bg-emerald-600/15 text-emerald-300' : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-2">
          <div className="px-2.5 py-1 text-xs text-stone-500">{me.email}</div>
          <button onClick={async () => { await api.post('/auth/logout', {}); setMe({ authenticated: false }) }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-stone-400 hover:bg-white/5">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-white/10 bg-[#1b1b18] px-5 py-3 md:hidden">
          <select value={tab} onChange={(e) => setTab(e.target.value)} className={inputCls}>
            {NAV.map((n) => <option key={n.key} value={n.key}>{n.label}</option>)}
          </select>
        </div>
        <div className="mx-auto max-w-6xl p-5">
          {tab === 'overview' && <Overview />}
          {tab === 'applications' && <Applications />}
          {tab === 'actions' && <Actions />}
          {tab === 'partners' && <Partners />}
          {tab === 'offers' && <Offers />}
          {tab === 'clicks' && <Clicks />}
          {tab === 'conversions' && <Conversions />}
          {tab === 'revenue' && <Revenue />}
          {tab === 'experiments' && <Experiments />}
          {tab === 'inquiries' && <Inquiries />}
          {tab === 'simulator' && <Simulator />}
          {tab === 'settings' && <SettingsTab />}
          {tab === 'docs' && <Docs />}
        </div>
      </main>
    </div>
  )
}

// ---------- Login ----------
function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const res = await api.post('/auth/login', { email, passcode })
    setBusy(false)
    if (res.ok) onDone(); else setErr('Invalid email or passcode.')
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141412] px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1e1e1a] p-6">
        <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white"><Radio className="h-4 w-4" /></span><span className="font-semibold">Nytto Relay Control</span></div>
        <p className="mt-3 text-sm text-stone-400">Private control plane. Authorised administrators only.</p>
        <div className="mt-5 space-y-3">
          <Field label="Admin email"><input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@nyttolabs.com" /></Field>
          <Field label="Passcode"><input type="password" className={inputCls} value={passcode} onChange={(e) => setPasscode(e.target.value)} /></Field>
        </div>
        {err && <div className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</div>}
        <button disabled={busy} className={`${btn} mt-5 w-full justify-center`}>{busy ? 'Signing in\u2026' : 'Sign in'}</button>
      </form>
    </div>
  )
}

function Head({ title, desc, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-xl font-semibold text-white">{title}</h1>{desc && <p className="mt-1 text-sm text-stone-400">{desc}</p>}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

// ---------- Overview ----------
function Overview() {
  const [d, setD] = useState(null)
  const load = useCallback(() => api.get('/admin/overview').then(setD), [])
  useEffect(() => { load() }, [load])
  if (!d) return <div className="text-stone-500">Loading\u2026</div>
  const pct = (n) => `${(n * 100).toFixed(1)}%`
  const metrics = [
    { label: 'Resolved actions', value: d.resolvedActions },
    { label: 'Outbound clicks', value: d.outboundClicks },
    { label: 'Conversions', value: d.conversions },
    { label: 'Conversion rate', value: pct(d.conversionRate) },
    { label: 'Fallback rate', value: pct(d.fallbackRate) },
  ]
  return (
    <div>
      <Head title="Overview" desc="Honest metrics from real recorded events.">
        <button className={btnGhost} onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</button>
      </Head>
      {d.demoMode && <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"><ShieldAlert className="h-4 w-4" /> Demo mode is ON. Seeded partners/offers are clearly labelled DEMO and only participate while demo mode is enabled.</div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((m) => <div key={m.label} className={card}><div className="text-xs text-stone-400">{m.label}</div><div className="mt-1 text-2xl font-semibold text-white">{m.value}</div></div>)}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className={card}><div className="text-xs text-stone-400">Revenue by currency</div><div className="mt-2 text-lg font-semibold text-emerald-300"><Money totals={d.revenueByCurrency} /></div><p className="mt-2 text-xs text-stone-500">Currencies are never summed together without an explicit rate.</p></div>
        <Breakdown title="Revenue by application" rows={d.revenueByApp} />
        <Breakdown title="Revenue by partner" rows={d.revenueByPartner} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Breakdown title="Revenue by country" rows={d.revenueByCountry} />
      </div>
    </div>
  )
}
function Breakdown({ title, rows }) {
  return (
    <div className={card}>
      <div className="text-xs text-stone-400">{title}</div>
      {rows?.length ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {rows.map((r) => <li key={r.key} className="flex justify-between"><span className="text-stone-300">{r.key}</span><span className="text-emerald-300"><Money totals={r.totals} /></span></li>)}
        </ul>
      ) : <div className="mt-2 text-sm text-stone-500">No revenue recorded yet.</div>}
    </div>
  )
}

// ---------- Applications ----------
function Applications() {
  const [items, setItems] = useState([])
  const load = () => api.get('/admin/applications').then((d) => setItems(d.items || []))
  useEffect(() => { load() }, [])
  const toggle = async (a, key) => { await api.put(`/admin/applications/${a.id}`, { [key]: !a[key] }); load() }
  return (
    <div>
      <Head title="Applications" desc="Products and internal apps that call Relay. Public visibility drives the website product grid. CycleTag, VIESProof, GateZero and Failclosed URLs are repaired from canonical values on seed." />
      <Table
        empty="No applications."
        rows={items}
        cols={[
          { k: 'name', label: 'Name', render: (r) => <span className="font-medium text-white">{r.name} {r.isDemo && <DemoBadge />}</span> },
          { k: 'slug', label: 'Slug' },
          { k: 'url', label: 'URL', render: (r) => r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">{r.url.replace(/^https:\/\//, '')}</a> : '—' },
          { k: 'status', label: 'Status' },
          { k: 'section', label: 'Section' },
          { k: 'actions', label: 'Actions', render: (r) => (r.actions || []).join(', ') },
          { k: 'publicVisible', label: 'Public', render: (r) => <button onClick={() => toggle(r, 'publicVisible')} className={`rounded-full px-2 py-0.5 text-xs ${r.publicVisible ? 'bg-emerald-600/20 text-emerald-300' : 'bg-white/10 text-stone-400'}`}>{r.publicVisible ? 'Visible' : 'Hidden'}</button> },
        ]}
      />
    </div>
  )
}

// ---------- Actions ----------
function Actions() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/actions').then((d) => setItems(d.actions || [])) }, [])
  return (
    <div>
      <Head title="Actions" desc="The shared, generic action model. Every application calls the same Relay API with an action." />
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((a) => <div key={a.type} className={card}><div className="font-mono text-sm text-emerald-300">{a.type}</div><div className="mt-1 text-xs text-stone-400">{a.uses} resolved</div></div>)}
      </div>
    </div>
  )
}

// ---------- Partners ----------
function Partners() {
  const [items, setItems] = useState([])
  const [f, setF] = useState({ name: '', slug: '', website: '', affiliateNetwork: '', relationshipType: 'affiliate', supportedCountries: '', approvedDomains: '', reliabilityScore: 60 })
  const load = () => api.get('/admin/partners').then((d) => setItems(d.items || []))
  useEffect(() => { load() }, [])
  const create = async () => {
    if (!f.name || !f.slug) return
    await api.post('/admin/partners', {
      ...f, reliabilityScore: Number(f.reliabilityScore) || 50, active: true,
      supportedCountries: arr(f.supportedCountries), approvedDomains: arr(f.approvedDomains), supportedCurrencies: [],
    })
    setF({ name: '', slug: '', website: '', affiliateNetwork: '', relationshipType: 'affiliate', supportedCountries: '', approvedDomains: '', reliabilityScore: 60 }); load()
  }
  const toggle = async (p) => { await api.put(`/admin/partners/${p.id}`, { active: !p.active }); load() }
  const del = async (p) => { if (confirm(`Delete partner ${p.name}?`)) { await api.del(`/admin/partners/${p.id}`); load() } }
  return (
    <div>
      <Head title="Partners" desc="Companies that keep checkout & fulfilment. Approved domains are enforced when building destinations.">
        <a className={btnGhost} href="/api/admin/export?type=partners"><Download className="h-4 w-4" /> CSV</a>
      </Head>
      <div className={`${card} mb-4`}>
        <div className="mb-2 text-sm font-medium text-white">Add partner</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Name*"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Slug*"><input className={inputCls} value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></Field>
          <Field label="Website"><input className={inputCls} value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} placeholder="https://" /></Field>
          <Field label="Affiliate network"><input className={inputCls} value={f.affiliateNetwork} onChange={(e) => setF({ ...f, affiliateNetwork: e.target.value })} /></Field>
          <Field label="Relationship"><input className={inputCls} value={f.relationshipType} onChange={(e) => setF({ ...f, relationshipType: e.target.value })} /></Field>
          <Field label="Reliability (0-100)"><input type="number" className={inputCls} value={f.reliabilityScore} onChange={(e) => setF({ ...f, reliabilityScore: e.target.value })} /></Field>
          <Field label="Countries (comma)"><input className={inputCls} value={f.supportedCountries} onChange={(e) => setF({ ...f, supportedCountries: e.target.value })} placeholder="SE, EU" /></Field>
          <Field label="Approved domains (comma)"><input className={inputCls} value={f.approvedDomains} onChange={(e) => setF({ ...f, approvedDomains: e.target.value })} placeholder="partner.com" /></Field>
        </div>
        <button className={`${btn} mt-3`} onClick={create}>Add partner</button>
      </div>
      <Table
        empty="No partners."
        rows={items}
        cols={[
          { k: 'name', label: 'Name', render: (r) => <span className="font-medium text-white">{r.name} {r.isDemo && <DemoBadge />}</span> },
          { k: 'affiliateNetwork', label: 'Network' },
          { k: 'reliabilityScore', label: 'Reliability' },
          { k: 'active', label: 'Active', render: (r) => <button onClick={() => toggle(r)} className={`rounded-full px-2 py-0.5 text-xs ${r.active ? 'bg-emerald-600/20 text-emerald-300' : 'bg-white/10 text-stone-400'}`}>{r.active ? 'Active' : 'Off'}</button> },
          { k: 'x', label: '', render: (r) => <button onClick={() => del(r)} className="text-stone-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button> },
        ]}
      />
    </div>
  )
}

// ---------- Offers ----------
function Offers() {
  const [items, setItems] = useState([])
  const [partners, setPartners] = useState([])
  const [f, setF] = useState({ partnerSlug: '', name: '', destinationTemplate: '', supportedApplications: '', supportedActions: '', markets: '', categories: '', brands: '', commissionType: 'percentage', commissionAmount: 0, currency: 'SEK', priority: 0, sponsored: false })
  const load = () => api.get('/admin/offers').then((d) => setItems(d.items || []))
  useEffect(() => { load(); api.get('/admin/partners').then((d) => setPartners(d.items || [])) }, [])
  const create = async () => {
    if (!f.partnerSlug || !f.name || !f.destinationTemplate) return
    await api.post('/admin/offers', {
      ...f, commissionAmount: Number(f.commissionAmount) || 0, priority: Number(f.priority) || 0, active: true,
      supportedApplications: arr(f.supportedApplications), supportedActions: arr(f.supportedActions),
      markets: arr(f.markets), categories: arr(f.categories), brands: arr(f.brands),
      affiliateParams: {}, subIdParam: 'subid', disclosure: 'Affiliate link \u2014 Nytto Labs may earn a commission at no extra cost to you.',
      stats: { clicks: 0, conversions: 0, conversionRate: 0, rpcMinor: 0, verified: false },
    })
    setF({ ...f, name: '', destinationTemplate: '', supportedApplications: '', supportedActions: '', markets: '', categories: '', brands: '' }); load()
  }
  const toggle = async (o) => { await api.put(`/admin/offers/${o.id}`, { active: !o.active }); load() }
  const del = async (o) => { if (confirm(`Delete offer ${o.name}?`)) { await api.del(`/admin/offers/${o.id}`); load() } }
  return (
    <div>
      <Head title="Offers" desc="Destination templates use only allowlisted placeholders and are validated against the partner's approved domains." />
      <div className={`${card} mb-4`}>
        <div className="mb-2 text-sm font-medium text-white">Add offer</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Partner*">
            <select className={inputCls} value={f.partnerSlug} onChange={(e) => setF({ ...f, partnerSlug: e.target.value })}>
              <option value="">Select\u2026</option>
              {partners.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Name*"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Currency"><input className={inputCls} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></Field>
          <div className="sm:col-span-3"><Field label="Destination template* (placeholders: {query} {country} {language} {category} {brand} {model} {sku} {click_id} {source})"><input className={inputCls} value={f.destinationTemplate} onChange={(e) => setF({ ...f, destinationTemplate: e.target.value })} placeholder="https://partner.com/shop?q={query}&country={country}" /></Field></div>
          <Field label="Applications (comma)"><input className={inputCls} value={f.supportedApplications} onChange={(e) => setF({ ...f, supportedApplications: e.target.value })} placeholder="cycletag" /></Field>
          <Field label="Actions (comma)"><input className={inputCls} value={f.supportedActions} onChange={(e) => setF({ ...f, supportedActions: e.target.value })} placeholder="reorder, replace" /></Field>
          <Field label="Markets (comma)"><input className={inputCls} value={f.markets} onChange={(e) => setF({ ...f, markets: e.target.value })} placeholder="SE, EU" /></Field>
          <Field label="Categories (comma)"><input className={inputCls} value={f.categories} onChange={(e) => setF({ ...f, categories: e.target.value })} placeholder="water-filter" /></Field>
          <Field label="Brands (comma)"><input className={inputCls} value={f.brands} onChange={(e) => setF({ ...f, brands: e.target.value })} /></Field>
          <Field label="Commission type">
            <select className={inputCls} value={f.commissionType} onChange={(e) => setF({ ...f, commissionType: e.target.value })}>
              {['fixed', 'percentage', 'revshare', 'cpl', 'cpc', 'license', 'none'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Commission amount"><input type="number" className={inputCls} value={f.commissionAmount} onChange={(e) => setF({ ...f, commissionAmount: e.target.value })} /></Field>
          <Field label="Priority"><input type="number" className={inputCls} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} /></Field>
          <Field label="Sponsored"><select className={inputCls} value={String(f.sponsored)} onChange={(e) => setF({ ...f, sponsored: e.target.value === 'true' })}><option value="false">No</option><option value="true">Yes (disclosed)</option></select></Field>
        </div>
        <button className={`${btn} mt-3`} onClick={create}>Add offer</button>
      </div>
      <Table
        empty="No offers."
        rows={items}
        cols={[
          { k: 'name', label: 'Offer', render: (r) => <span className="font-medium text-white">{r.name} {r.isDemo && <DemoBadge />} {r.sponsored && <span className="ml-1 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] text-sky-300">SPONSORED</span>}</span> },
          { k: 'partnerSlug', label: 'Partner' },
          { k: 'supportedApplications', label: 'Apps', render: (r) => (r.supportedApplications || []).join(',') },
          { k: 'categories', label: 'Categories', render: (r) => (r.categories || []).join(',') || '\u2014' },
          { k: 'commissionAmount', label: 'Commission', render: (r) => `${r.commissionAmount} ${r.commissionType}` },
          { k: 'active', label: 'Active', render: (r) => <button onClick={() => toggle(r)} className={`rounded-full px-2 py-0.5 text-xs ${r.active ? 'bg-emerald-600/20 text-emerald-300' : 'bg-white/10 text-stone-400'}`}>{r.active ? 'Active' : 'Off'}</button> },
          { k: 'x', label: '', render: (r) => <button onClick={() => del(r)} className="text-stone-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button> },
        ]}
      />
    </div>
  )
}

// ---------- Clicks ----------
function Clicks() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState({ app: '', partner: '', market: '', action: '', status: '' })
  const load = useCallback(() => {
    const p = new URLSearchParams(Object.entries(q).filter(([, v]) => v)).toString()
    api.get(`/admin/clicks${p ? `?${p}` : ''}`).then((d) => setItems(d.items || []))
  }, [q])
  useEffect(() => { load() }, [load])
  const expUrl = () => `/api/admin/export?type=clicks&${new URLSearchParams(Object.entries(q).filter(([, v]) => v)).toString()}`
  return (
    <div>
      <Head title="Clicks" desc="Every resolution is recorded with its decision reason. No personal data is stored.">
        <a className={btnGhost} href={expUrl()}><Download className="h-4 w-4" /> CSV</a>
      </Head>
      <div className="mb-4 grid gap-2 sm:grid-cols-5">
        <input className={inputCls} placeholder="app" value={q.app} onChange={(e) => setQ({ ...q, app: e.target.value })} />
        <input className={inputCls} placeholder="partner slug" value={q.partner} onChange={(e) => setQ({ ...q, partner: e.target.value })} />
        <input className={inputCls} placeholder="market" value={q.market} onChange={(e) => setQ({ ...q, market: e.target.value })} />
        <input className={inputCls} placeholder="action" value={q.action} onChange={(e) => setQ({ ...q, action: e.target.value })} />
        <select className={inputCls} value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value })}><option value="">any</option><option value="partner">partner</option><option value="fallback">fallback</option></select>
      </div>
      <Table
        empty="No clicks recorded yet. Use the Simulator to generate one."
        rows={items}
        cols={[
          { k: 'app', label: 'App' },
          { k: 'action', label: 'Action' },
          { k: 'country', label: 'Market' },
          { k: 'category', label: 'Category' },
          { k: 'partner_slug', label: 'Partner', render: (r) => r.partner_slug || (r.fallback ? <span className="text-amber-300">fallback</span> : '\u2014') },
          { k: 'clicked_at', label: 'Clicked', render: (r) => r.clicked_at ? 'yes' : 'no' },
          { k: 'reason', label: 'Reason', render: (r) => <span className="block max-w-md truncate text-xs text-stone-400" title={r.reason}>{r.reason}</span> },
        ]}
      />
    </div>
  )
}

// ---------- Conversions ----------
function Conversions() {
  const [items, setItems] = useState([])
  const [f, setF] = useState({ click_id: '', amount: '', currency: 'SEK', status: 'approved' })
  const [csvText, setCsvText] = useState('')
  const load = () => api.get('/admin/conversions').then((d) => setItems(d.items || []))
  useEffect(() => { load() }, [])
  const add = async () => { if (!f.click_id) return; const r = await api.post('/admin/conversions', { ...f, amount: Number(f.amount) || 0 }); if (r.error) alert(r.error); setF({ click_id: '', amount: '', currency: 'SEK', status: 'approved' }); load() }
  const imp = async () => { const r = await api.post('/admin/conversions/import', { csv: csvText }); alert(`Imported ${r.imported ?? 0}`); setCsvText(''); load() }
  return (
    <div>
      <Head title="Conversions" desc="Idempotent by event_id. Add manually, import CSV, or receive via the signed webhook.">
        <a className={btnGhost} href="/api/admin/export?type=conversions"><Download className="h-4 w-4" /> CSV</a>
      </Head>
      <div className={`${card} mb-4`}>
        <div className="mb-2 text-sm font-medium text-white">Record conversion (manual)</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Click ID*"><input className={inputCls} value={f.click_id} onChange={(e) => setF({ ...f, click_id: e.target.value })} /></Field>
          <Field label="Amount"><input type="number" className={inputCls} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></Field>
          <Field label="Currency"><input className={inputCls} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></Field>
          <Field label="Status"><select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{['approved', 'pending', 'rejected'].map((s) => <option key={s}>{s}</option>)}</select></Field>
        </div>
        <button className={`${btn} mt-3`} onClick={add}>Record</button>
      </div>
      <div className={`${card} mb-4`}>
        <div className="mb-2 text-sm font-medium text-white">CSV import</div>
        <p className="mb-2 text-xs text-stone-400">Columns: click_id,amount,currency,status,event_id</p>
        <textarea rows={3} className={inputCls} value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder="click_id,amount,currency,status&#10;abc-123,199,SEK,approved" />
        <button className={`${btnGhost} mt-3`} onClick={imp}>Import CSV</button>
      </div>
      <Table
        empty="No conversions yet."
        rows={items}
        cols={[
          { k: 'created_at', label: 'When', render: (r) => new Date(r.created_at).toLocaleString() },
          { k: 'app', label: 'App' },
          { k: 'partner_slug', label: 'Partner' },
          { k: 'amount', label: 'Amount', render: (r) => formatMinor(r.amountMinor, r.currency) },
          { k: 'status', label: 'Status' },
          { k: 'source', label: 'Source' },
        ]}
      />
    </div>
  )
}

// ---------- Revenue ----------
function Revenue() {
  const [d, setD] = useState(null)
  useEffect(() => { api.get('/admin/revenue').then(setD) }, [])
  if (!d) return <div className="text-stone-500">Loading\u2026</div>
  return (
    <div>
      <Head title="Revenue" desc="Grouped by currency. Version one never converts between currencies without an explicit rate." />
      <div className="grid gap-3 sm:grid-cols-3">
        {d.totalsByCurrency?.length ? d.totalsByCurrency.map((t) => (
          <div key={t.currency} className={card}><div className="text-xs text-stone-400">{t.currency}</div><div className="mt-1 text-2xl font-semibold text-emerald-300">{formatMinor(t.amountMinor, t.currency)}</div></div>
        )) : <div className="text-stone-500">No approved revenue yet.</div>}
      </div>
      <p className="mt-4 text-sm text-stone-500">{d.count} approved conversions recorded.</p>
    </div>
  )
}

// ---------- Experiments ----------
function Experiments() {
  const [items, setItems] = useState([])
  const load = () => api.get('/admin/experiments').then((d) => setItems(d.items || []))
  useEffect(() => { load() }, [])
  const toggle = async (e) => { await api.put(`/admin/experiments/${e.id}`, { active: !e.active }); load() }
  const setTraffic = async (e, v) => { await api.put(`/admin/experiments/${e.id}`, { trafficPct: Number(v) || 0 }); load() }
  return (
    <div>
      <Head title="Experiments" desc="Deterministic A/B routing on an anonymous key. No ML claims, no automatic winner declaration." />
      <Table
        empty="No experiments."
        rows={items}
        cols={[
          { k: 'name', label: 'Name', render: (r) => <span className="font-medium text-white">{r.name} {r.isDemo && <DemoBadge />}</span> },
          { k: 'app', label: 'App' },
          { k: 'action', label: 'Action' },
          { k: 'trafficPct', label: 'Variant %', render: (r) => <input type="number" defaultValue={r.trafficPct} onBlur={(e) => setTraffic(r, e.target.value)} className="w-20 rounded-md border border-white/15 bg-[#141412] px-2 py-1 text-sm" /> },
          { k: 'active', label: 'Active', render: (r) => <button onClick={() => toggle(r)} className={`rounded-full px-2 py-0.5 text-xs ${r.active ? 'bg-emerald-600/20 text-emerald-300' : 'bg-white/10 text-stone-400'}`}>{r.active ? 'Running' : 'Stopped'}</button> },
        ]}
      />
    </div>
  )
}

// ---------- Inquiries ----------
function Inquiries() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/inquiries').then((d) => setItems(d.items || [])) }, [])
  return (
    <div>
      <Head title="Partner inquiries" desc="Stored safely in the database. Email delivery is not configured \u2014 nothing is falsely marked as sent." />
      <Table
        empty="No inquiries yet."
        rows={items}
        cols={[
          { k: 'created_at', label: 'When', render: (r) => new Date(r.created_at).toLocaleString() },
          { k: 'company', label: 'Company' },
          { k: 'contactName', label: 'Contact' },
          { k: 'workEmail', label: 'Email' },
          { k: 'markets', label: 'Markets' },
          { k: 'categories', label: 'Categories' },
          { k: 'proposedPartnership', label: 'Proposal' },
        ]}
      />
    </div>
  )
}

// ---------- Simulator ----------
function Simulator() {
  const [f, setF] = useState({ app: 'cycletag', action: 'reorder', country: 'SE', language: 'sv', category: 'water-filter', query: 'Brita Maxtra Pro', brand: 'Brita', model: 'Maxtra Pro' })
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const run = async () => { setBusy(true); const r = await api.post('/admin/simulate', f); setRes(r); setBusy(false) }
  return (
    <div>
      <Head title="Simulator" desc="Run a CycleTag (or any app) request through the real resolver and inspect the decision." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <div className="grid gap-3 sm:grid-cols-2">
            {['app', 'action', 'country', 'language', 'category', 'query', 'brand', 'model'].map((k) => (
              <Field key={k} label={k}><input className={inputCls} value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></Field>
            ))}
          </div>
          <button disabled={busy} className={`${btn} mt-3`} onClick={run}>{busy ? 'Resolving\u2026' : 'Resolve request'}</button>
        </div>
        <div className={card}>
          {!res ? <div className="text-sm text-stone-500">Run a request to see the resolver decision.</div> : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                {res.fallback ? <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">FALLBACK</span> : <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs text-emerald-300">PARTNER</span>}
                {res.sponsored && <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">SPONSORED</span>}
                <span className="text-stone-400">score {res.score}</span>
              </div>
              <div><span className="text-stone-400">Partner:</span> <span className="text-white">{res.partner_name || '\u2014'}</span></div>
              <div><span className="text-stone-400">Reason:</span> <span className="text-stone-200">{res.reason}</span></div>
              <div><span className="text-stone-400">Disclosure:</span> <span className="text-stone-200">{res.disclosure}</span></div>
              <div className="break-all"><span className="text-stone-400">Destination:</span> <span className="text-emerald-300">{res.destination_url}</span></div>
              <div className="break-all"><span className="text-stone-400">Click ID:</span> <span className="font-mono text-xs text-stone-300">{res.click_id}</span></div>
              <a href={res.redirect_url} target="_blank" rel="noopener noreferrer" className={btnGhost}>Follow safe redirect <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Settings ----------
function SettingsTab() {
  const [s, setS] = useState(null)
  const [saved, setSaved] = useState(false)
  useEffect(() => { api.get('/admin/settings').then((d) => setS(d.settings || {})) }, [])
  if (!s) return <div className="text-stone-500">Loading\u2026</div>
  const save = async () => { await api.put('/admin/settings', s); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const fields = [
    ['legalName', 'Legal business name'], ['orgNumber', 'Organisation number'], ['vatNumber', 'VAT number'],
    ['registeredAddress', 'Registered address'], ['supportEmail', 'Support email'], ['partnerEmail', 'Partner email'],
    ['defaultCurrency', 'Default currency'], ['defaultFallbackTemplate', 'Default fallback template'],
  ]
  return (
    <div>
      <Head title="Settings" desc="Business & legal configuration. Legal pages avoid claiming registration until these are filled.">
        <button className={btnGhost} onClick={async () => { await api.post('/admin/seed-demo', {}); alert('Demo data ensured.') }}>Seed demo</button>
        <button className={btnGhost} onClick={async () => { if (confirm('Remove all DEMO partners/offers/experiments?')) { await api.post('/admin/purge-demo', {}); alert('Demo data purged.') } }}>Purge demo</button>
      </Head>
      <div className={`${card} grid gap-3 sm:grid-cols-2`}>
        {fields.map(([k, label]) => (
          <Field key={k} label={label}><input className={inputCls} value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} /></Field>
        ))}
        <div className="sm:col-span-2"><Field label="Affiliate disclosure"><textarea rows={2} className={inputCls} value={s.affiliateDisclosure || ''} onChange={(e) => setS({ ...s, affiliateDisclosure: e.target.value })} /></Field></div>
        <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-white/10 bg-[#141412] px-3 py-2">
          <div>
            <div className="text-sm font-medium text-white">Demo mode</div>
            <div className="text-xs text-stone-400">When ON, clearly-labelled DEMO partners/offers participate in routing. Turn OFF for production so only real partners route.</div>
          </div>
          <button onClick={() => setS({ ...s, demoMode: !s.demoMode })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${s.demoMode ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30' : 'bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/30'}`}>
            {s.demoMode ? 'Demo ON' : 'Production'}
          </button>
        </div>
      </div>
      <button className={`${btn} mt-3`} onClick={save}>{saved ? 'Saved' : 'Save settings'}</button>
    </div>
  )
}

// ---------- Docs ----------
function Docs() {
  // Start with a stable SSR value, then upgrade to the real origin after mount
  // to avoid a hydration mismatch (server has no window).
  const [base, setBase] = useState('https://nyttolabs.com')
  useEffect(() => { setBase(window.location.origin) }, [])

  const example = `// CycleTag \u2192 Nytto Relay (client helper, TypeScript)
export async function resolveReorder(ctx: {
  query: string; country: string; language?: string;
  category?: string; brand?: string; model?: string; source?: string;
}) {
  const res = await fetch('${base}/api/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app: 'cycletag', action: 'reorder', ...ctx }),
  })
  const data = await res.json()
  // Send the user to the safe redirect. Never expose destination_url as an open redirect.
  window.location.href = data.redirect_url
}`
  const generic = `POST ${base}/api/resolve
{
  "app": "viesproof",        // your application slug
  "action": "verify",         // shared action model
  "country": "SE",
  "category": "accounting"
}`
  const webhook = `POST ${base}/api/event
Header: X-Relay-Signature: hex(hmac_sha256(rawBody, RELAY_WEBHOOK_SECRET))
{
  "click_id": "<from resolve>",
  "event_id": "<unique, idempotent>",
  "amount": 199,
  "currency": "SEK",
  "status": "approved"
}`
  const Block = ({ title, code }) => (
    <div className={card}>
      <div className="mb-2 flex items-center justify-between"><div className="text-sm font-medium text-white">{title}</div>
        <button className={btnGhost} onClick={() => navigator.clipboard?.writeText(code)}>Copy</button></div>
      <pre className="overflow-x-auto rounded-md bg-[#111110] p-3 text-xs text-emerald-200"><code>{code}</code></pre>
    </div>
  )
  return (
    <div>
      <Head title="Integration documentation" desc="Every Nytto Labs app uses the same Relay API with its own slug and action." />
      <div className="space-y-4">
        <div className={card}>
          <div className="text-sm font-medium text-white">How CycleTag connects (privacy-first)</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-300">
            <li>No CycleTag account required; tag contents stay client-side.</li>
            <li>Relay receives only minimal commerce context (query, market, category, brand, model, source).</li>
            <li>The complete QR payload is never sent or persisted.</li>
            <li>Introduce this via a separate reviewed change in the CycleTag repository \u2014 do not modify the live app here.</li>
          </ul>
        </div>
        <Block title="CycleTag client helper (copy into the CycleTag repo)" code={example} />
        <Block title="Generic app request (any application)" code={generic} />
        <Block title="Conversion webhook (server-to-server, signed)" code={webhook} />
      </div>
    </div>
  )
}
