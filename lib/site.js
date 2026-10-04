// Canonical public origin. Live production 308s apex → https://www.nyttolabs.com/
export const SITE_ORIGIN = 'https://www.nyttolabs.com'

// Public legal identity. Do not publish personal identity numbers, VAT IDs, or residential addresses.
export const OPERATOR_LINE = 'Nytto Labs, operated by Fredrik Kornelind (Sweden).'
export const FTAX_LINE = 'Approved for F-tax.'
export const VAT_STATUS_LINE = 'VAT registered.'
export const FOOTER_IDENTITY_LINE = `${OPERATOR_LINE} ${FTAX_LINE}`
export const LEGAL_OPERATOR_PARAGRAPH = `${OPERATOR_LINE} Swedish sole trader. ${FTAX_LINE} ${VAT_STATUS_LINE}`

export const HOME_TITLE = 'Nytto Labs — deploy checks, reorder labels, VAT checks, file sales, inventory sync'
export const HOME_DESCRIPTION = 'DeployDoctor Vercel scans, StayTag QR reorder labels, Vatidence VIES VAT checks, Nytto Checkout file sales Failclosed inventory sync and CSV Rescue file cleanup. Swedish software, F-tax.'

export const PRODUCTS_DESCRIPTION = 'Six live products: DeployDoctor Vercel checks, StayTag reorder labels, Vatidence VAT checks, Nytto Checkout file sales Failclosed inventory sync and CSV Rescue file cleanup. Swedish software, F-tax.'

export const PUBLIC_ROUTES = [
  { path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION },
  { path: '/products', title: 'Products — Nytto Labs', description: PRODUCTS_DESCRIPTION },
  { path: '/partners', title: 'Partners — Nytto Labs', description: 'Partner with Nytto Labs. You keep checkout and fulfilment; we connect high-intent users to a relevant next action.' },
  { path: '/contact', title: 'Contact — Nytto Labs', description: 'Contact Nytto Labs at hello@nyttolabs.com for general questions and partnerships.' },
  { path: '/privacy', title: 'Privacy — Nytto Labs', description: 'How Nytto Labs handles data. Privacy-first routing, no analytics cookies.' },
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
