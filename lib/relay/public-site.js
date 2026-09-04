import { COLLECTIONS, getDb, getDemoMode, isMongoConfigured } from './db'
import { ensureSeed } from './seed'
import {
  mergePublicCatalog,
  DEFAULT_PUBLIC_SETTINGS,
  publicSettingsShape,
  CANONICAL_PRODUCT_URLS,
  PUBLIC_PORTFOLIO_SLUGS,
} from './catalog'

function envProductUrl(slug) {
  const map = {
    cycletag: process.env.PRODUCT_URL_CYCLETAG,
    viesproof: process.env.PRODUCT_URL_VIESPROOF,
    gatezero: process.env.PRODUCT_URL_GATEZERO,
    failclosed: process.env.PRODUCT_URL_FAILCLOSED,
  }
  const raw = map[slug]
  const url = typeof raw === 'string' ? raw.trim() : ''
  return url.startsWith('https://') ? url : (CANONICAL_PRODUCT_URLS[slug] || null)
}

function withEnvUrls(products) {
  return products.map((p) => {
    const url = envProductUrl(p.slug) || p.url
    return url ? { ...p, url } : p
  })
}

export async function loadPublicProducts() {
  if (!isMongoConfigured()) return withEnvUrls(mergePublicCatalog([]))
  try {
    const db = await getDb()
    await ensureSeed(db)
    const apps = await db.collection(COLLECTIONS.applications)
      .find({ publicVisible: true, slug: { $in: PUBLIC_PORTFOLIO_SLUGS } })
      .sort({ section: 1 })
      .toArray()
    return withEnvUrls(mergePublicCatalog(apps))
  } catch (error) {
    console.error('loadPublicProducts fallback', error)
    return withEnvUrls(mergePublicCatalog([]))
  }
}

export async function loadPublicSettings() {
  if (!isMongoConfigured()) return { ...DEFAULT_PUBLIC_SETTINGS, demoMode: false }
  try {
    const db = await getDb()
    await ensureSeed(db)
    const s = await db.collection(COLLECTIONS.settings).findOne({ key: 'global' })
    return publicSettingsShape(s, { demoMode: await getDemoMode(db) })
  } catch (error) {
    console.error('loadPublicSettings fallback', error)
    return { ...DEFAULT_PUBLIC_SETTINGS, demoMode: false }
  }
}
