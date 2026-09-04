import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mongoConnectionString, isMongoConfigured, mongoDatabaseName } from './mongo-url.js'

describe('mongo URI guards', () => {
  const keys = ['MONGO_URL', 'MONGODB_URI', 'DB_NAME']
  const snapshot = {}

  beforeEach(() => {
    for (const k of keys) snapshot[k] = process.env[k]
  })

  afterEach(() => {
    for (const k of keys) {
      if (snapshot[k] === undefined) delete process.env[k]
      else process.env[k] = snapshot[k]
    }
  })

  it('treats a missing connection string as unconfigured', () => {
    delete process.env.MONGO_URL
    delete process.env.MONGODB_URI
    assert.equal(isMongoConfigured(), false)
    assert.equal(mongoConnectionString(), '')
  })

  it('rejects non-mongodb strings instead of handing them to the driver', () => {
    process.env.MONGO_URL = 'https://example.com'
    assert.equal(mongoConnectionString(), '')
    assert.equal(isMongoConfigured(), false)
  })

  it('accepts mongodb:// and mongodb+srv:// URIs', () => {
    process.env.MONGO_URL = 'mongodb://localhost:27017/nytto'
    assert.equal(isMongoConfigured(), true)
    assert.ok(mongoConnectionString().startsWith('mongodb://'))
    process.env.MONGO_URL = 'mongodb+srv://user:pass@cluster.mongodb.net/'
    assert.ok(mongoConnectionString().startsWith('mongodb+srv://'))
  })

  it('falls back to a named database', () => {
    delete process.env.DB_NAME
    assert.equal(mongoDatabaseName(), 'nyttolabs')
  })
})
