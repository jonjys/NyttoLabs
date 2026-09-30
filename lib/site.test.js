import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
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
  'components/landing/landing-page.tsx',
  'components/landing/bento-grid.tsx',
  'components/landing/previews.tsx',
  'components/landing/data.ts',
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
  it('lists the five live products and sends Nytto Checkout to pay.nyttolabs.com, not a new Stripe link', () => {
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const meta = readFileSync(join(root, 'app/products/page.js'), 'utf8')
    const lobby = readFileSync(join(root, 'components/lobby/portals.js'), 'utf8')
    assert.match(products, /Five live products\./)
    assert.match(products, /Fem produkter, live nu\./)
    assert.equal(products.includes('LiveProof'), false)
    for (const name of ['DeployDoctor', 'StayTag', 'Vatidence', 'Nytto Checkout', 'Failclosed']) {
      assert.match(products, new RegExp(`name="${name}"`))
      assert.match(meta, new RegExp(name))
    }
    assert.match(products, /CURL_PAY = 'https:\/\/pay\.nyttolabs\.com\/'/)
    assert.match(products, /CYCLE_SHEET = 'https:\/\/buy\.stripe\.com\/aFafZgculf7o8uA7aZ8og0r'/)
    assert.match(lobby, /StayTag, Vatidence and Nytto Checkout/)
    // /buy is retired in favour of a single sales-focused /products page.
    assert.equal(lobby.includes("href: '/buy'"), false)
  })
})

describe('renamed products', () => {
  // CycleTag is now StayTag and Curl-to-Buy is now Nytto Checkout. The old names
  // must not appear in public copy; the old in-page anchors stay for old links.
  it('uses StayTag and Nytto Checkout everywhere and keeps the old anchors working', () => {
    const extra = ['components/landing/explorer.tsx', 'components/landing/relay-playground.tsx', 'components/landing/signal-field.tsx', 'components/site/json-ld.jsx', 'app/products/page.js', 'app/partners/partners-view.jsx']
    const blob = [publicCopyBlob(), ...extra.map((rel) => readFileSync(join(root, rel), 'utf8'))].join('\n')
    for (const old of ['CycleTag', 'Curl-to-Buy', 'Curl to Buy']) assert.equal(blob.includes(old), false, old)
    for (const file of ['lib/site.js', 'components/site/json-ld.jsx', 'app/products/page.js']) {
      const src = readFileSync(join(root, file), 'utf8')
      for (const name of ['DeployDoctor', 'StayTag', 'Vatidence', 'Nytto Checkout', 'Failclosed']) assert.match(src, new RegExp(name), `${file}: ${name}`)
    }
    const data = readFileSync(join(root, 'components/landing/data.ts'), 'utf8')
    assert.match(data, /cycletag: 'staytag'/)
    assert.match(data, /'curl-to-buy': 'nytto-checkout'/)
    assert.match(data, /LEGACY_ANCHORS[\s\S]*cycletag: 'cycletag'[\s\S]*'curl-to-buy': 'curl-to-buy'/)
    const bento = readFileSync(join(root, 'components/landing/bento-grid.tsx'), 'utf8')
    assert.match(bento, /id=\{legacyAnchor\}/)
  })
})

describe('only live products on the public site', () => {
  // Rule (owner decision, 2026-09-30): only catalog products with status 'live' are
  // shown, and pages never hardcode "beta" copy.
  it('never hardcodes beta copy and never shows a product whose status is not live', async () => {
    // The landing page body moved to components/landing; scan it with the entry file.
    const home = ['app/home-view.jsx', 'components/landing/landing-page.tsx', 'components/landing/bento-grid.tsx', 'components/landing/previews.tsx', 'components/landing/data.ts']
      .map((rel) => readFileSync(join(root, rel), 'utf8'))
      .join('\n')
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const partners = readFileSync(join(root, 'app/partners/partners-view.jsx'), 'utf8')
    const contact = readFileSync(join(root, 'app/contact/contact-view.jsx'), 'utf8')
    const footer = readFileSync(join(root, 'components/site/footer.jsx'), 'utf8')
    for (const source of [home, products, partners, contact, footer]) {
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      assert.equal(/\bbeta\b/i.test(code), false)
      assert.equal(/invite-only|endast på inbjudan/i.test(code), false)
      assert.equal(code.includes("'private-beta'") || code.includes("'public-beta'") || code.includes("'building'"), false)
    }
    const data = readFileSync(join(root, 'components/landing/data.ts'), 'utf8')
    assert.match(data, /SHOWCASE_STATUSES = \['live'\]/)
    assert.match(footer, /p\.status === 'live'/)
    // The live counter counts catalog products with status 'live': five of them.
    const { defaultPublicProducts } = await import('./relay/catalog.js')
    const live = defaultPublicProducts().filter((p) => p.status === 'live').map((p) => p.name)
    assert.deepEqual(live, ['DeployDoctor', 'StayTag', 'Vatidence', 'Nytto Checkout', 'Failclosed'])
  })
})

describe('page content is visible before JavaScript runs', () => {
  // Anything that wraps every page (root layout, providers, a route template)
  // must not start hidden: SSR HTML with opacity:0 stays blank until hydration,
  // which hurts LCP and leaves an empty page if JS never loads.
  const HIDDEN_STYLE = /opacity\s*:\s*0(?![.\d])|initial=\{\{[^}]*opacity/
  const ROOT_WRAPPERS = ['app/layout.js', 'app/providers.js', ...['js', 'jsx', 'ts', 'tsx'].map((ext) => `app/template.${ext}`)]

  it('renders the root wrapper without opacity:0 in SSR', () => {
    for (const file of ROOT_WRAPPERS) {
      const path = join(root, file)
      if (!existsSync(path)) continue
      assert.doesNotMatch(readFileSync(path, 'utf8'), HIDDEN_STYLE, `${file} hides page content until hydration`)
    }

    // When a production build exists, check the real server-rendered HTML too:
    // nothing between <body> and the page's <h1> may carry an opacity:0 style.
    for (const route of ['index', 'products', 'partners', 'contact', 'privacy', 'terms']) {
      const html = join(root, '.next/server/app', `${route}.html`)
      if (!existsSync(html)) continue
      const doc = readFileSync(html, 'utf8')
      const head = doc.slice(doc.indexOf('<body'), doc.indexOf('<h1'))
      assert.doesNotMatch(head, /style="[^"]*opacity:0(?![.\d])/, `/${route === 'index' ? '' : route} SSR wraps its content in opacity:0`)
    }
  })
})
