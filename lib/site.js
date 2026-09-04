// Canonical public origin. Live production 308s apex → https://www.nyttolabs.com/
export const SITE_ORIGIN = 'https://www.nyttolabs.com'
export const OPERATOR_LINE = 'Operated by Nytto Labs, Sweden.'

export const PUBLIC_ROUTES = [
  { path: '/', title: 'Nytto Labs — Focused software. Invisible infrastructure.', description: 'Nytto Labs builds focused digital products and quietly connects people to the right next product, service, or action.' },
  { path: '/products', title: 'Products — Nytto Labs', description: 'The public Nytto Labs portfolio: CycleTag, VIESProof, and GateZero — proof of what the company builds.' },
  { path: '/partners', title: 'Partners — Nytto Labs', description: 'Partner with Nytto Labs. You keep checkout and fulfilment; we connect high-intent users to a relevant next action.' },
  { path: '/contact', title: 'Contact — Nytto Labs', description: 'Contact Nytto Labs: hello@ for general and partnerships, plus support, privacy, and billing inboxes.' },
  { path: '/privacy', title: 'Privacy — Nytto Labs', description: 'How Nytto Labs handles data. Privacy-first routing; contact privacy@nyttolabs.com.' },
  { path: '/terms', title: 'Terms — Nytto Labs', description: 'Terms for the Nytto Labs website. Operated by Nytto Labs, Sweden.' },
]

export function siteUrl(path = '/') {
  const p = !path || path === '/' ? '/' : (path.startsWith('/') ? path : `/${path}`)
  return p === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${p}`
}

export function pageMetadata({ title, description, path }) {
  const url = siteUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Nytto Labs',
      type: 'website',
    },
  }
}
