import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  TRIAGE_MODEL,
  TriageError,
  buildTriageRequest,
  inquiryPayload,
  isAiConfigured,
  parseTriageResponse,
  triageInquiry,
  triageJsonSchema,
} from './triage.js'

const GOOD = {
  category: 'partner',
  priority: 'high',
  language: 'en',
  product: 'cycletag',
  summary_sv: 'Ett filterföretag vill bädda in StayTag-etiketter.',
  suggested_action_sv: 'Svara och boka ett samtal.',
  draft_reply: 'Hi Anna,\n\nThanks for reaching out…\n\nFredrik, Nytto Labs',
}

const reply = (obj, extra = {}) => ({
  model: TRIAGE_MODEL,
  stop_reason: 'end_turn',
  content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: JSON.stringify(obj) }],
  ...extra,
})

describe('AI triage', () => {
  it('is configured only when ANTHROPIC_API_KEY is set', () => {
    assert.equal(isAiConfigured({}), false)
    assert.equal(isAiConfigured({ ANTHROPIC_API_KEY: '  ' }), false)
    assert.equal(isAiConfigured({ ANTHROPIC_API_KEY: 'sk-ant-test' }), true)
  })

  it('builds a structured-output request with server-side fallbacks', () => {
    const req = buildTriageRequest('partner', { company: 'Acme', workEmail: 'a@acme.se', message: 'Hej' })
    assert.equal(req.model, 'claude-opus-5-5')
    assert.deepEqual(req.betas, ['server-side-fallback-2026-07-01'])
    assert.equal(req.fallbacks, 'default')
    assert.equal(req.output_config.format.type, 'json_schema')
    assert.equal(req.thinking, undefined, 'thinking cannot be disabled on this model; effort controls depth')
    assert.equal(req.output_config.effort, 'low')
    assert.match(req.messages[0].content, /<inquiry>[\s\S]*"company": "Acme"[\s\S]*<\/inquiry>/)
    assert.match(req.system, /untrusted input/)
  })

  it('requires every schema property and forbids extras', () => {
    const schema = triageJsonSchema()
    assert.equal(schema.additionalProperties, false)
    assert.deepEqual([...schema.required].sort(), Object.keys(schema.properties).sort())
    assert.ok(schema.properties.product.enum.includes('none'))
  })

  it('only sends the form fields, never internal ids or consent data', () => {
    const data = inquiryPayload('contact', { id: 'x', _id: 'y', consent: true, consent_timestamp: new Date(), name: 'Eva', email: 'e@x.se', message: 'Hej', reason: 'general' })
    assert.deepEqual(Object.keys(data).sort(), ['email', 'message', 'name', 'reason'])
  })

  it('rejects an unknown inquiry kind', () => {
    assert.throws(() => buildTriageRequest('newsletter', {}), TriageError)
  })

  it('parses a valid response and reports the serving model', () => {
    const out = parseTriageResponse(reply(GOOD, { model: 'claude-opus-4-8' }))
    assert.equal(out.category, 'partner')
    assert.equal(out.model, 'claude-opus-4-8')
  })

  it('turns refusals, truncation and bad output into TriageErrors', () => {
    assert.throws(() => parseTriageResponse(reply(GOOD, { stop_reason: 'refusal' })), (e) => e.reason === 'refused')
    assert.throws(() => parseTriageResponse(reply(GOOD, { stop_reason: 'max_tokens' })), (e) => e.reason === 'truncated')
    assert.throws(() => parseTriageResponse({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'nope' }] }), (e) => e.reason === 'invalid_output')
    assert.throws(() => parseTriageResponse(reply({ ...GOOD, category: 'vip' })), (e) => e.reason === 'invalid_output')
  })

  it('calls the beta messages endpoint through an injected client', async () => {
    let seen = null
    const client = { beta: { messages: { create: async (req) => { seen = req; return reply(GOOD) } } } }
    const out = await triageInquiry({ kind: 'partner', doc: { company: 'Acme' }, client })
    assert.equal(seen.fallbacks, 'default')
    assert.equal(out.priority, 'high')
  })

  it('wraps transport failures without leaking details', async () => {
    const client = { beta: { messages: { create: async () => { throw new Error('socket hang up') } } } }
    await assert.rejects(triageInquiry({ kind: 'contact', doc: { name: 'x' }, client }), (e) => e instanceof TriageError && e.reason === 'network')
  })
})
