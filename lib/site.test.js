import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SITE_ORIGIN, OPERATOR_LINE, PUBLIC_ROUTES, siteUrl, pageMetadata } from './site.js'

describe('public site origin', () => {
  it('canonicalizes on https://www.nyttolabs.com', () => {
    assert.equal(SITE_ORIGIN, 'https://www.nyttolabs.com')
    assert.equal(siteUrl('/'), SITE_ORIGIN)
    assert.equal(siteUrl('/contact'), 'https://www.nyttolabs.com/contact')
    assert.equal(siteUrl('/privacy'), 'https://www.nyttolabs.com/privacy')
    assert.equal(OPERATOR_LINE, 'Operated by Nytto Labs, Sweden.')
  })

  it('includes legal and contact routes for sitemap', () => {
    const paths = PUBLIC_ROUTES.map((r) => r.path)
    for (const required of ['/', '/products', '/partners', '/contact', '/privacy', '/terms']) {
      assert.equal(paths.includes(required), true, `missing ${required}`)
    }
  })

  it('emits www canonical metadata', () => {
    const meta = pageMetadata({
      title: 'Contact — Nytto Labs',
      description: 'Contact Nytto Labs',
      path: '/contact',
    })
    assert.equal(meta.alternates.canonical, 'https://www.nyttolabs.com/contact')
    assert.equal(meta.openGraph.url, 'https://www.nyttolabs.com/contact')
  })
})
