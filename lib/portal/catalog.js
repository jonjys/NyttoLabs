// Presentation-only catalog. Relay's API catalog and database are independent.
// Order and canonical domains follow the owner's nine-product mapping.
// Preview addresses were checked against Vercel and the public sites on 2026-09-07.
export const PORTAL_PRODUCTS = [
  {
    slug: 'cycletag', name: 'CycleTag', icon: 'QrCode', color: 'lime',
    category: 'everyday', group: 'standalone', status: 'Live',
    tagline: 'The right refill. One scan away.',
    description: 'Make a QR reorder label for filters, toner and the things you replace. Print it, stick it, scan it when you need more.',
    url: 'https://cycletag.eu/', canonicalUrl: 'https://cycletag.eu/',
    action: 'Create a free tag', detail: 'Free single labels · no account',
    keywords: 'printer coffee water vacuum consumables replacement labels qr ebay',
  },
  {
    slug: 'gatezero', name: 'GetGateZero', icon: 'Network', color: 'violet',
    category: 'developer', group: 'standalone', status: 'Public beta',
    tagline: 'Put a boundary on API spend.',
    description: 'Route API requests with budget controls, opt-in cheaper model routes and a ledger of costs and savings.',
    url: 'https://getgatezero.com/', canonicalUrl: 'https://getgatezero.com/',
    action: 'Explore GetGateZero', detail: 'API routing · budget controls',
    keywords: 'gatezero ai openai anthropic cost saving proxy tokens budget',
  },
  {
    slug: 'viesproof', name: 'VIESproof', icon: 'BadgeCheck', color: 'blue',
    category: 'business', group: 'standalone', status: 'Live',
    tagline: 'Check the VAT number. Keep the evidence.',
    description: 'Check EU VAT numbers against VIES. Run a single check or a paid batch with exportable verification records.',
    url: 'https://viesproof.eu/', canonicalUrl: 'https://viesproof.eu/',
    action: 'Check VAT numbers', detail: 'Free single check · paid bulk checks',
    keywords: 'vat tax eu finance csv pdf verification consultation number',
  },
  {
    slug: 'curl-to-buy', name: 'Invisible / Curl-to-Buy', icon: 'FileDown', color: 'amber',
    category: 'business', group: 'subdomain', status: 'Demo',
    tagline: 'A file, a price, a download link.',
    description: 'Explore a simple flow for selling a digital file through a payment link and a time-limited download.',
    url: 'https://pay.nyttolabs.com/', canonicalUrl: 'https://pay.nyttolabs.com/',
    action: 'Explore the demo', detail: 'Simulated checkout · real payments not active',
    keywords: 'invisible curl to buy payment stripe digital download selling file',
  },
  {
    slug: 'failclosed', name: 'FailClosed', icon: 'GitCompare', color: 'rose',
    category: 'business', group: 'subdomain', status: 'Private beta',
    tagline: 'Compare first. Repair with guardrails.',
    description: 'Find inventory disagreements between systems. Start in watch-only mode, with rules that stop unsafe repairs.',
    url: 'https://failclosed.nyttolabs.com/', canonicalUrl: 'https://failclosed.nyttolabs.com/',
    action: 'Explore FailClosed', detail: 'Watch-only by default · private beta',
    keywords: 'drift reconciliation shopify wms warehouse stock sync repair',
  },
  {
    slug: 'webhook-witness', name: 'Webhook Witness', icon: 'Webhook', color: 'cyan',
    category: 'developer', group: 'subdomain', status: 'Preview',
    tagline: 'Give every callback a receipt.',
    description: 'Timestamp and hash incoming webhooks, optionally forward them, and share a receipt of what was received.',
    url: 'https://webhookwitness.nyttolabs.com/', canonicalUrl: 'https://webhookwitness.nyttolabs.com/',
    action: 'Open Webhook Witness', detail: 'Free MVP · paid tier not active',
    keywords: 'webhook callback receipt sha256 timestamp api post evidence',
  },
  {
    slug: 'rfq-stamp', name: 'RFQ Stamp', icon: 'Stamp', color: 'orange',
    category: 'business', group: 'subdomain', status: 'Preview',
    tagline: 'A clearer trail from request to quote.',
    description: 'Create a shareable request for quotation and keep a timestamped trail of supplier responses.',
    url: 'https://rfq.nyttolabs.com/', canonicalUrl: 'https://rfq.nyttolabs.com/',
    action: 'Explore RFQ Stamp', detail: 'Free stamps · paid audit pack not active',
    keywords: 'rfq quote request supplier procurement sourcing quotation',
  },
  {
    slug: 'ragefile', name: 'Ragefile', icon: 'Files', color: 'pink',
    category: 'everyday', group: 'subdomain', status: 'Preview',
    tagline: 'Turn the support mess into a timeline.',
    description: 'Organize tickets, notes and messages into a case timeline and PDF evidence pack you can share.',
    url: 'https://ragefile.nyttolabs.com/', canonicalUrl: 'https://ragefile.nyttolabs.com/',
    action: 'Explore Ragefile', detail: 'Preview · paid exports not active',
    keywords: 'support dispute case file evidence pdf timeline complaint',
  },
  {
    slug: 'ai-venture-worker', name: 'AI Venture Worker', icon: 'ScanSearch', color: 'green',
    category: 'business', group: 'subdomain', status: 'Private pilot',
    tagline: 'See where the warehouse and store disagree.',
    description: 'A read-only inventory audit for Shopify and WMS stores. Explore the example report or request a seven-day pilot.',
    url: 'https://worker.nyttolabs.com/', canonicalUrl: 'https://worker.nyttolabs.com/',
    action: 'See the inventory audit', detail: 'Private pilot · read-only access',
    keywords: 'ai venture worker shopify wms warehouse inventory audit report pilot',
  },
]

export const PORTAL_CATEGORIES = [
  { id: 'all', label: 'All products' },
  { id: 'everyday', label: 'Everyday tools' },
  { id: 'business', label: 'Business & operations' },
  { id: 'developer', label: 'Developer tools' },
]

export function filterPortalProducts({ query = '', category = 'all', savedOnly = false, saved = [] } = {}) {
  const terms = String(query).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  return PORTAL_PRODUCTS.filter((product) => {
    if (category !== 'all' && product.category !== category) return false
    if (savedOnly && !saved.includes(product.slug)) return false
    const haystack = `${product.name} ${product.tagline} ${product.description} ${product.keywords} ${product.status}`.toLowerCase()
    const words = haystack.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
    return terms.every((term) => words.some((word) => word.startsWith(term)))
  })
}

export function parseSavedProducts(raw) {
  try {
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    const allowed = new Set(PORTAL_PRODUCTS.map((p) => p.slug))
    return [...new Set(value.filter((slug) => typeof slug === 'string' && allowed.has(slug)))]
  } catch {
    return []
  }
}
