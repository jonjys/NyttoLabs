import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultPublicProducts,
  CANONICAL_PRODUCT_URLS,
  seedApplications,
  applyCanonicalUrls,
  publicSettingsShape,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PARTNER_EMAIL,
} from './catalog.js'

describe('canonical product catalog', () => {
  it('exposes CycleTag, VIESProof and GateZero with the live URLs', () => {
    const products = defaultPublicProducts()
    const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]))

    assert.equal(CANONICAL_PRODUCT_URLS.cycletag, 'https://www.cycletag.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.viesproof, 'https://www.viesproof.eu/')
    assert.equal(CANONICAL_PRODUCT_URLS.gatezero, 'https://www.getgatezero.com/')

    assert.equal(bySlug.cycletag.url, 'https://www.cycletag.eu/')
    assert.equal(bySlug.viesproof.url, 'https://www.viesproof.eu/')
    assert.equal(bySlug.gatezero.url, 'https://www.getgatezero.com/')
    assert.equal(bySlug.cycletag.status, 'live')
    assert.equal(bySlug.viesproof.status, 'live')
    assert.equal(bySlug.gatezero.status, 'building')
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
    const [fixed] = applyCanonicalUrls([
      { name: 'CycleTag', slug: 'cycletag', url: 'https://wrong.example/cycletag', status: 'live', actions: [] },
    ])
    assert.equal(fixed.url, 'https://www.cycletag.eu/')
  })

  it('does not expose personal inboxes on the public site', () => {
    const s = publicSettingsShape({
      supportEmail: 'personal@gmail.com',
      partnerEmail: 'someone@hotmail.com',
    })
    assert.equal(s.supportEmail, PUBLIC_SUPPORT_EMAIL)
    assert.equal(s.partnerEmail, PUBLIC_PARTNER_EMAIL)
  })
})
