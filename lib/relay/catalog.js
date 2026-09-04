// Canonical public portfolio for Nytto Labs.
// Code is the source of truth for live product URLs and public status so a
// stale Mongo row cannot send visitors to the wrong domain or blank the grid.
// Netfold / Skrivklart / Invoic stay out of this catalog on purpose.

export const PUBLIC_HELLO_EMAIL = 'hello@nyttolabs.com'
export const PUBLIC_SUPPORT_EMAIL = 'support@nyttolabs.com'
export const PUBLIC_PRIVACY_EMAIL = 'privacy@nyttolabs.com'
export const PUBLIC_BILLING_EMAIL = 'billing@nyttolabs.com'
// Partnerships use the general inbox. Do not publish partners@ on the public site.
export const PUBLIC_PARTNER_EMAIL = PUBLIC_HELLO_EMAIL

export const ALLOWED_PUBLIC_EMAILS = [
  PUBLIC_HELLO_EMAIL,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PRIVACY_EMAIL,
  PUBLIC_BILLING_EMAIL,
]

export const PUBLIC_PORTFOLIO_SLUGS = ['cycletag', 'viesproof', 'gatezero']

export const CANONICAL_PRODUCT_URLS = {
  cycletag: 'https://cycletag.eu/',
  viesproof: 'https://viesproof.eu/',
  gatezero: 'https://www.getgatezero.com/',
}

const AFFILIATE_DISCLOSURE =
  'Some links on Nytto Labs products are partner links. Nytto Labs may earn compensation when you choose a partner, at no additional cost to you unless clearly stated.'

export const DEFAULT_PUBLIC_SETTINGS = {
  businessName: 'Nytto Labs',
  legalName: '',
  orgNumber: '',
  vatNumber: '',
  registeredAddress: '',
  helloEmail: PUBLIC_HELLO_EMAIL,
  supportEmail: PUBLIC_SUPPORT_EMAIL,
  partnerEmail: PUBLIC_PARTNER_EMAIL,
  privacyEmail: PUBLIC_PRIVACY_EMAIL,
  billingEmail: PUBLIC_BILLING_EMAIL,
  defaultCurrency: 'SEK',
  affiliateDisclosure: AFFILIATE_DISCLOSURE,
  demoMode: false,
}

export function seedApplications() {
  const now = new Date()
  const base = { created_at: now, updated_at: now }
  return [
    {
      ...base,
      id: 'app-cycletag',
      name: 'CycleTag',
      slug: 'cycletag',
      description: 'Stateless QR reorder labels. One scan brings back the exact replacement search — no app, no account.',
      url: CANONICAL_PRODUCT_URLS.cycletag,
      category: 'Consumer reordering',
      status: 'building',
      section: 'building',
      primaryMarket: 'EU',
      icon: 'QrCode',
      publicVisible: true,
      isInfrastructure: false,
      actions: ['reorder', 'replace', 'print', 'compare'],
      fallbackTemplate: 'https://www.google.com/search?tbm=shop&q={query}',
    },
    {
      ...base,
      id: 'app-viesproof',
      name: 'VIESProof',
      slug: 'viesproof',
      description: 'Bulk EU VAT checks against VIES, with consultation-number proof finance teams can export.',
      url: CANONICAL_PRODUCT_URLS.viesproof,
      category: 'B2B verification',
      status: 'live',
      section: 'live',
      primaryMarket: 'EU',
      icon: 'BadgeCheck',
      publicVisible: true,
      isInfrastructure: false,
      actions: ['verify', 'export', 'compare'],
      fallbackTemplate: 'https://www.google.com/search?q={query}',
    },
    {
      ...base,
      id: 'app-gatezero',
      name: 'GateZero',
      slug: 'gatezero',
      description: 'API spend router: cheaper routes when you allow them, fail-closed when spend runs out.',
      url: CANONICAL_PRODUCT_URLS.gatezero,
      category: 'Developer infrastructure',
      status: 'building',
      section: 'building',
      primaryMarket: 'Global',
      icon: 'Network',
      publicVisible: true,
      isInfrastructure: false,
      actions: ['monitor', 'compare', 'route'],
      fallbackTemplate: 'https://www.google.com/search?q={query}',
    },
    {
      ...base,
      id: 'app-avw',
      name: 'AI Venture Worker',
      slug: 'ai-venture-worker',
      description: 'Internal venture-analysis and product-validation engine.',
      url: 'https://ai-venture-worker.vercel.app/',
      category: 'Ventures',
      status: 'ventures',
      section: 'ventures',
      primaryMarket: 'Global',
      icon: 'FlaskConical',
      publicVisible: false,
      isInfrastructure: false,
      actions: ['launch', 'host', 'register', 'compare'],
      fallbackTemplate: 'https://www.google.com/search?q={query}',
    },
    {
      ...base,
      id: 'app-relay',
      name: 'Nytto Relay',
      slug: 'nytto-relay',
      description: 'The invisible revenue and partner-routing layer underneath Nytto Labs products.',
      url: 'https://www.nyttolabs.com',
      category: 'Internal infrastructure',
      status: 'internal',
      section: 'internal',
      primaryMarket: 'Global',
      icon: 'Radio',
      publicVisible: false,
      isInfrastructure: true,
      actions: ['route'],
      fallbackTemplate: '',
    },
  ]
}

export function isPublicPortfolioSlug(slug) {
  return PUBLIC_PORTFOLIO_SLUGS.includes(String(slug || ''))
}

export function isPublicPortfolioApp(app) {
  if (!app) return false
  if (app.isInfrastructure === true) return false
  if (app.publicVisible === false) return false
  return isPublicPortfolioSlug(app.slug)
}

export function publicProductShape(app) {
  if (!app) return null
  const slug = String(app.slug || '')
  const canonical = CANONICAL_PRODUCT_URLS[slug]
  return {
    name: app.name,
    slug,
    description: app.description,
    url: canonical || app.url || '',
    category: app.category,
    status: app.status,
    section: app.section,
    primaryMarket: app.primaryMarket,
    icon: app.icon,
    actions: Array.isArray(app.actions) ? app.actions : [],
  }
}

export function defaultPublicProducts() {
  return seedApplications()
    .filter(isPublicPortfolioApp)
    .map(publicProductShape)
}

export function applyCanonicalUrls(products) {
  return (Array.isArray(products) ? products : []).map(publicProductShape).filter(Boolean)
}

// Always return the canonical public three. Mongo outages, empty results, or
// a private app marked publicVisible cannot blank or leak the public grid.
export function mergePublicCatalog(products) {
  const incoming = (Array.isArray(products) ? products : [])
    .filter(isPublicPortfolioApp)
    .map(publicProductShape)
    .filter(Boolean)
  const bySlug = Object.fromEntries(incoming.map((p) => [p.slug, p]))
  return defaultPublicProducts().map((canonical) => {
    const overlay = bySlug[canonical.slug]
    if (!overlay) return canonical
    return {
      ...canonical,
      name: overlay.name || canonical.name,
      description: overlay.description || canonical.description,
      category: overlay.category || canonical.category,
      icon: overlay.icon || canonical.icon,
      primaryMarket: overlay.primaryMarket || canonical.primaryMarket,
      actions: overlay.actions?.length ? overlay.actions : canonical.actions,
      url: CANONICAL_PRODUCT_URLS[canonical.slug] || overlay.url || canonical.url,
      status: canonical.status,
      section: canonical.section,
      slug: canonical.slug,
    }
  })
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function isPublicRoleEmail(value) {
  const v = normalizeEmail(value)
  return ALLOWED_PUBLIC_EMAILS.includes(v)
}

export function publicEmail(value, fallback) {
  const v = normalizeEmail(value)
  if (v === 'partners@nyttolabs.com') return PUBLIC_HELLO_EMAIL
  return ALLOWED_PUBLIC_EMAILS.includes(v) ? v : fallback
}

export function publicSettingsShape(settings, extras = {}) {
  return {
    businessName: 'Nytto Labs',
    legalName: settings?.legalName || '',
    orgNumber: settings?.orgNumber || '',
    vatNumber: settings?.vatNumber || '',
    registeredAddress: settings?.registeredAddress || '',
    helloEmail: PUBLIC_HELLO_EMAIL,
    supportEmail: PUBLIC_SUPPORT_EMAIL,
    partnerEmail: PUBLIC_PARTNER_EMAIL,
    privacyEmail: PUBLIC_PRIVACY_EMAIL,
    billingEmail: PUBLIC_BILLING_EMAIL,
    defaultCurrency: settings?.defaultCurrency || 'SEK',
    affiliateDisclosure: settings?.affiliateDisclosure || AFFILIATE_DISCLOSURE,
    demoMode: !!extras.demoMode,
  }
}
