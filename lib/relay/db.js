import { MongoClient } from 'mongodb'

// Reuse a single Mongo connection across hot reloads / invocations.
let client
let db

export async function getDb() {
  if (!db) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

export const COLLECTIONS = {
  applications: 'applications',
  actions: 'actions',
  partners: 'partners',
  offers: 'offers',
  routingRules: 'routing_rules',
  clickEvents: 'click_events',
  conversions: 'conversions',
  experiments: 'experiments',
  experimentAssignments: 'experiment_assignments',
  partnerInquiries: 'partner_inquiries',
  auditLogs: 'audit_logs',
  settings: 'settings',
  adminSessions: 'admin_sessions',
}

// Strip Mongo internal _id for safe JSON responses.
export function clean(doc) {
  if (!doc) return doc
  if (Array.isArray(doc)) return doc.map(clean)
  const { _id, ...rest } = doc
  return rest
}

export function isDemoMode() {
  return String(process.env.DEMO_MODE || '').toLowerCase() === 'true'
}

export async function audit(actor, action, entity, entityId, meta = {}) {
  try {
    const database = await getDb()
    await database.collection(COLLECTIONS.auditLogs).insertOne({
      id: crypto.randomUUID(),
      actor: actor || 'system',
      action,
      entity,
      entity_id: entityId || null,
      meta,
      created_at: new Date(),
    })
  } catch (e) {
    // Never let auditing break the main flow.
    console.error('audit error', e)
  }
}
