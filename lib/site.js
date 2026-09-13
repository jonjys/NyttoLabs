// Canonical public origin. Live production 308s apex → https://www.nyttolabs.com/
export const SITE_ORIGIN = 'https://www.nyttolabs.com'

// Public legal identity. Do not publish personal identity numbers, VAT IDs, or residential addresses.
export const OPERATOR_LINE = 'Nytto Labs, operated by Fredrik Kornelind (Sweden).'
export const FTAX_LINE = 'Approved for F-tax.'
export const VAT_STATUS_LINE = 'VAT registered.'
export const FOOTER_IDENTITY_LINE = `${OPERATOR_LINE} ${FTAX_LINE}`
export const LEGAL_OPERATOR_PARAGRAPH = `${OPERATOR_LINE} Swedish sole trader. ${FTAX_LINE} ${VAT_STATUS_LINE}`

export const PUBLIC_ROUTES = [
  { path: '/', title: 'Nytto Labs — Focused software. Invisible infrastructure.', description: 'Nytto Labs builds focused digital products and quietly connects people to the right next product, service, or action.' },
  { path: '/products', title: 'Products — Nytto Labs', description: 'The public Nytto Labs portfolio: CycleTag, Vatidence, Curl-to-Buy, GateZero, and Failclosed — proof of what the company builds.' },
  { path: '/partners', title: 'Partners — Nytto Labs', description: 'Partner with Nytto Labs. You keep checkout and fulfilment; we connect high-intent users to a relevant next action.' },
  { path: '/contact', title: 'Contact — Nytto Labs', description: 'Contact Nytto Labs: hello@ for general and partnerships, plus support, privacy, and billing inboxes.' },
  { path: '/privacy', title: 'Privacy — Nytto Labs', description: 'How Nytto Labs handles data. Privacy-first routing; contact privacy@nyttolabs.com.' },
  { path: '/terms', title: 'Terms — Nytto Labs', description: 'Terms for the Nytto Labs website. Nytto Labs, operated by Fredrik Kornelind (Sweden).' },
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
      images: [{ url: siteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Nytto Labs — focused software from Stockholm' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [siteUrl('/opengraph-image')] },
  }
}
