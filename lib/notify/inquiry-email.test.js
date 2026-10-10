import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_FROM, buildInquiryEmail, isEmailConfigured, sendInquiryNotification } from './inquiry-email.js'

const partner = {
  company: 'Aqua Filter AB', contactName: 'Anna Berg', workEmail: 'anna@aquafilter.se',
  website: 'https://aquafilter.se', markets: 'SE', message: 'Hej!\nVi vill samarbeta.',
}

describe('inquiry email notification', () => {
  it('is configured only with a Resend key', () => {
    assert.equal(isEmailConfigured({}), false)
    assert.equal(isEmailConfigured({ RESEND_API_KEY: 're_x' }), true)
  })

  it('goes to NOTIFY_EMAIL, replies to the sender, and links to /control', () => {
    const mail = buildInquiryEmail('partner', partner, { NOTIFY_EMAIL: 'owner@example.com', NOTIFY_FROM: 'Nytto <n@nyttolabs.com>' })
    assert.deepEqual(mail.to, ['owner@example.com'])
    assert.equal(mail.from, 'Nytto <n@nyttolabs.com>')
    assert.equal(mail.reply_to, 'anna@aquafilter.se')
    assert.match(mail.subject, /^Ny partnerförfrågan: Aqua Filter AB \(Anna Berg\)$/)
    assert.match(mail.text, /Vi vill samarbeta\./)
    assert.match(mail.text, /nyttolabs\.com\/control/)
  })

  it('falls back to hello@ and the Resend test sender', () => {
    const mail = buildInquiryEmail('contact', { name: 'Erik', email: 'erik@x.se', message: 'Hej' }, {})
    assert.deepEqual(mail.to, ['hello@nyttolabs.com'])
    assert.equal(mail.from, DEFAULT_FROM)
    assert.match(mail.subject, /^Nytt kontaktmeddelande: Erik$/)
  })

  it('keeps header fields on one line so a visitor cannot inject headers', () => {
    const mail = buildInquiryEmail('contact', { name: 'Eve\r\nBcc: x@evil.test', email: 'e@x.se', message: 'hi' }, {})
    assert.equal(/[\r\n]/.test(mail.subject), false)
  })

  it('skips sending without a key and never throws on failure', async () => {
    assert.deepEqual(await sendInquiryNotification({ kind: 'contact', doc: {}, env: {} }), { sent: false, reason: 'not_configured' })
    const failing = async () => { throw new Error('down') }
    const out = await sendInquiryNotification({ kind: 'contact', doc: { name: 'x' }, env: { RESEND_API_KEY: 're_x' }, fetchImpl: failing })
    assert.equal(out.sent, false)
  })

  it('posts to Resend with the bearer key', async () => {
    let seen
    const ok = async (url, init) => { seen = { url, init }; return { ok: true, status: 200 } }
    const out = await sendInquiryNotification({ kind: 'partner', doc: partner, env: { RESEND_API_KEY: 're_x' }, fetchImpl: ok })
    assert.equal(out.sent, true)
    assert.equal(seen.url, 'https://api.resend.com/emails')
    assert.equal(seen.init.headers.Authorization, 'Bearer re_x')
    assert.equal(JSON.parse(seen.init.body).reply_to, 'anna@aquafilter.se')
  })
})
