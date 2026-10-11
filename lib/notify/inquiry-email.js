// Email notification to the owner when a partner inquiry or contact message
// arrives. Sent through Resend's REST API (RESEND_API_KEY). It never blocks or
// fails the form: if email is not configured or Resend errors, the inquiry is
// still stored and the visitor still gets "received".
//
// Env:
//   RESEND_API_KEY  required to send at all
//   NOTIFY_EMAIL    recipient (default: the public hello@ inbox)
//   NOTIFY_FROM     sender; must be on a domain verified in Resend
//                   (default: Resend's shared test sender, which only
//                   delivers to the Resend account owner's own address)
import { PUBLIC_HELLO_EMAIL } from '../relay/catalog.js'

export const DEFAULT_FROM = 'Nytto Labs <onboarding@resend.dev>'
const CONTROL_URL = 'https://www.nyttolabs.com/control'
const RESEND_URL = 'https://api.resend.com/emails'

// Resend keys look like re_xxx. A key pasted with a line break, a space or a
// typographic quote inside cannot go in an HTTP header, and fetch throws
// before the request leaves the server.
const KEY_FORMAT = /^re_[A-Za-z0-9_-]+$/

export function emailKeyStatus(env = process.env) {
  const raw = typeof env.RESEND_API_KEY === 'string' ? env.RESEND_API_KEY.trim() : ''
  if (!raw) return 'missing'
  return KEY_FORMAT.test(raw) ? 'ok' : 'invalid_format'
}

export function isEmailConfigured(env = process.env) {
  return emailKeyStatus(env) === 'ok'
}

const oneLine = (v, max = 120) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)

export function buildInquiryEmail(kind, doc, env = process.env) {
  const to = (env.NOTIFY_EMAIL || '').trim() || PUBLIC_HELLO_EMAIL
  const from = (env.NOTIFY_FROM || '').trim() || DEFAULT_FROM
  const partner = kind === 'partner'
  const who = partner ? `${oneLine(doc.company)} (${oneLine(doc.contactName)})` : oneLine(doc.name)
  const replyTo = oneLine(partner ? doc.workEmail : doc.email, 200)

  const rows = partner
    ? [
        ['Företag', doc.company], ['Kontakt', doc.contactName], ['E-post', doc.workEmail], ['Webbplats', doc.website],
        ['Marknader', doc.markets], ['Kategorier', doc.categories], ['Affiliatenätverk', doc.affiliateNetwork],
        ['Föreslaget samarbete', doc.proposedPartnership],
      ]
    : [['Namn', doc.name], ['E-post', doc.email], ['Ämne', doc.reason]]

  const text = [
    partner ? 'Ny partnerförfrågan på nyttolabs.com' : 'Nytt kontaktmeddelande på nyttolabs.com',
    '',
    ...rows.filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k}: ${oneLine(v, 400)}`),
    '',
    'Meddelande:',
    String(doc.message || '(inget meddelande)').slice(0, 4000),
    '',
    `Svara direkt på det här mejlet så går svaret till avsändaren.`,
    `Analysera och få ett svarsutkast i ${CONTROL_URL}`,
  ].join('\n')

  return {
    from,
    to: [to],
    subject: `${partner ? 'Ny partnerförfrågan' : 'Nytt kontaktmeddelande'}: ${who}`.slice(0, 180),
    text,
    ...(replyTo.includes('@') ? { reply_to: replyTo } : {}),
  }
}

export async function sendInquiryNotification({ kind, doc, env = process.env, fetchImpl = fetch, timeoutMs = 4000 }) {
  const keyStatus = emailKeyStatus(env)
  if (keyStatus === 'missing') return { sent: false, reason: 'not_configured' }
  if (keyStatus === 'invalid_format') {
    console.error('Inquiry notification skipped: RESEND_API_KEY has an invalid format (line break, space or special character inside). Paste the key again.')
    return { sent: false, reason: 'invalid_key_format' }
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildInquiryEmail(kind, doc, env)),
      signal: controller.signal,
    })
    if (!res.ok) {
      console.error('Inquiry notification failed:', res.status)
      return { sent: false, reason: `resend_${res.status}` }
    }
    return { sent: true }
  } catch (error) {
    // Name and network code only: a fetch error message can echo header values.
    console.error('Inquiry notification failed:', error?.name || 'Error', error?.cause?.code || (controller.signal.aborted ? 'timeout' : 'network'))
    return { sent: false, reason: controller.signal.aborted ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}
