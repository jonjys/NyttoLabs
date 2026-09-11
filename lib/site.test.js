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

describe('buy page offerings', () => {
  it('sells three products and sends Curl-to-Buy to pay.nyttolabs.com, not a new Stripe link', () => {
    const buy = readFileSync(join(root, 'app/buy/buy-view.jsx'), 'utf8')
    const meta = readFileSync(join(root, 'app/buy/page.js'), 'utf8')
    const lobby = readFileSync(join(root, 'components/lobby/portals.js'), 'utf8')
    assert.match(buy, /Three things you can pay for today/)
    assert.match(buy, /Tre saker du kan betala för idag/)
    assert.match(buy, /name="Curl-to-Buy"/)
    assert.match(buy, /CURL_PAY = 'https:\/\/pay\.nyttolabs\.com\/'/)
    assert.match(buy, /CYCLE_SHEET = 'https:\/\/buy\.stripe\.com\/aFafZgculf7o8uA7aZ8og0r'/)
    assert.match(buy, /CYCLE_BULK = 'https:\/\/buy\.stripe\.com\/28E4gy65X4sK9yE52R8og0q'/)
    assert.equal((buy.match(/buy\.stripe\.com/g) || []).length, 2)
    assert.match(meta, /Curl-to-Buy/)
    assert.match(lobby, /CycleTag, VIESproof and Curl-to-Buy/)
  })
})

describe('home status sections', () => {
  it('groups products by the shared status helper and never hand-rolls it', () => {
    const home = readFileSync(join(root, 'app/home-view.jsx'), 'utf8')
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    // The homepage is the 3D lobby and lists no products, so only the products
    // view groups them. The guard against hand-rolled status logic still
    // applies to both, so re-adding a product list to the homepage cannot
    // reintroduce it.
    assert.match(products, /groupPublicProductsByStatus/)
    for (const source of [home, products]) {
      assert.equal(source.includes('In active development — not marked live.'), false)
      assert.equal(source.includes("p.status === 'building' || p.status === 'public-beta'"), false)
    }
  })
})
