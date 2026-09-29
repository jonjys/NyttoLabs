import { PUBLIC_HELLO_EMAIL, PUBLIC_STATUS_GROUPS } from '@/lib/relay/catalog'
import { SITE_ORIGIN } from '@/lib/site'
import type { NavSection, PublicProduct } from './types'

// Catalog statuses shown on the landing page, in display order. Only 'live'
// counts towards the live counter; private-beta products are shown after them.
const SHOWCASE_STATUSES = ['live', 'private-beta']

export function showcaseProducts(all: ReadonlyArray<PublicProduct | null>): PublicProduct[] {
  const list = all.filter((p): p is PublicProduct => !!p && SHOWCASE_STATUSES.includes(p.status))
  return SHOWCASE_STATUSES.flatMap((status) => list.filter((p) => p.status === status))
}

/** Human label for a catalog status ("Live", "Private beta", …), from the catalog itself. */
export function statusLabel(status: string): string {
  const group = (PUBLIC_STATUS_GROUPS as ReadonlyArray<{ key: string; title: string }>).find((g) => g.key === status)
  return group ? group.title : status
}

// Sidebar / palette sections. #top, #products, #relay and #partners are the
// anchors the previous landing page already exposed. The product ids are
// set on the product tiles inside #products.
export const NAV_SECTIONS: NavSection[] = [
  { num: '00', label: 'Studio Overview', href: '#top' },
  { num: '01', label: 'DeployDoctor', href: '#deploydoctor' },
  { num: '02', label: 'CycleTag', href: '#cycletag' },
  { num: '03', label: 'Vatidence', href: '#vatidence' },
  { num: '04', label: 'Curl-to-Buy', href: '#curl-to-buy' },
  { num: '05', label: 'Failclosed', href: '#failclosed' },
  { num: '06', label: 'Partners & Contact', href: '#partners' },
]

// Existing site routes (see lib/site.js PUBLIC_ROUTES and components/site/nav.jsx).
export const SITE_ROUTES = [
  { href: '/products', label: 'All products' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
] as const

// Maps catalog slugs to the in-page anchor used for each product tile.
export const PRODUCT_ANCHORS: Record<string, string> = {
  cycletag: 'cycletag',
  viesproof: 'vatidence',
  'curl-to-buy': 'curl-to-buy',
  deploydoctor: 'deploydoctor',
  failclosed: 'failclosed',
}

export const PRODUCT_ACCENTS: Record<string, string> = {
  cycletag: '#00ff9d',
  viesproof: '#00f5ff',
  'curl-to-buy': '#ff8a1e',
  deploydoctor: '#b388ff',
  failclosed: '#ff5c7a',
}

export const HELLO_HREF = `mailto:${PUBLIC_HELLO_EMAIL}`
export const HELLO_EMAIL = PUBLIC_HELLO_EMAIL

// Public Relay endpoints, taken from app/api/[[...path]]/route.js, README.md and
// docs/PARTNER-INTEGRATION.md. Only copied to the clipboard, never requested.
export const API_ENDPOINTS = [
  { id: 'resolve', method: 'POST', path: '/api/resolve', label: 'Relay resolver' },
  { id: 'event', method: 'POST', path: '/api/event', label: 'Signed conversion webhook' },
  { id: 'products', method: 'GET', path: '/api/public/products', label: 'Public product catalog' },
] as const

export function endpointUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`
}

// The resolve example from README.md ("Test routing"), with $BASE filled in.
export const RESOLVE_CURL = `curl -s -X POST ${SITE_ORIGIN}/api/resolve -H 'Content-Type: application/json' \\
  -d '{"app":"cycletag","action":"reorder","country":"SE","category":"water-filter","query":"Brita Maxtra Pro","brand":"Brita"}'`

export const STEPS = [
  { n: '01', title: 'Intent appears', body: 'A scan, a VAT lookup, an API call — a moment where someone needs a next step.' },
  { n: '02', title: 'Relay resolves', body: 'Deterministic match against approved partners and allowlisted destination templates.' },
  { n: '03', title: 'Attribution recorded', body: 'A safe redirect through /go carries a click id; conversions arrive on a signed webhook.' },
  { n: '04', title: 'Or nothing happens', body: 'No approved answer means no redirect. Fail-closed beats a bad recommendation.' },
]
