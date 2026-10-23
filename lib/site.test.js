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
import { CANONICAL_PRODUCT_URLS, defaultPublicProducts } from './relay/catalog.js'
import { TOOLS } from './tools.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => readFileSync(join(root, rel), 'utf8')

const HOME_FILES = ['app/home-view.jsx', 'components/home/home-page.jsx', 'components/home/tool-finder.jsx', 'components/home/tool-visuals.jsx']
const publicCopyFiles = [
  'lib/site.js',
  'lib/relay/catalog.js',
  'lib/tools.js',
  'components/site/footer.jsx',
  'components/site/nav.jsx',
  'components/site/page-shell.jsx',
  ...HOME_FILES,
  'app/products/products-view.jsx',
  'app/partners/partners-view.jsx',
  'app/contact/contact-view.jsx',
  'app/fix/fix-view.jsx',
  'app/privacy/privacy-view.jsx',
  'app/terms/terms-view.jsx',
  'app/not-found-view.jsx',
  'app/opengraph-image.jsx',
  'app/terms/page.js',
  'app/privacy/page.js',
  'app/contact/page.js',
  'app/control/page.js',
]

const publicCopyBlob = () => publicCopyFiles.map(read).join('\n')

// Source with comments removed, so a "formerly CycleTag" note is not public copy.
function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

describe('public site origin', () => {
  it('canonicalizes on https://www.nyttolabs.com', () => {
    assert.equal(SITE_ORIGIN, 'https://www.nyttolabs.com')
    assert.equal(siteUrl('/'), SITE_ORIGIN)
    assert.equal(siteUrl('/contact'), 'https://www.nyttolabs.com/contact')
    assert.equal(siteUrl('/privacy'), 'https://www.nyttolabs.com/privacy')
  })

  it('includes legal and contact routes for sitemap', () => {
    const paths = PUBLIC_ROUTES.map((r) => r.path)
    for (const required of ['/', '/products', '/fix', '/partners', '/contact', '/privacy', '/terms']) {
      assert.equal(paths.includes(required), true, `missing ${required}`)
    }
  })

  it('emits www canonical metadata', () => {
    const meta = pageMetadata({ title: 'Contact — Nytto Labs', description: 'Contact Nytto Labs', path: '/contact' })
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

  it('does not claim registration is pending, and publishes no private address', () => {
    const blob = publicCopyBlob().toLowerCase()
    const forbidden = [
      'registration in progress',
      'registrering pågår',
      'not vat registered',
      'not yet registered',
      'ej momsregistrerad',
      'inte momsregistrerad',
      'operated by nytto labs, sweden.',
      'fkornelind@nyttolabs.com',
      'support@nyttolabs.com',
      'billing@nyttolabs.com',
    ]
    for (const phrase of forbidden) assert.equal(blob.includes(phrase), false, `public copy still has: ${phrase}`)
  })

  it('does not embed personnummer, Swedish VAT IDs, or residential addresses in public copy', () => {
    const blob = publicCopyBlob()
    assert.equal(/\bSE\d{10}01\b/.test(blob), false)
    assert.equal(/\b\d{6}[-+]?\d{4}\b/.test(blob), false)
    assert.equal(/\b\d{8}[-+]?\d{4}\b/.test(blob), false)
    assert.equal(blob.includes('personnummer'), false)
  })
})

// The live products in the Relay catalog, by slug and public name.
const LIVE = defaultPublicProducts().filter((p) => p.status === 'live')

describe('one list of tools, in step with the catalog', () => {
  it('lists every live catalog product, under its public name and canonical URL', () => {
    for (const product of LIVE) {
      const tool = TOOLS.find((t) => t.slug === product.slug)
      assert.ok(tool, `${product.name} is live but missing from lib/tools.js`)
      assert.equal(tool.name, product.name)
      assert.equal(tool.url, CANONICAL_PRODUCT_URLS[product.slug])
    }
  })

  it('shows no catalog product that is not live', () => {
    for (const tool of TOOLS.filter((t) => t.slug)) {
      assert.ok(LIVE.some((p) => p.slug === tool.slug), `${tool.name} is on the site but not live in the catalog`)
    }
  })

  it('sends Nytto Checkout to pay.nyttolabs.com', () => {
    assert.equal(TOOLS.find((t) => t.name === 'Nytto Checkout').url, 'https://pay.nyttolabs.com/')
  })

  it('has complete English and Swedish copy for every tool', () => {
    for (const tool of TOOLS) {
      assert.match(tool.url, /^https:\/\//)
      assert.ok(tool.keywords.length >= 5, `${tool.name} needs keywords for the finder`)
      for (const locale of ['en', 'sv']) {
        for (const field of ['category', 'job', 'free', 'price', 'cta']) {
          assert.ok(tool[locale][field]?.trim(), `${tool.name} ${locale}.${field} is empty`)
        }
      }
    }
  })

  it('shows each price in the currency the tool charges, in English and Swedish', () => {
    for (const tool of TOOLS) {
      for (const locale of ['en', 'sv']) {
        const price = tool[locale].price
        if (tool.currency === 'SEK') {
          assert.match(price, /SEK|kr/, `${tool.name}: ${price}`)
          assert.doesNotMatch(price, /\$|€/, `${tool.name}: ${price}`)
        }
        if (tool.currency === 'EUR') {
          assert.match(price, /€/, `${tool.name}: ${price}`)
          assert.doesNotMatch(price, /\$|SEK|kr\b/, `${tool.name}: ${price}`)
        }
        if (tool.currency === 'USD') assert.doesNotMatch(price, /€|SEK|kr\b/, `${tool.name}: ${price}`)
      }
    }
  })

  it('renders the price list and footer from lib/tools.js', () => {
    assert.match(read('app/products/products-view.jsx'), /TOOLS\.map/)
    assert.match(read('components/site/footer.jsx'), /TOOLS\.map/)
    assert.match(read('components/home/home-page.jsx'), /TOOLS\.map/)
    assert.match(read('app/products/page.js'), /PRODUCTS_DESCRIPTION/)
    // /buy is retired in favour of a single price list on /products.
    assert.match(read('next.config.js'), /source: '\/buy', destination: '\/products'/)
  })

  it('names every tool in the meta, OG, Twitter and JSON-LD descriptions', () => {
    const organization = read('components/site/json-ld.jsx').match(/description: '([^']+)'/)[1]
    for (const [where, text] of [['home', HOME_DESCRIPTION], ['/products', PRODUCTS_DESCRIPTION], ['JSON-LD', organization]]) {
      for (const tool of TOOLS) assert.equal(text.includes(tool.name), true, `${where} description misses ${tool.name}`)
    }
    for (const route of PUBLIC_ROUTES.filter((r) => r.path === '/' || r.path === '/products')) {
      const meta = pageMetadata(route)
      for (const tool of TOOLS) {
        assert.equal(meta.openGraph.description.includes(tool.name), true, `${route.path} OG misses ${tool.name}`)
        assert.equal(meta.twitter.description.includes(tool.name), true, `${route.path} Twitter misses ${tool.name}`)
      }
    }
  })

  it('no longer uses old names or outdated offers in public copy', () => {
    const blob = withoutComments(publicCopyBlob())
    for (const old of ['CycleTag', 'Curl-to-Buy', 'Private beta', '3 scans a day', '3 skanningar per dag', 'reorder labels for filters', 'buy.stripe.com']) {
      assert.equal(blob.includes(old), false, `public copy still says ${old}`)
    }
  })
})

describe('no beta noise on the public site', () => {
  // Rule (owner decision, 2026-09): pages never hardcode "beta" copy, and no
  // product with any status other than live is shown anywhere on the site.
  it('never hardcodes beta or invite-only copy', () => {
    const files = [...HOME_FILES, 'lib/tools.js', 'app/products/products-view.jsx', 'app/partners/partners-view.jsx', 'app/contact/contact-view.jsx', 'app/fix/fix-view.jsx']
    for (const file of files) {
      const code = withoutComments(read(file))
      assert.equal(/\bbeta\b/i.test(code), false, file)
      assert.equal(/invite[- ]only|på inbjudan/i.test(code), false, file)
    }
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
    for (const route of ['index', 'products', 'fix', 'partners', 'contact', 'privacy', 'terms']) {
      const html = join(root, '.next/server/app', `${route}.html`)
      if (!existsSync(html)) continue
      const doc = readFileSync(html, 'utf8')
      const head = doc.slice(doc.indexOf('<body'), doc.indexOf('<h1'))
      assert.doesNotMatch(head, /style="[^"]*opacity:0(?![.\d])/, `/${route === 'index' ? '' : route} SSR wraps its content in opacity:0`)
    }
  })

  it('reveals sections on scroll with CSS only, and never for reduced motion', () => {
    const css = read('app/globals.css')
    const reveal = css.slice(css.indexOf('@keyframes nl-rise'))
    assert.match(reveal, /@media \(prefers-reduced-motion: no-preference\)[\s\S]*@supports \(animation-timeline: view\(\)\)/)
  })
})

describe('one menu, no leftovers', () => {
  it('every header reads the same menu from components/site/nav-links.js', () => {
    const navLinks = read('components/site/nav-links.js')
    for (const href of ["'/products'", "'/fix'", "'/partners'", "'/contact'"]) assert.match(navLinks, new RegExp(`href: ${href}`))
    const siteNav = read('components/site/nav.jsx')
    assert.match(siteNav, /SITE_NAV_LINKS/)
    assert.match(siteNav, /SITE_NAV_CTA/)
    assert.equal(/href="\/contact"/.test(siteNav), false)
    // The home page uses the same shell, so the same header and footer.
    assert.match(read('components/home/home-page.jsx'), /<PageShell>/)
  })

  it('has no lobby, portal or simulator left on the public pages', () => {
    for (const dir of ['components/landing', 'components/landing-v2']) assert.equal(existsSync(join(root, dir)), false, dir)
    for (const file of ['app/not-found-view.jsx', 'components/site/page-shell.jsx', 'components/site/nav.jsx', ...HOME_FILES]) {
      const code = withoutComments(read(file))
      assert.equal(/lobby|portal|relay simulator/i.test(code), false, file)
    }
  })
})

describe('readable text', () => {
  // WCAG 2.1 contrast, computed from the palette in app/globals.css.
  const css = read('app/globals.css')
  const token = (name) => {
    const m = css.match(new RegExp(`--nl-${name}: (#[0-9a-f]{6});`, 'i'))
    assert.ok(m, `missing --nl-${name}`)
    return m[1]
  }
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  it('keeps every text colour at 4.5:1 or better on the backgrounds it is used on', () => {
    for (const bg of ['canvas', 'canvas-2', 'surface']) {
      for (const fg of ['ink', 'ink-2', 'faded', 'iris', 'live']) {
        const r = ratio(token(fg), token(bg))
        assert.ok(r >= 4.5, `--nl-${fg} on --nl-${bg} is ${r.toFixed(2)}:1`)
      }
    }
    for (const fg of ['on-ink', 'on-ink-faded', 'iris-light']) {
      const r = ratio(token(fg), token('ink'))
      assert.ok(r >= 4.5, `--nl-${fg} on --nl-ink is ${r.toFixed(2)}:1`)
    }
  })

  it('never puts white-alpha text from the old dark theme on the light pages', () => {
    for (const file of ['components/site/footer.jsx', 'components/site/page-shell.jsx', 'app/products/products-view.jsx', 'app/contact/contact-view.jsx', 'app/partners/partners-view.jsx', 'app/fix/fix-view.jsx']) {
      assert.equal(/text-white|color: 'rgba\(255,\s*255,\s*255/.test(read(file)), false, file)
    }
  })
})

describe('home page tool grid', () => {
  // Lay the cards out the way CSS grid does (in order, no dense packing) and
  // check that every row is full at two and four columns.
  function rows(cols) {
    const wide = new Set(read('components/home/home-page.jsx').match(/const WIDE = new Set\(\[([^\]]*)\]\)/)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1)))
    const out = []
    let row = 0
    for (const tool of TOOLS) {
      const span = wide.has(tool.name) ? 2 : 1
      if (row + span > cols) {
        out.push(row)
        row = 0
      }
      row += span
    }
    out.push(row)
    return out
  }

  it('fills every row of the bento', () => {
    for (const cols of [2, 4]) assert.deepEqual(rows(cols).filter((n) => n !== cols), [], `gaps at ${cols} columns: ${rows(cols)}`)
  })

  it('draws a picture for every tool', () => {
    const visuals = read('components/home/tool-visuals.jsx')
    for (const tool of TOOLS) assert.match(visuals, new RegExp(`(^|\\s|')${tool.name}'?:?`, 'm'), tool.name)
  })
})

describe('AI on the public site', () => {
  it('tells visitors in both languages what the tool finder sends to Claude', () => {
    const privacy = read('app/privacy/privacy-view.jsx')
    assert.match(privacy, /tool finder on the home page sends the text you type to Claude/)
    assert.match(privacy, /Sökrutan på startsidan skickar texten du skriver till Claude/)
    const finder = read('components/home/tool-finder.jsx')
    assert.match(finder, /leave out personal details/)
    assert.match(finder, /Skriv inga personuppgifter/)
  })

  it('never runs inquiry triage on form submission', () => {
    const route = read('app/api/[[...path]]/route.js')
    for (const form of ["'/partner-inquiries'", "'/contact-inquiries'"]) {
      const start = route.indexOf(`route === ${form}`)
      const block = route.slice(start, route.indexOf('\n    }\n', start))
      assert.equal(/triage|findTools/.test(block), false, form)
    }
  })
})
