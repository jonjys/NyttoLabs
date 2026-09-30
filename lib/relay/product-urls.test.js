import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { envProductUrl } from './product-urls.js'
import { CANONICAL_PRODUCT_URLS, defaultPublicProducts } from './catalog.js'

const STAYTAG = 'https://staytag.nyttolabs.com/'
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SLUGS = defaultPublicProducts().map((p) => p.slug)
const OLD_VALUES = ['https://cycletag.eu/', 'https://www.cycletag.eu/', 'https://example.com/', 'https://staytag.nyttolabs.com/other']

function hostOf(url) {
  return new URL(url).hostname
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(js|jsx|ts|tsx)$/.test(name) && !/\.test\.js$/.test(name) ? [path] : []
  })
}

describe('StayTag public URL', () => {
  it('is staytag.nyttolabs.com and can never become cycletag.eu', () => {
    assert.equal(CANONICAL_PRODUCT_URLS.cycletag, STAYTAG)
    assert.equal(envProductUrl('cycletag', {}), STAYTAG)
    // Neither the old nor the new env var can point StayTag back at cycletag.eu.
    for (const url of ['https://cycletag.eu/', 'https://www.cycletag.eu/', 'https://CycleTag.eu/bulk', '  https://cycletag.eu  ']) {
      for (const key of ['PRODUCT_URL_CYCLETAG', 'PRODUCT_URL_STAYTAG']) {
        const result = envProductUrl('cycletag', { [key]: url })
        assert.equal(result, STAYTAG, `${key}=${url}`)
        assert.doesNotMatch(hostOf(result), /cycletag/i)
      }
    }
  })

  it('ignores PRODUCT_URL_CYCLETAG completely, for every product', () => {
    for (const slug of SLUGS) {
      const baseline = envProductUrl(slug, {})
      for (const value of OLD_VALUES) {
        assert.equal(envProductUrl(slug, { PRODUCT_URL_CYCLETAG: value }), baseline, `${slug} with PRODUCT_URL_CYCLETAG=${value}`)
      }
    }
    // No shipped source file reads the old variable.
    for (const dir of ['app', 'components', 'hooks', 'lib']) {
      for (const file of sourceFiles(join(root, dir))) {
        assert.equal(readFileSync(file, 'utf8').includes('env.PRODUCT_URL_CYCLETAG'), false, file)
      }
    }
  })

  it('honours PRODUCT_URL_STAYTAG only for another https address', () => {
    assert.equal(envProductUrl('cycletag', { PRODUCT_URL_STAYTAG: 'https://staytag.example/' }), 'https://staytag.example/')
    assert.equal(envProductUrl('cycletag', { PRODUCT_URL_STAYTAG: 'http://staytag.example/' }), STAYTAG)
    assert.equal(envProductUrl('cycletag', { PRODUCT_URL_STAYTAG: '' }), STAYTAG)
    assert.equal(envProductUrl('cycletag', { PRODUCT_URL_STAYTAG: 'https://' }), STAYTAG)
  })

  it('keeps Vatidence pinned and other overrides working', () => {
    assert.equal(envProductUrl('viesproof', { PRODUCT_URL_VATIDENCE: 'https://viesproof.eu/' }), CANONICAL_PRODUCT_URLS.viesproof)
    assert.equal(envProductUrl('failclosed', {}), CANONICAL_PRODUCT_URLS.failclosed)
    assert.equal(envProductUrl('failclosed', { PRODUCT_URL_FAILCLOSED: 'https://fc.example/' }), 'https://fc.example/')
  })
})
