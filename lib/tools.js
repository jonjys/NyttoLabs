// The tools on the public site, in display order. One source for the home
// page, the price list on /products, the footer and the AI tool finder.
// Prices are copied from each tool's own site (checked 2026-10-20) and shown
// in the currency that tool charges. A tool with a catalog `slug` must be
// live in lib/relay/catalog.js; lib/site.test.js checks both directions.
//
// `keywords` feed the finder's plain keyword match, which answers when
// Claude is not configured, over its daily budget, or unreachable.

export const TOOLS = [
  {
    slug: 'deploydoctor',
    name: 'DeployDoctor',
    keywords: ['vercel', 'deploy', 'build', 'bygg', 'next.js', 'nextjs', 'github', 'repo', 'ci/cd', 'pipeline', 'build log', 'bygglogg'],
    url: 'https://deploydoctor.nyttolabs.com/',
    currency: 'USD',
    en: {
      category: 'Vercel deploy checks',
      job: 'Scans a GitHub repo for what will break your Vercel deploy, and reads failed build logs.',
      free: '1 scan and 1 build-log diagnosis a day',
      price: 'Passes from $2 · $9/month',
      cta: 'Scan a repo',
    },
    sv: {
      category: 'Deploykontroll för Vercel',
      job: 'Skannar ett GitHub-repo efter det som knäcker din Vercel-deploy, och läser byggloggar som fallerat.',
      free: '1 skanning och 1 byggloggsdiagnos per dag',
      price: 'Pass från $2 · $9/mån',
      cta: 'Skanna ett repo',
    },
  },
  {
    slug: 'viesproof',
    name: 'Vatidence',
    keywords: ['vat', 'moms', 'vies', 'reverse charge', 'omvänd skattskyldighet', 'eu customer', 'eu-kund', 'tax number', 'org number', 'faktur', 'invoice'],
    url: 'https://vatidence.nyttolabs.com/',
    currency: 'EUR',
    en: {
      category: 'EU VAT checks',
      job: 'Checks EU VAT numbers against VIES and hands you every consultation number in a sealed PDF and CSV.',
      free: 'One number free, instantly',
      price: 'From €4.90 a batch · 100 numbers €24',
      cta: 'Check a VAT number',
    },
    sv: {
      category: 'EU-momskontroll',
      job: 'Kontrollerar EU-momsnummer mot VIES och ger dig varje konsultationsnummer i en förseglad PDF och CSV.',
      free: 'Ett nummer gratis, direkt',
      price: 'Från 4,90 € per batch · 100 nummer 24 €',
      cta: 'Kontrollera ett nummer',
    },
  },
  {
    slug: 'cycletag',
    name: 'StayTag',
    keywords: ['mov', 'flytt', 'box', 'låd', 'label', 'etikett', 'qr', 'pack', 'storage', 'förråd', 'attic', 'vind', 'källare'],
    url: 'https://staytag.nyttolabs.com/',
    currency: 'SEK',
    en: {
      category: 'QR moving box labels',
      job: 'Print QR labels for your moving boxes, list what is inside, and find any item by searching your phone.',
      free: '3 boxes free, no app or account',
      price: 'Move Pass SEK 79, once',
      cta: 'Label a box',
    },
    sv: {
      category: 'QR-etiketter för flyttlådor',
      job: 'Skriv ut QR-etiketter till flyttlådorna, lista innehållet och hitta vad som helst genom att söka i mobilen.',
      free: '3 lådor gratis, ingen app eller konto',
      price: 'Flyttpass 79 kr, en gång',
      cta: 'Märk en låda',
    },
  },
  {
    slug: 'curl-to-buy',
    name: 'Nytto Checkout',
    keywords: ['sell', 'sälj', 'payment link', 'betallänk', 'checkout', 'kassa', 'pdf', 'ebook', 'e-bok', 'preset', 'download', 'digital', 'stripe', 'paid', 'betalt'],
    url: 'https://pay.nyttolabs.com/',
    currency: 'USD',
    en: {
      category: 'One-link checkout',
      job: 'Upload a file or add an item, set a price and share one link. Buyers pay by card with no account.',
      free: 'Free links, 5% per sale',
      price: '0% fee on a monthly plan',
      cta: 'Create a link',
    },
    sv: {
      category: 'Kassa i en länk',
      job: 'Ladda upp en fil eller lägg till en vara, sätt ett pris och dela en länk. Köparen betalar med kort, utan konto.',
      free: 'Gratis länkar, 5% per försäljning',
      price: '0% avgift med månadsplan',
      cta: 'Skapa en länk',
    },
  },
  {
    slug: 'csv-rescue',
    name: 'CSV Rescue',
    keywords: ['csv', 'excel', 'spreadsheet', 'kalkylark', 'encoding', 'teckenkod', 'åäö', 'separator', 'semicolon', 'semikolon', 'leading zero', 'nollor', 'import', 'export', 'duplicate', 'dubblett'],
    url: 'https://importfix.nyttolabs.com/csv',
    currency: 'SEK',
    en: {
      category: 'CSV cleanup',
      job: 'Fixes CSV encoding and separators without losing leading zeros, and drops exact duplicates if you ask.',
      free: 'No subscription, original left untouched',
      price: 'SEK 29 a file',
      cta: 'Rescue a file',
    },
    sv: {
      category: 'CSV-städning',
      job: 'Fixar teckenkodning och avgränsare i CSV utan att tappa inledande nollor, och tar bort exakta dubbletter om du vill.',
      free: 'Ingen prenumeration, originalet lämnas orört',
      price: '29 kr per fil',
      cta: 'Rädda en fil',
    },
  },
  {
    slug: 'failclosed',
    name: 'Failclosed',
    keywords: ['inventory', 'lager', 'stock', 'sync', 'synk', 'shopify', 'woocommerce', 'erp', 'mismatch', 'reconcil', 'two systems', 'två system', 'oversell', 'översål'],
    url: 'https://failclosed.nyttolabs.com/',
    currency: 'EUR',
    en: {
      category: 'Inventory sync',
      job: 'Watches two systems that must agree, repairs the difference, and refuses to write when the evidence is weak.',
      free: 'Free to set up, starts watch-only',
      price: 'Prepaid credit from €25',
      cta: 'Get an API key',
    },
    sv: {
      category: 'Lagersynk',
      job: 'Bevakar två system som måste stämma, reparerar skillnaden och vägrar skriva när underlaget är för svagt.',
      free: 'Gratis att sätta upp, startar i bevakningsläge',
      price: 'Förbetald kredit från 25 €',
      cta: 'Hämta en API-nyckel',
    },
  },
  {
    slug: null,
    name: 'AIklart',
    keywords: ['ai policy', 'ai-policy', 'chatgpt', 'copilot', 'gemini', 'policy', 'fraud', 'bedräg', 'phishing', 'nätfiske', 'staff', 'anställd', 'routine', 'rutin', 'small business', 'småföretag'],
    url: 'https://aiklart.se/',
    currency: 'SEK',
    en: {
      category: 'AI start for small businesses',
      job: 'An AI policy, a fraud routine and everyday workflows generated from your answers, plus a checklist for the account. In Swedish.',
      free: 'Free walkthrough, no meetings needed',
      price: 'Fixed price from SEK 4,900 excl. VAT',
      cta: 'Visit AIklart',
    },
    sv: {
      category: 'AI-start för småföretag',
      job: 'AI-policy, bedrägerirutin och vardagsflöden som genereras från era svar, plus en checklista för kontot.',
      free: 'Gratis genomgång, inga möten',
      price: 'Fast pris från 4 900 kr exkl. moms',
      cta: 'Besök AIklart',
    },
  },
  {
    slug: null,
    name: 'Expanse',
    keywords: ['list my', 'listing', 'lista', 'launch', 'lansera', 'product hunt', 'directory', 'katalog', 'get found', 'synas', 'visibility', 'marketing', 'marknadsför', 'compare tools', 'jämför verktyg', 'find a tool', 'hitta verktyg'],
    url: 'https://expanse.nyttolabs.com/',
    currency: 'EUR',
    en: {
      category: 'Product map',
      job: 'A living map of real products. Search by the problem you have, compare tools, and add your own.',
      free: 'Free profile listing',
      price: 'Map spots from €1 for 12 months',
      cta: 'Explore the map',
    },
    sv: {
      category: 'Produktkarta',
      job: 'En levande karta över riktiga produkter. Sök på problemet du har, jämför verktyg och lägg till ditt eget.',
      free: 'Gratis profil',
      price: 'Kartplatser från 1 € i 12 månader',
      cta: 'Utforska kartan',
    },
  },
]

export const toolHost = (tool) => tool.url.replace(/^https:\/\//, '').replace(/\/$/, '')
export const toolByName = (name) => TOOLS.find((tool) => tool.name === name) || null
export const toolCopy = (tool, locale) => tool[locale === 'sv' ? 'sv' : 'en']
