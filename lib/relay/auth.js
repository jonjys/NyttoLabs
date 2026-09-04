import { COLLECTIONS, getDb } from './db'

const SESSION_COOKIE = 'nytto_session'

export function adminEmailsAllow(email) {
  const raw = process.env.ADMIN_EMAILS || ''
  const list = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const e = String(email || '').toLowerCase()
  return list.some((rule) => (String(rule).startsWith('@') ? e.endsWith(rule) : e === rule))
}

export function verifyPasscode(passcode) {
  const expected = process.env.ADMIN_PASSCODE || ''
  return expected.length > 0 && String(passcode) === expected
}

export async function createSession(email) {
  const db = await getDb()
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')
  const now = new Date()
  const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7) // 7 days
  await db.collection(COLLECTIONS.adminSessions).insertOne({
    id: crypto.randomUUID(),
    token,
    email: String(email).toLowerCase(),
    created_at: now,
    expires_at: expires,
  })
  return { token, expires }
}

export async function getSessionFromRequest(request) {
  const cookie = request.cookies?.get?.(SESSION_COOKIE)?.value
  if (!cookie) return null
  const db = await getDb()
  const session = await db.collection(COLLECTIONS.adminSessions).findOne({ token: cookie })
  if (!session) return null
  if (new Date(session.expires_at) < new Date()) return null
  if (!adminEmailsAllow(session.email)) return null
  return { email: session.email }
}

export async function destroySession(request) {
  const cookie = request.cookies?.get?.(SESSION_COOKIE)?.value
  if (!cookie) return
  const db = await getDb()
  await db.collection(COLLECTIONS.adminSessions).deleteMany({ token: cookie })
}

export { SESSION_COOKIE }
