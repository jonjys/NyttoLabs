// Canonical public portfolio for Nytto Labs.
// Code is the source of truth for live product URLs so a stale Mongo row
// cannot send visitors to the wrong domain. Netfold / Skrivklart / Invoic
// stay out of this catalog on purpose.

export const PUBLIC_SUPPORT_EMAIL = 'hello@nyttolabs.com'
export const PUBLIC_PARTNER_EMAIL = 'partners@nyttolabs.com'

export const CANONICAL_PRODUCT_URLS = {
  cycletag: 'https://www.cycletag.eu/',
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
  supportEmail: PUBLIC_SUPPORT_EMAIL,
  partnerEmail: PUBLIC_PARTNER_EMAIL,
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
      status: 'live',
      section: 'flagship',
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
      url: 'https://nyttolabs.com',
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
    .filter((a) => a.publicVisible)
    .map(publicProductShape)
}

export function applyCanonicalUrls(products) {
  return (Array.isArray(products) ? products : []).map(publicProductShape).filter(Boolean)
}

export function isPublicRoleEmail(value) {
  const v = String(value || '').trim().toLowerCase()
  return v.endsWith('@nyttolabs.com') && v.includes('@') && !v.startsWith('@')
}

export function publicEmail(value, fallback) {
  return isPublicRoleEmail(value) ? String(value).trim().toLowerCase() : fallback
}

export function publicSettingsShape(settings, extras = {}) {
  return {
    businessName: 'Nytto Labs',
    legalName: settings?.legalName || '',
    orgNumber: settings?.orgNumber || '',
    vatNumber: settings?.vatNumber || '',
    registeredAddress: settings?.registeredAddress || '',
    supportEmail: publicEmail(settings?.supportEmail, PUBLIC_SUPPORT_EMAIL),
    partnerEmail: publicEmail(settings?.partnerEmail, PUBLIC_PARTNER_EMAIL),
    defaultCurrency: settings?.defaultCurrency || 'SEK',
    affiliateDisclosure: settings?.affiliateDisclosure || AFFILIATE_DISCLOSURE,
    demoMode: !!extras.demoMode,
  }
}
