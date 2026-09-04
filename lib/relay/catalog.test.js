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
  it('exposes CycleTag, VIESProof, GateZero and Failclosed with canonical URLs', () => {
    const products = defaultPublicProducts()
    const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]))

    assert.equal(CANONICAL_PRODUCT_URLS.cycletag, 'https://cycletag.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.viesproof, 'https://viesproof.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.gatezero, 'https://getgatezero.com/')
    assert.equal(CANONICAL_PRODUCT_URLS.failclosed, 'https://failclosed.nyttolabs.com/')

    assert.equal(bySlug.cycletag.url, 'https://cycletag.eu/')
    assert.equal(bySlug.viesproof.url, 'https://viesproof.eu/')
    assert.equal(bySlug.gatezero.url, 'https://getgatezero.com/')
    assert.equal(bySlug.failclosed.url, 'https://failclosed.nyttolabs.com/')
    assert.equal(bySlug.cycletag.status, 'building')
    assert.equal(bySlug.cycletag.section, 'building')
    assert.equal(bySlug.viesproof.status, 'live')
    assert.equal(bySlug.viesproof.section, 'live')
    assert.equal(bySlug.gatezero.status, 'public-beta')
    assert.equal(bySlug.gatezero.section, 'public-beta')
    assert.equal(bySlug.failclosed.status, 'private-beta')
    assert.equal(bySlug.failclosed.section, 'private-beta')
    assert.equal(bySlug.failclosed.name, 'Failclosed')
    assert.match(bySlug.gatezero.description, /toll booth/i)
    assert.match(bySlug.gatezero.description, /fail-closed/i)
    assert.match(bySlug.failclosed.description, /reconciliation/i)
    assert.match(bySlug.failclosed.description, /watch-only/i)
    assert.equal(products.length, 4)
    assert.equal(seedApplications().some((a) => a.name === 'Drift'), false)
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
    const [cycle, vies, gate, fail] = applyCanonicalUrls([
      { name: 'CycleTag', slug: 'cycletag', url: 'https://www.cycletag.eu/', status: 'live', actions: [] },
      { name: 'VIESProof', slug: 'viesproof', url: 'https://www.viesproof.eu/', status: 'live', actions: [] },
      { name: 'GateZero', slug: 'gatezero', url: 'https://www.getgatezero.com/', status: 'live', actions: [] },
      { name: 'Failclosed', slug: 'failclosed', url: 'https://drift.example/', status: 'live', actions: [] },
    ])
    assert.equal(cycle.url, 'https://cycletag.eu/')
    assert.equal(vies.url, 'https://viesproof.eu/')
    assert.equal(gate.url, 'https://getgatezero.com/')
    assert.equal(fail.url, 'https://failclosed.nyttolabs.com/')
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

  it('does not publish organisation numbers, VAT IDs, or addresses on the public site', () => {
    const s = publicSettingsShape({
      legalName: 'should-not-leak',
      orgNumber: '198001011234',
      vatNumber: 'SE19800101123401',
      registeredAddress: 'Secret street 1',
    })
    const blob = JSON.stringify({ settings: s, defaults: DEFAULT_PUBLIC_SETTINGS })
    assert.equal(blob.includes('should-not-leak'), false)
    assert.equal(blob.includes('198001011234'), false)
    assert.equal(blob.includes('SE19800101123401'), false)
    assert.equal(blob.includes('Secret street'), false)
    assert.equal(Object.hasOwn(s, 'orgNumber'), false)
    assert.equal(Object.hasOwn(s, 'vatNumber'), false)
    assert.equal(Object.hasOwn(s, 'registeredAddress'), false)
    assert.equal(Object.hasOwn(s, 'legalName'), false)
  })

  it('keeps the public grid populated when Mongo is empty or fails', () => {
    for (const input of [null, undefined, [], [{ slug: 'nytto-relay', publicVisible: true }]]) {
      const products = mergePublicCatalog(input)
      assert.equal(products.length, 4)
      assert.deepEqual(products.map((p) => p.slug).sort(), ['cycletag', 'failclosed', 'gatezero', 'viesproof'])
    }
  })

  it('never publishes private or internal apps on the public grid', () => {
    const products = mergePublicCatalog([
      { name: 'Nytto Relay', slug: 'nytto-relay', publicVisible: true, isInfrastructure: true, status: 'live', url: 'https://internal.example/' },
      { name: 'AI Venture Worker', slug: 'ai-venture-worker', publicVisible: true, status: 'live', url: 'https://internal.example/' },
      { name: 'Drift', slug: 'drift', publicVisible: true, status: 'live', url: 'https://drift.example/' },
      { name: 'CycleTag', slug: 'cycletag', publicVisible: true, status: 'live', url: 'https://wrong.example/' },
    ])
    const slugs = products.map((p) => p.slug)
    assert.equal(slugs.includes('nytto-relay'), false)
    assert.equal(slugs.includes('ai-venture-worker'), false)
    assert.equal(slugs.includes('drift'), false)
    assert.equal(products.find((p) => p.slug === 'cycletag').url, 'https://cycletag.eu/')
    assert.equal(products.find((p) => p.slug === 'cycletag').status, 'building')
    assert.equal(products.find((p) => p.slug === 'failclosed').name, 'Failclosed')
    assert.equal(products.find((p) => p.slug === 'failclosed').status, 'private-beta')
  })

  it('does not let Mongo mark CycleTag, GateZero or Failclosed live', () => {
    const products = mergePublicCatalog([
      { name: 'CycleTag', slug: 'cycletag', publicVisible: true, status: 'live', url: 'https://www.cycletag.eu/' },
      { name: 'VIESProof', slug: 'viesproof', publicVisible: true, status: 'building', url: 'https://viesproof.eu/' },
      { name: 'GateZero', slug: 'gatezero', publicVisible: true, status: 'live', url: 'https://www.getgatezero.com/' },
      { name: 'Failclosed', slug: 'failclosed', publicVisible: true, status: 'public-beta', url: 'https://drift.example/' },
    ])
    assert.equal(products.find((p) => p.slug === 'cycletag').status, 'building')
    assert.equal(products.find((p) => p.slug === 'cycletag').url, 'https://cycletag.eu/')
    assert.equal(products.find((p) => p.slug === 'viesproof').status, 'live')
    assert.equal(products.find((p) => p.slug === 'viesproof').url, 'https://viesproof.eu/')
    assert.equal(products.find((p) => p.slug === 'gatezero').status, 'public-beta')
    assert.equal(products.find((p) => p.slug === 'gatezero').section, 'public-beta')
    assert.equal(products.find((p) => p.slug === 'gatezero').url, 'https://getgatezero.com/')
    assert.equal(products.find((p) => p.slug === 'failclosed').status, 'private-beta')
    assert.equal(products.find((p) => p.slug === 'failclosed').section, 'private-beta')
    assert.equal(products.find((p) => p.slug === 'failclosed').url, 'https://failclosed.nyttolabs.com/')
    assert.equal(products.find((p) => p.slug === 'failclosed').name, 'Failclosed')
  })
})
