import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { passcodeMatches } from './passcode.js'
import { clientKey, createRateLimiter } from './rate-limit.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

describe('frame headers', () => {
  it('forbid framing on every route, /control included', async () => {
    const config = createRequire(import.meta.url)(join(root, 'next.config.js'))
    const rules = await config.headers()
    const all = rules.find((r) => r.source === '/(.*)')
    const get = (key) => all.headers.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value
    assert.equal(get('X-Frame-Options'), 'DENY')
    assert.equal(get('Content-Security-Policy'), "frame-ancestors 'none'")
    const values = JSON.stringify(rules)
    assert.equal(values.includes('ALLOWALL'), false)
    assert.equal(/frame-ancestors \*/.test(values), false)
  })
})

describe('passcode comparison', () => {
  it('matches only the exact passcode, and never an empty expected value', () => {
    assert.equal(passcodeMatches('s3cret-pass', 's3cret-pass'), true)
    assert.equal(passcodeMatches('s3cret-pasS', 's3cret-pass'), false)
    assert.equal(passcodeMatches('s3cret', 's3cret-pass'), false)
    assert.equal(passcodeMatches('', ''), false)
    assert.equal(passcodeMatches(undefined, ''), false)
    assert.equal(passcodeMatches(null, 'x'), false)
  })

  it('is constant-time: auth uses passcodeMatches, not ===', () => {
    const auth = readFileSync(join(root, 'lib/relay/auth.js'), 'utf8')
    assert.match(auth, /passcodeMatches\(passcode, process\.env\.ADMIN_PASSCODE/)
    assert.equal(/String\(passcode\) === expected/.test(auth), false)
    const src = readFileSync(join(root, 'lib/security/passcode.js'), 'utf8')
    assert.match(src, /timingSafeEqual/)
  })
})

describe('rate limiting', () => {
  it('is per client: one client hitting the limit does not block another', () => {
    let t = 0
    const limit = createRateLimiter({ now: () => t })
    const attacker = clientKey({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' })
    const admin = clientKey({ 'x-forwarded-for': '198.51.100.7' })
    for (let i = 0; i < 10; i++) assert.equal(limit('login', attacker, 10), true)
    assert.equal(limit('login', attacker, 10), false)
    assert.equal(limit('login', admin, 10), true)
    // Buckets are independent, and the window resets.
    assert.equal(limit('contact', attacker, 10), true)
    t = 60_001
    assert.equal(limit('login', attacker, 10), true)
  })

  it('keys clients by a hash, never the raw address', () => {
    const key = clientKey({ 'x-real-ip': '203.0.113.9' })
    assert.equal(key.includes('203.0.113.9'), false)
    assert.equal(key, clientKey(new Headers({ 'x-real-ip': '203.0.113.9' })))
    assert.notEqual(key, clientKey({ 'x-real-ip': '203.0.113.10' }))
    assert.equal(typeof clientKey({}), 'string')
  })

  it('every rate-limited API route passes the request, so limits are per client', () => {
    const route = readFileSync(join(root, 'app/api/[[...path]]/route.js'), 'utf8')
    const calls = route.match(/rateLimit\([^)]*\)/g) || []
    assert.ok(calls.length >= 4)
    for (const call of calls.filter((c) => !c.includes('bucket'))) assert.match(call, /^rateLimit\(request, '/)
    assert.equal(/rlStore/.test(route), false)
  })
})
