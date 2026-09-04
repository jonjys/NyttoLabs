import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultPublicProducts,
  CANONICAL_PRODUCT_URLS,
  seedApplications,
  applyCanonicalUrls,
  mergePublicCatalog,
  publicSettingsShape,
  publicEmail,
  PUBLIC_HELLO_EMAIL,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PRIVACY_EMAIL,
  PUBLIC_BILLING_EMAIL,
  PUBLIC_PARTNER_EMAIL,
  DEFAULT_PUBLIC_SETTINGS,
} from './catalog.js'

describe('canonical product catalog', () => {
  it('exposes CycleTag, VIESProof and GateZero with the live URLs', () => {
    const products = defaultPublicProducts()
    const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]))

    assert.equal(CANONICAL_PRODUCT_URLS.cycletag, 'https://www.cycletag.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.viesproof, 'https://viesproof.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.gatezero, 'https://www.getgatezero.com/')

    assert.equal(bySlug.cycletag.url, 'https://www.cycletag.eu/')
    assert.equal(bySlug.viesproof.url, 'https://viesproof.eu/')
    assert.equal(bySlug.gatezero.url, 'https://www.getgatezero.com/')
    assert.equal(bySlug.cycletag.status, 'live')
    assert.equal(bySlug.viesproof.status, 'live')
    assert.equal(bySlug.gatezero.status, 'building')
    assert.equal(products.length, 3)
  })

  it('keeps Netfold, Skrivklart and Invoic out of the public catalog', () => {
    const blob = JSON.stringify({
      public: defaultPublicProducts(),
      all: seedApplications(),
    }).toLowerCase()
    for (const forbidden of ['netfold', 'skrivklart', 'invoic']) {
      assert.equal(blob.includes(forbidden), false, `catalog leaked ${forbidden}`)
    }
  })

  it('overrides stale Mongo URLs with canonical hosts', () => {
    const [cycle, vies] = applyCanonicalUrls([
      { name: 'CycleTag', slug: 'cycletag', url: 'https://wrong.example/cycletag', status: 'live', actions: [] },
      { name: 'VIESProof', slug: 'viesproof', url: 'https://www.viesproof.eu/', status: 'live', actions: [] },
    ])
    assert.equal(cycle.url, 'https://www.cycletag.eu/')
    assert.equal(vies.url, 'https://viesproof.eu/')
  })

  it('does not expose personal inboxes or partners@ on the public site', () => {
    const s = publicSettingsShape({
      supportEmail: 'personal@gmail.com',
      partnerEmail: 'partners@nyttolabs.com',
    })
    assert.equal(s.helloEmail, PUBLIC_HELLO_EMAIL)
    assert.equal(s.supportEmail, PUBLIC_SUPPORT_EMAIL)
    assert.equal(s.partnerEmail, PUBLIC_HELLO_EMAIL)
    assert.equal(s.privacyEmail, PUBLIC_PRIVACY_EMAIL)
    assert.equal(s.billingEmail, PUBLIC_BILLING_EMAIL)
    assert.equal(PUBLIC_PARTNER_EMAIL, PUBLIC_HELLO_EMAIL)
    assert.equal(publicEmail('partners@nyttolabs.com', PUBLIC_HELLO_EMAIL), PUBLIC_HELLO_EMAIL)
    assert.equal(DEFAULT_PUBLIC_SETTINGS.partnerEmail, PUBLIC_HELLO_EMAIL)
    const blob = JSON.stringify({ settings: s, defaults: DEFAULT_PUBLIC_SETTINGS })
    assert.equal(blob.includes('partners@nyttolabs.com'), false)
  })

  it('keeps the public grid populated when Mongo is empty or fails', () => {
    for (const input of [null, undefined, [], [{ slug: 'nytto-relay', publicVisible: true }]]) {
      const products = mergePublicCatalog(input)
      assert.equal(products.length, 3)
      assert.deepEqual(products.map((p) => p.slug).sort(), ['cycletag', 'gatezero', 'viesproof'])
    }
  })

  it('never publishes private or internal apps on the public grid', () => {
    const products = mergePublicCatalog([
      { name: 'Nytto Relay', slug: 'nytto-relay', publicVisible: true, isInfrastructure: true, status: 'live', url: 'https://internal.example/' },
      { name: 'AI Venture Worker', slug: 'ai-venture-worker', publicVisible: true, status: 'live', url: 'https://internal.example/' },
      { name: 'Failclosed', slug: 'failclosed', publicVisible: true, status: 'live', url: 'https://failclosed.example/' },
      { name: 'CycleTag', slug: 'cycletag', publicVisible: true, status: 'live', url: 'https://wrong.example/' },
    ])
    const slugs = products.map((p) => p.slug)
    assert.equal(slugs.includes('nytto-relay'), false)
    assert.equal(slugs.includes('ai-venture-worker'), false)
    assert.equal(slugs.includes('failclosed'), false)
    assert.equal(products.find((p) => p.slug === 'cycletag').url, 'https://www.cycletag.eu/')
  })

  it('does not let Mongo mark GateZero live', () => {
    const products = mergePublicCatalog([
      { name: 'GateZero', slug: 'gatezero', publicVisible: true, status: 'live', url: 'https://www.getgatezero.com/' },
    ])
    assert.equal(products.find((p) => p.slug === 'gatezero').status, 'building')
  })
})
