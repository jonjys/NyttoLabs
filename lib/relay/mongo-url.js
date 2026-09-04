// Safe Mongo URI helpers. The official driver calls `.startsWith` on the URI
// argument; passing undefined throws TypeError and took down every `/api/*`
// route in production.

export function mongoConnectionString() {
  const raw = process.env.MONGO_URL || process.env.MONGODB_URI || ''
  const uri = typeof raw === 'string' ? raw.trim() : ''
  if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) return uri
  return ''
}

export function isMongoConfigured() {
  return mongoConnectionString().length > 0
}

export function mongoDatabaseName() {
  const name = typeof process.env.DB_NAME === 'string' ? process.env.DB_NAME.trim() : ''
  return name || 'nyttolabs'
}
