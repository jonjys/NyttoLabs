import { createHash } from 'node:crypto'

// In-memory, per-instance fixed-window limiter keyed by bucket + client.
// The client address is hashed before it is used as a key, so nothing
// personal is kept, and buckets are per visitor: one client hammering
// /auth/login no longer locks everyone else (including the admin) out.

const MAX_KEYS = 10_000

export function clientKey(headers) {
  const get = (name) => (typeof headers?.get === 'function' ? headers.get(name) : headers?.[name]) || ''
  // Vercel sets x-real-ip; x-forwarded-for's first entry is the client.
  const ip = String(get('x-real-ip') || get('x-forwarded-for').split(',')[0] || '').trim() || 'unknown'
  return createHash('sha256').update(`nytto-rl:${ip}`).digest('base64url').slice(0, 22)
}

export function createRateLimiter({ now = () => Date.now() } = {}) {
  const store = new Map()
  function prune(t) {
    for (const [k, rec] of store) if (t > rec.reset) store.delete(k)
  }
  return function rateLimit(bucket, client, limit = 60, windowMs = 60_000) {
    const t = now()
    if (store.size > MAX_KEYS) prune(t)
    const key = `${bucket}:${client}`
    const rec = store.get(key)
    if (!rec || t > rec.reset) {
      store.set(key, { count: 1, reset: t + windowMs })
      return true
    }
    rec.count += 1
    return rec.count <= limit
  }
}
