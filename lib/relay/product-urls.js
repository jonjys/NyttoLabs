import { CANONICAL_PRODUCT_URLS } from './catalog.js'

// Env overrides for public product URLs, keyed by internal catalog slug.
// StayTag keeps the internal slug `cycletag` but reads PRODUCT_URL_STAYTAG.
// The old PRODUCT_URL_CYCLETAG is deliberately not read: a leftover value in a
// deployment must not be able to send visitors back to cycletag.eu.
const PRODUCT_URL_ENV = {
  cycletag: 'PRODUCT_URL_STAYTAG',
  gatezero: 'PRODUCT_URL_GATEZERO',
  failclosed: 'PRODUCT_URL_FAILCLOSED',
}

// Hosts a product has moved away from. An override pointing at one is ignored.
const RETIRED_HOSTS = {
  cycletag: ['cycletag.eu', 'www.cycletag.eu'],
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

export function envProductUrl(slug, env = process.env) {
  // Vatidence uses one fixed public address even if a legacy deployment env var remains.
  if (slug === 'viesproof') return CANONICAL_PRODUCT_URLS.viesproof

  const key = PRODUCT_URL_ENV[slug]
  const raw = key ? env[key] : undefined
  const url = typeof raw === 'string' ? raw.trim() : ''
  const retired = RETIRED_HOSTS[slug] || []
  if (url.startsWith('https://') && hostOf(url) && !retired.includes(hostOf(url))) return url
  return CANONICAL_PRODUCT_URLS[slug] || null
}
