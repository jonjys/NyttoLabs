// The one site menu. Every page header (components/site/nav.jsx, the landing
// page header and its sidebar/command palette) reads from here, so the menu
// is the same everywhere. `sv` is the Swedish label.
export const SITE_NAV_LINKS = [
  { href: '/', label: 'Home', sv: 'Hem' },
  { href: '/products', label: 'Products', sv: 'Produkter' },
  { href: '/partners', label: 'Partners', sv: 'Partner' },
  { href: '/contact', label: 'Contact', sv: 'Kontakt' },
]

// The header call to action, shared for the same reason.
export const SITE_NAV_CTA = { href: '/contact', label: 'Get in touch', sv: 'Hör av dig' }

/** A nav item's label in the given locale. */
export const navLabel = (item, locale) => (locale === 'sv' && item.sv ? item.sv : item.label)
