import { COLLECTIONS, getDb, getDemoMode, isMongoConfigured } from './db'
import { ensureSeed } from './seed'
import {
  applyCanonicalUrls,
  defaultPublicProducts,
  DEFAULT_PUBLIC_SETTINGS,
  publicSettingsShape,
  CANONICAL_PRODUCT_URLS,
} from './catalog'

function envProductUrl(slug) {
  const map = {
    cycletag: process.env.PRODUCT_URL_CYCLETAG,
    viesproof: process.env.PRODUCT_URL_VIESPROOF,
    gatezero: process.env.PRODUCT_URL_GATEZERO,
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
  if (!isMongoConfigured()) return withEnvUrls(defaultPublicProducts())
  try {
    const db = await getDb()
    await ensureSeed(db)
    const apps = await db.collection(COLLECTIONS.applications)
      .find({ publicVisible: true })
      .sort({ section: 1 })
      .toArray()
    const products = applyCanonicalUrls(apps)
    return withEnvUrls(products.length ? products : defaultPublicProducts())
  } catch (error) {
    console.error('loadPublicProducts fallback', error)
    return withEnvUrls(defaultPublicProducts())
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
