// The one site menu. Every page header (components/site/nav.jsx, the landing
// page header and its sidebar/command palette) reads from here, so the menu
// is the same everywhere.
export const SITE_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
]

// The header call to action, shared for the same reason.
export const SITE_NAV_CTA = { href: '/contact', label: 'Get in touch' }
