import { COLLECTIONS, isDemoMode } from './db'
import { seedApplications } from './catalog'

export { seedApplications }

// DEMO partners & offers. Reserved .example domains — never real trademarks.
// These only participate in routing while DEMO_MODE is enabled.
export function seedDemoPartners() {
  const now = new Date()
  const base = { created_at: now, updated_at: now, isDemo: true }
  return [
    {
      ...base, id: 'ptn-aquapure', name: 'AquaPure Filters (DEMO)', slug: 'aquapure',
      website: 'https://aquapure-demo.example', contactEmail: 'partners@aquapure-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'affiliate',
      supportedCountries: ['SE', 'DE', 'FI', 'EU'], supportedCurrencies: ['SEK', 'EUR'],
      approvedDomains: ['aquapure-demo.example'], reliabilityScore: 88, active: true,
      notes: 'DEMO water-filter manufacturer used to demonstrate CycleTag reorder routing.',
    },
    {
      ...base, id: 'ptn-nordmarket', name: 'NordMarket (DEMO)', slug: 'nordmarket',
      website: 'https://nordmarket-demo.example', contactEmail: 'partners@nordmarket-demo.example',
      affiliateNetwork: 'Awin', relationshipType: 'affiliate',
      supportedCountries: ['SE', 'EU', 'DE', 'FI', 'NO', 'DK'], supportedCurrencies: ['SEK', 'EUR'],
      approvedDomains: ['nordmarket-demo.example'], reliabilityScore: 72, active: true,
      notes: 'DEMO general marketplace used as a broad CycleTag fallback partner.',
    },
    {
      ...base, id: 'ptn-petclean', name: 'PetClean Filters (DEMO)', slug: 'petclean',
      website: 'https://petclean-demo.example', contactEmail: 'partners@petclean-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'affiliate',
      supportedCountries: ['SE', 'EU'], supportedCurrencies: ['SEK', 'EUR'],
      approvedDomains: ['petclean-demo.example'], reliabilityScore: 66, active: true,
      notes: 'DEMO pet-fountain filter manufacturer.',
    },
    {
      ...base, id: 'ptn-printlabel', name: 'PrintLabel Co (DEMO)', slug: 'printlabel',
      website: 'https://printlabel-demo.example', contactEmail: 'partners@printlabel-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'referral',
      supportedCountries: ['SE', 'EU'], supportedCurrencies: ['SEK', 'EUR'],
      approvedDomains: ['printlabel-demo.example'], reliabilityScore: 70, active: true,
      notes: 'DEMO label printer & label supplier for CycleTag Inside.',
    },
    {
      ...base, id: 'ptn-ledgerbooks', name: 'LedgerBooks (DEMO)', slug: 'ledgerbooks',
      website: 'https://ledgerbooks-demo.example', contactEmail: 'partners@ledgerbooks-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'revshare',
      supportedCountries: ['SE', 'EU'], supportedCurrencies: ['SEK', 'EUR'],
      approvedDomains: ['ledgerbooks-demo.example'], reliabilityScore: 80, active: true,
      notes: 'DEMO accounting / tax-compliance provider for VIESProof.',
    },
    {
      ...base, id: 'ptn-observestack', name: 'ObserveStack (DEMO)', slug: 'observestack',
      website: 'https://observestack-demo.example', contactEmail: 'partners@observestack-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'affiliate',
      supportedCountries: ['Global'], supportedCurrencies: ['USD', 'EUR'],
      approvedDomains: ['observestack-demo.example'], reliabilityScore: 75, active: true,
      notes: 'DEMO observability provider for GateZero.',
    },
    {
      ...base, id: 'ptn-branddirect', name: 'BrandDirect (DISABLED EXAMPLE)', slug: 'branddirect',
      website: 'https://branddirect-demo.example', contactEmail: 'partners@branddirect-demo.example',
      affiliateNetwork: 'Direct', relationshipType: 'affiliate',
      supportedCountries: ['SE'], supportedCurrencies: ['SEK'],
      approvedDomains: ['branddirect-demo.example'], reliabilityScore: 60, active: false,
      notes: 'Disabled example partner. Enable only after a real agreement exists.',
    },
  ]
}

export function seedDemoOffers() {
  const now = new Date()
  const base = { created_at: now, updated_at: now, isDemo: true, sku: null, startDate: null, endDate: null }
  return [
    {
      ...base, id: 'ofr-aquapure-water', partnerSlug: 'aquapure', name: 'AquaPure water-filter replacements (DEMO)',
      destinationTemplate: 'https://aquapure-demo.example/shop?q={query}&country={country}&lang={language}',
      supportedApplications: ['cycletag'], supportedActions: ['reorder', 'replace'],
      markets: ['SE', 'DE', 'FI', 'EU'], categories: ['water-filter'], brands: ['Brita', 'AquaPure', 'Maxtra'],
      commissionType: 'percentage', commissionAmount: 8, currency: 'SEK', priority: 10, sponsored: false,
      disclosure: 'Nytto Labs may earn a commission if you buy through this partner. Your price is unchanged.',
      affiliateParams: { aff: 'nytto' }, subIdParam: 'subid', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.061, rpcMinor: 320, verified: true },
    },
    {
      ...base, id: 'ofr-nordmarket-broad', partnerSlug: 'nordmarket', name: 'NordMarket general reorder (DEMO)',
      destinationTemplate: 'https://nordmarket-demo.example/search?q={query}&market={country}',
      supportedApplications: ['cycletag'], supportedActions: ['reorder', 'replace', 'compare'],
      markets: ['SE', 'EU', 'DE', 'FI', 'NO', 'DK'], categories: [], brands: [],
      commissionType: 'percentage', commissionAmount: 4, currency: 'SEK', priority: 2, sponsored: false,
      disclosure: 'Affiliate link — Nytto Labs may earn a commission at no extra cost to you.',
      affiliateParams: { partner: 'nytto' }, subIdParam: 'sid', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.031, rpcMinor: 140, verified: true },
    },
    {
      ...base, id: 'ofr-petclean', partnerSlug: 'petclean', name: 'PetClean fountain filters (DEMO)',
      destinationTemplate: 'https://petclean-demo.example/shop?q={query}&country={country}',
      supportedApplications: ['cycletag'], supportedActions: ['reorder', 'replace'],
      markets: ['SE', 'EU'], categories: ['pet-filter'], brands: ['PetClean', 'Catit'],
      commissionType: 'percentage', commissionAmount: 7, currency: 'SEK', priority: 5, sponsored: false,
      disclosure: 'Nytto Labs may earn a commission if you buy through this partner.',
      affiliateParams: { aff: 'nytto' }, subIdParam: 'subid', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.048, rpcMinor: 210, verified: true },
    },
    {
      ...base, id: 'ofr-printlabel', partnerSlug: 'printlabel', name: 'PrintLabel starter kits (DEMO)',
      destinationTemplate: 'https://printlabel-demo.example/kits?q={query}',
      supportedApplications: ['cycletag'], supportedActions: ['print'],
      markets: ['SE', 'EU'], categories: ['printer-kit', 'labels'], brands: [],
      commissionType: 'fixed', commissionAmount: 45, currency: 'SEK', priority: 4, sponsored: true,
      disclosure: 'Sponsored placement. Nytto Labs may earn a commission if you buy through this partner.',
      affiliateParams: {}, subIdParam: 'ref', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.02, rpcMinor: 90, verified: false },
    },
    {
      ...base, id: 'ofr-ledgerbooks', partnerSlug: 'ledgerbooks', name: 'LedgerBooks accounting (DEMO)',
      destinationTemplate: 'https://ledgerbooks-demo.example/start?country={country}&lang={language}',
      supportedApplications: ['viesproof'], supportedActions: ['verify', 'compare'],
      markets: ['SE', 'EU'], categories: ['accounting', 'tax-compliance', 'erp'], brands: [],
      commissionType: 'revshare', commissionAmount: 20, currency: 'EUR', priority: 6, sponsored: false,
      disclosure: 'Nytto Labs may earn revenue share if you subscribe through this partner.',
      affiliateParams: { ref: 'nytto' }, subIdParam: 'sid', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.055, rpcMinor: 500, verified: true },
    },
    {
      ...base, id: 'ofr-observestack', partnerSlug: 'observestack', name: 'ObserveStack monitoring (DEMO)',
      destinationTemplate: 'https://observestack-demo.example/signup?src={source}',
      supportedApplications: ['gatezero'], supportedActions: ['monitor', 'compare'],
      markets: ['Global'], categories: ['observability', 'monitoring'], brands: [],
      commissionType: 'cpl', commissionAmount: 15, currency: 'USD', priority: 3, sponsored: false,
      disclosure: 'Affiliate link — Nytto Labs may earn a referral fee.',
      affiliateParams: {}, subIdParam: 'subid', active: true,
      stats: { clicks: 0, conversions: 0, conversionRate: 0.04, rpcMinor: 260, verified: false },
    },
    {
      ...base, id: 'ofr-branddirect-disabled', partnerSlug: 'branddirect', name: 'BrandDirect (DISABLED EXAMPLE)',
      destinationTemplate: 'https://branddirect-demo.example/p?q={query}',
      supportedApplications: ['cycletag'], supportedActions: ['reorder'],
      markets: ['SE'], categories: ['water-filter'], brands: [],
      commissionType: 'percentage', commissionAmount: 12, currency: 'SEK', priority: 9, sponsored: false,
      disclosure: '', affiliateParams: {}, subIdParam: '', active: false,
      stats: { clicks: 0, conversions: 0, conversionRate: 0, rpcMinor: 0, verified: false },
    },
  ]
}

export function seedSettings() {
  const now = new Date()
  return {
    id: 'settings-singleton',
    key: 'global',
    legalName: '',
    orgNumber: '',
    vatNumber: '',
    registeredAddress: '',
    supportEmail: 'hello@nyttolabs.com',
    partnerEmail: 'partners@nyttolabs.com',
    defaultCurrency: 'SEK',
    defaultFallbackTemplate: 'https://www.google.com/search?tbm=shop&q={query}',
    affiliateDisclosure:
      'Some links on Nytto Labs products are partner links. Nytto Labs may earn compensation when you choose a partner, at no additional cost to you unless clearly stated.',
    demoMode: isDemoMode(),
    created_at: now,
    updated_at: now,
  }
}

export function seedExperiments() {
  const now = new Date()
  return [
    {
      id: 'exp-cycletag-water',
      name: 'CycleTag water-filter partner test',
      app: 'cycletag',
      action: 'reorder',
      category: 'water-filter',
      controlOfferId: 'ofr-aquapure-water',
      variantOfferId: 'ofr-nordmarket-broad',
      trafficPct: 0,
      active: false,
      isDemo: true,
      created_at: now,
      updated_at: now,
    },
  ]
}

// Idempotent seeding. Known portfolio apps are repaired on every boot so stale
// Mongo URLs (cycletag.eu vs www, old Vercel hosts, etc.) cannot linger.
export async function ensureSeed(db) {
  const apps = seedApplications()
  for (const a of apps) {
    const { id, created_at, ...publicFields } = a
    await db.collection(COLLECTIONS.applications).updateOne(
      { slug: a.slug },
      {
        $setOnInsert: { id, created_at },
        $set: publicFields,
      },
      { upsert: true }
    )
  }

  const existingSettings = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })
  if (!existingSettings) await db.collection(COLLECTIONS.settings).insertOne(seedSettings())

  if (isDemoMode()) {
    for (const p of seedDemoPartners()) {
      await db.collection(COLLECTIONS.partners).updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true })
    }
    for (const o of seedDemoOffers()) {
      await db.collection(COLLECTIONS.offers).updateOne({ id: o.id }, { $setOnInsert: o }, { upsert: true })
    }
    for (const e of seedExperiments()) {
      await db.collection(COLLECTIONS.experiments).updateOne({ id: e.id }, { $setOnInsert: e }, { upsert: true })
    }
  }
}

// Remove all demo data (keeps real applications & settings).
export async function purgeDemo(db) {
  await db.collection(COLLECTIONS.partners).deleteMany({ isDemo: true })
  await db.collection(COLLECTIONS.offers).deleteMany({ isDemo: true })
  await db.collection(COLLECTIONS.experiments).deleteMany({ isDemo: true })
}
