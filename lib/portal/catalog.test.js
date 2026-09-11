import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PORTAL_PRODUCTS, filterPortalProducts, parseSavedProducts } from './catalog.js'

test('all nine products retain their assigned canonical domains and order', () => {
  assert.deepEqual(PORTAL_PRODUCTS.map((p) => new URL(p.canonicalUrl).hostname), [
    'cycletag.eu', 'getgatezero.com', 'viesproof.eu', 'pay.nyttolabs.com',
    'failclosed.nyttolabs.com', 'webhookwitness.nyttolabs.com', 'rfq.nyttolabs.com',
    'ragefile.nyttolabs.com', 'worker.nyttolabs.com',
  ])
  assert.equal(new Set(PORTAL_PRODUCTS.map((p) => p.slug)).size, 9)
  // Every product has since moved off its temporary *.vercel.app preview host
  // onto its assigned custom domain, so the visitor destination and the
  // canonical mapping now agree for all nine.
  for (const product of PORTAL_PRODUCTS) {
    assert.equal(new URL(product.url).protocol, 'https:')
    assert.equal(new URL(product.url).hostname, new URL(product.canonicalUrl).hostname)
  }
})

test('search finds products by real tasks, case and multiple words', () => {
  assert.deepEqual(filterPortalProducts({ query: '  VAT  ' }).map((p) => p.slug), ['viesproof'])
  assert.deepEqual(filterPortalProducts({ query: 'warehouse audit' }).map((p) => p.slug), ['ai-venture-worker'])
  assert.equal(filterPortalProducts({ query: 'no-such-tool' }).length, 0)
})

test('saved and category filters intersect and preserve portfolio order', () => {
  const result = filterPortalProducts({ category: 'business', savedOnly: true, saved: ['ragefile', 'viesproof'] })
  assert.deepEqual(result.map((p) => p.slug), ['viesproof'])
  assert.equal(filterPortalProducts({ savedOnly: true, saved: [] }).length, 0)
  assert.equal(filterPortalProducts().length, 9)
})

test('saved products tolerate corrupt, obsolete and duplicate browser data', () => {
  for (const raw of [null, '', '{broken', '{}', '"cycletag"']) assert.deepEqual(parseSavedProducts(raw), [])
  assert.deepEqual(parseSavedProducts('["cycletag","cycletag","old-app",null,3,"ragefile"]'), ['cycletag', 'ragefile'])
})
