import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedApplications } from './catalog.js'

describe('ensureSeed public catalog repair', () => {
  it('$sets public fields so stale Mongo cannot keep Building', () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'seed.js'), 'utf8')
    assert.match(src, /\$set:\s*publicFields/)
    assert.match(src, /\$setOnInsert:\s*\{\s*id,\s*created_at\s*\}/)
    const cycle = seedApplications().find((a) => a.slug === 'cycletag')
    assert.equal(cycle.status, 'live')
    assert.equal(cycle.section, 'live')
    assert.equal(cycle.url, 'https://cycletag.eu/')
  })
})
