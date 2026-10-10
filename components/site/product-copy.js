// Swedish copy for catalog products, keyed by catalog slug. English comes from
// the catalog itself (lib/relay/catalog.js); this only adds the Swedish layer,
// so catalog URLs and statuses stay the single source of truth.
export const PRODUCT_COPY_SV = {
  deploydoctor: {
    category: 'Utvecklarverktyg',
    description: 'Skanna ett publikt GitHub-repo efter kodfelen som oftast knäcker en Vercel-deploy. Ingen kloning, ingen kodkörning.',
    footer: 'DeployDoctor Vercel-kontroller',
  },
  cycletag: {
    category: 'Återbeställning',
    description: 'QR-etiketter för återköp utan lagrad data. En skanning tar fram exakt rätt ersättningssökning — ingen app, inget konto.',
    footer: 'StayTag återbeställningsetiketter',
  },
  viesproof: {
    category: 'B2B-verifiering',
    description: 'Momsnummerkontroll i bulk mot EU:s VIES, med konsultationsnummer som ekonomiavdelningen kan exportera som bevis.',
    footer: 'Vatidence momskontroller',
  },
  'curl-to-buy': {
    category: 'Digital leverans',
    description: 'Sälj en digital fil utan konto på någon sida. Ladda upp, sätt ett pris och dela länken. Köparen betalar med kort och får en tidsbegränsad nedladdning.',
    footer: 'Nytto Checkout filförsäljning',
  },
  failclosed: {
    category: 'Lagersynk',
    description: 'Lagersynk som automatiskt reparerar skillnaden mellan två system — och vägrar skriva när datan ser fel ut.',
    footer: 'Failclosed lagersynk',
  },
  'csv-rescue': {
    category: 'Filverktyg',
    description: 'Rättar teckenkodning och separatorer i CSV-filer utan att tappa inledande nollor. Exakta dubbletter kan tas bort. 29 kr per fil, ingen prenumeration.',
    footer: 'CSV Rescue filstädning',
  },
}

/** Category and description in the visitor's language; falls back to the catalog's English. */
export function productCopy(product, locale) {
  const sv = locale === 'sv' ? PRODUCT_COPY_SV[product.slug] : null
  return {
    category: sv?.category || product.category,
    description: sv?.description || product.description,
  }
}
