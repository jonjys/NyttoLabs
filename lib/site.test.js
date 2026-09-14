import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE_ORIGIN,
  OPERATOR_LINE,
  FTAX_LINE,
  VAT_STATUS_LINE,
  FOOTER_IDENTITY_LINE,
  LEGAL_OPERATOR_PARAGRAPH,
  PUBLIC_ROUTES,
  siteUrl,
  pageMetadata,
} from './site.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicCopyFiles = [
  'lib/site.js',
  'lib/relay/catalog.js',
  'components/site/footer.jsx',
  'components/site/nav.jsx',
  'app/home-view.jsx',
  'app/products/products-view.jsx',
  'app/partners/partners-view.jsx',
  'app/contact/contact-view.jsx',
  'app/privacy/privacy-view.jsx',
  'app/terms/terms-view.jsx',
  'app/terms/page.js',
  'app/privacy/page.js',
  'app/contact/page.js',
  'app/control/page.js',
]

function publicCopyBlob() {
  return publicCopyFiles.map((rel) => readFileSync(join(root, rel), 'utf8')).join('\n')
}

describe('public site origin', () => {
  it('canonicalizes on https://www.nyttolabs.com', () => {
    assert.equal(SITE_ORIGIN, 'https://www.nyttolabs.com')
    assert.equal(siteUrl('/'), SITE_ORIGIN)
    assert.equal(siteUrl('/contact'), 'https://www.nyttolabs.com/contact')
    assert.equal(siteUrl('/privacy'), 'https://www.nyttolabs.com/privacy')
    assert.equal(OPERATOR_LINE, 'Nytto Labs, operated by Fredrik Kornelind (Sweden).')
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

describe('public legal identity', () => {
  it('states the operator, F-tax approval, and VAT registration', () => {
    assert.equal(OPERATOR_LINE, 'Nytto Labs, operated by Fredrik Kornelind (Sweden).')
    assert.equal(FTAX_LINE, 'Approved for F-tax.')
    assert.equal(VAT_STATUS_LINE, 'VAT registered.')
    assert.equal(FOOTER_IDENTITY_LINE, 'Nytto Labs, operated by Fredrik Kornelind (Sweden). Approved for F-tax.')
    assert.equal(
      LEGAL_OPERATOR_PARAGRAPH,
      'Nytto Labs, operated by Fredrik Kornelind (Sweden). Swedish sole trader. Approved for F-tax. VAT registered.',
    )
    const terms = PUBLIC_ROUTES.find((r) => r.path === '/terms')
    assert.match(terms.description, /Fredrik Kornelind/)
  })

  it('does not claim registration is pending or that the operator is not VAT registered', () => {
    const blob = publicCopyBlob()
    const forbidden = [
      'registration in progress',
      'registrering pågår',
      'avoid claiming registration',
      'not VAT registered',
      'not vat registered',
      'not yet registered',
      'ej momsregistrerad',
      'inte momsregistrerad',
      'Operated by Nytto Labs, Sweden.',
      'fkornelind@nyttolabs.com',
    ]
    for (const phrase of forbidden) {
      assert.equal(blob.toLowerCase().includes(phrase.toLowerCase()), false, `public copy still has: ${phrase}`)
    }
  })

  it('does not embed personnummer, VAT IDs, or residential addresses in public copy', () => {
    const blob = publicCopyBlob()
    assert.equal(/\bSE\d{10}01\b/.test(blob), false)
    assert.equal(/\b\d{6}[-+]?\d{4}\b/.test(blob), false)
    assert.equal(/\b\d{8}[-+]?\d{4}\b/.test(blob), false)
    assert.equal(blob.includes('personnummer'), false)
  })
})

describe('products page offerings', () => {
  it('sells three products and sends Curl-to-Buy to pay.nyttolabs.com, not a new Stripe link', () => {
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const meta = readFileSync(join(root, 'app/products/page.js'), 'utf8')
    const lobby = readFileSync(join(root, 'components/lobby/portals.js'), 'utf8')
    assert.match(products, /Three things you can pay for today/)
    assert.match(products, /Tre saker du kan betala för idag/)
    assert.match(products, /name="Curl-to-Buy"/)
    assert.match(products, /CURL_PAY = 'https:\/\/pay\.nyttolabs\.com\/'/)
    assert.match(products, /CYCLE_SHEET = 'https:\/\/buy\.stripe\.com\/aFafZgculf7o8uA7aZ8og0r'/)
    assert.match(meta, /Curl-to-Buy/)
    assert.match(lobby, /CycleTag, Vatidence and Curl-to-Buy/)
    // /buy is retired in favour of a single sales-focused /products page.
    assert.equal(lobby.includes("href: '/buy'"), false)
  })
})

describe('no beta noise on the public site', () => {
  it('never shows beta/private-beta status labels on a live public page', () => {
    const home = readFileSync(join(root, 'app/home-view.jsx'), 'utf8')
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const partners = readFileSync(join(root, 'app/partners/partners-view.jsx'), 'utf8')
    const contact = readFileSync(join(root, 'app/contact/contact-view.jsx'), 'utf8')
    for (const source of [home, products, partners, contact]) {
      assert.equal(/\bbeta\b/i.test(source), false)
      assert.equal(source.includes("p.status === 'building' || p.status === 'public-beta'"), false)
    }
  })
})
