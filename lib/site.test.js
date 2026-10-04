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
  HOME_DESCRIPTION,
  PRODUCTS_DESCRIPTION,
  siteUrl,
  pageMetadata,
} from './site.js'
import { defaultPublicProducts } from './relay/catalog.js'

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

// The five live products, by their public names, straight from the catalog.
const LIVE_NAMES = defaultPublicProducts().filter((p) => p.status === 'live').map((p) => p.name)

// Source with comments removed, so a "formerly CycleTag" note is not public copy.
function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

describe('products page offerings', () => {
  it('lists the five live products and sends Nytto Checkout to pay.nyttolabs.com, not a new Stripe link', () => {
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const meta = readFileSync(join(root, 'app/products/page.js'), 'utf8')
    const lobby = readFileSync(join(root, 'components/lobby/portals.js'), 'utf8')
    assert.deepEqual(LIVE_NAMES, ['DeployDoctor', 'StayTag', 'Vatidence', 'Nytto Checkout', 'Failclosed'])
    assert.match(products, /Five live products\./)
    assert.match(products, /Fem produkter, live nu\./)
    assert.equal(products.includes('LiveProof'), false)
    for (const name of LIVE_NAMES) {
      assert.match(products, new RegExp(`name="${name}"`))
    }
    assert.match(products, /CURL_PAY = 'https:\/\/pay\.nyttolabs\.com\/'/)
    assert.match(products, /STAYTAG_SHEET = 'https:\/\/buy\.stripe\.com\/aFafZgculf7o8uA7aZ8og0r'/)
    assert.match(products, /STAYTAG_BULK = 'https:\/\/staytag\.nyttolabs\.com\/bulk'/)
    assert.match(meta, /PRODUCTS_DESCRIPTION/)
    assert.match(lobby, /StayTag, Vatidence and Nytto Checkout/)
    // /buy is retired in favour of a single sales-focused /products page.
    assert.equal(lobby.includes("href: '/buy'"), false)
  })

  it('names every live product in the meta, OG, Twitter and JSON-LD descriptions', () => {
    const jsonLd = readFileSync(join(root, 'components/site/json-ld.jsx'), 'utf8')
    const organization = jsonLd.match(/description: '([^']+)'/)[1]
    for (const [where, text] of [['home', HOME_DESCRIPTION], ['/products', PRODUCTS_DESCRIPTION], ['JSON-LD', organization]]) {
      for (const name of LIVE_NAMES) assert.equal(text.includes(name), true, `${where} description misses ${name}`)
    }
    for (const route of PUBLIC_ROUTES.filter((r) => r.path === '/' || r.path === '/products')) {
      const meta = pageMetadata(route)
      for (const name of LIVE_NAMES) {
        assert.equal(meta.openGraph.description.includes(name), true, `${route.path} OG misses ${name}`)
        assert.equal(meta.twitter.description.includes(name), true, `${route.path} Twitter misses ${name}`)
      }
    }
    assert.match(PRODUCTS_DESCRIPTION, /^Five live products:/)
  })

  it('no longer uses the old product names in public copy', () => {
    const blob = withoutComments(publicCopyBlob())
    for (const old of ['CycleTag', 'Curl-to-Buy', 'Private beta']) {
      assert.equal(blob.includes(old), false, `public copy still says ${old}`)
    }
  })
})

describe('no beta noise on the public site', () => {
  // Rule (owner decision, 2026-09): pages never hardcode "beta" copy, and since
  // Failclosed went live (2026-09-30) no product with any status other than
  // live is shown anywhere on the site.
  it('never hardcodes beta or invite-only copy, and shows only live products', async () => {
    // The landing page body moved to components/landing; scan it with the entry file.
    const home = ['app/home-view.jsx', 'components/landing/landing-page.tsx', 'components/landing/bento-grid.tsx', 'components/landing/previews.tsx', 'components/landing/data.ts']
      .map((rel) => readFileSync(join(root, rel), 'utf8'))
      .join('\n')
    const products = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const partners = readFileSync(join(root, 'app/partners/partners-view.jsx'), 'utf8')
    const contact = readFileSync(join(root, 'app/contact/contact-view.jsx'), 'utf8')
    for (const source of [home, products, partners, contact]) {
      const code = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
      assert.equal(/\bbeta\b/i.test(code), false)
      assert.equal(/invite[- ]only|på inbjudan/i.test(code), false)
      assert.equal(source.includes("p.status === 'building' || p.status === 'public-beta'"), false)
    }
    // The landing page shows exactly the catalog statuses in SHOWCASE_STATUSES…
    const data = readFileSync(join(root, 'components/landing/data.ts'), 'utf8')
    const showcase = JSON.parse(data.match(/SHOWCASE_STATUSES = (\[[^\]]*\])/)[1].replace(/'/g, '"'))
    assert.deepEqual(showcase, ['live'])
    assert.equal(data.includes("'private-beta'"), false)
    assert.equal(data.includes("'public-beta'"), false)
    // …so nothing that is not live is shown, and the live counter shows five.
    const shown = defaultPublicProducts().filter((p) => showcase.includes(p.status))
    const shownNonLive = shown.filter((p) => p.status !== 'live').map((p) => p.slug)
    assert.deepEqual(shownNonLive, [])
    assert.equal(shown.filter((p) => p.status === 'live').length, 5)
    // The footer lists the same set: live products only.
    const footer = readFileSync(join(root, 'components/site/footer.jsx'), 'utf8')
    assert.match(footer, /all\.filter\(\(p\) => p\.status === 'live'\)/)
    assert.equal(footer.includes("'private-beta'"), false)
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

describe('one menu, honest prices, no leftovers', () => {
  it('every header reads the same menu from components/site/nav-links.js', () => {
    const navLinks = readFileSync(join(root, 'components/site/nav-links.js'), 'utf8')
    for (const href of ["'/'", "'/products'", "'/partners'", "'/contact'"]) assert.match(navLinks, new RegExp(`href: ${href}`))
    const siteNav = readFileSync(join(root, 'components/site/nav.jsx'), 'utf8')
    assert.match(siteNav, /SITE_NAV_LINKS/)
    assert.match(siteNav, /SITE_NAV_CTA/)
    assert.equal(/href="\/contact"/.test(siteNav), false)
    const landing = readFileSync(join(root, 'components/landing/landing-page.tsx'), 'utf8')
    assert.match(landing, /SITE_NAV_LINKS\.map/)
    assert.match(landing, /href=\{SITE_NAV_CTA\.href\}/)
    const data = readFileSync(join(root, 'components/landing/data.ts'), 'utf8')
    assert.match(data, /SITE_ROUTES[^\n]*SITE_NAV_LINKS\.filter/)
  })

  it('shows each price in the currency the checkout charges, in English and Swedish', () => {
    const src = readFileSync(join(root, 'app/products/products-view.jsx'), 'utf8')
    const value = (key) => [...src.matchAll(new RegExp(`${key}: '([^']*)'`, 'g'))].map((m) => m[1])
    // StayTag sheets are sold in SEK, Vatidence batches in EUR (see the Stripe links).
    for (const v of [...value('cyclePrice'), ...value('cycleBulk')]) assert.match(v, /SEK|kr/, v)
    for (const v of value('viesPrice')) assert.match(v, /€/, v)
    for (const v of [...value('cyclePrice'), ...value('cycleBulk'), ...value('viesPrice'), ...value('cycleNote'), ...value('viesNote')]) {
      assert.equal(/\$/.test(v), false, `no dollar amount for a SEK/EUR product: ${v}`)
      assert.equal(/at checkout/.test(v), false, `the shown price is the checkout price: ${v}`)
    }
  })

  it('has no lobby wording and no explorer counter on the public pages', () => {
    for (const file of ['app/not-found.js', 'components/site/page-shell.jsx', 'components/site/nav.jsx']) {
      const code = readFileSync(join(root, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      assert.equal(/lobby/i.test(code), false, file)
    }
    for (const file of ['components/landing/landing-page.tsx', 'components/landing/previews.tsx', 'components/landing/relay-playground.tsx']) {
      const src = readFileSync(join(root, file), 'utf8')
      assert.equal(/Explorer|useExplorer|complete\(/.test(src), false, file)
    }
    assert.equal(existsSync(join(root, 'components/landing/explorer.tsx')), false)
    assert.equal(existsSync(join(root, 'components/landing/explorer-hud.tsx')), false)
  })
})
