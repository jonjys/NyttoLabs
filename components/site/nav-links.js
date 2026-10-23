// The one site menu. Every header reads it, so a page never drifts out of
// step with the others. The logo links home; the CTA is the contact page.
export const SITE_NAV_LINKS = [
  { href: '/products', label: 'Tools', sv: 'Verktyg' },
  { href: '/fix', label: 'Custom work', sv: 'Uppdrag' },
  { href: '/partners', label: 'Partners', sv: 'Partner' },
]

export const SITE_NAV_CTA = { href: '/contact', label: 'Get in touch', sv: 'Hör av dig' }

export const navLabel = (item, locale) => (locale === 'sv' && item.sv ? item.sv : item.label)
