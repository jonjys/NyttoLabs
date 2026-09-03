// Privacy-first input sanitisation.
// Relay must never persist personal data. We strip / reject obvious PII from
// free-text commerce fields before routing or storage.

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/g
const LONG_DIGITS_RE = /\b\d{9,}\b/g // long id / personal number-like runs

export function containsPII(value) {
  if (typeof value !== 'string') return false
  return EMAIL_RE.test(value) || PHONE_RE.test(value) || LONG_DIGITS_RE.test(value)
}

export function stripPII(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(EMAIL_RE, '')
    .replace(PHONE_RE, '')
    .replace(LONG_DIGITS_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Fields that are allowed to carry free text describing a product intent.
const TEXT_FIELDS = ['query', 'brand', 'model', 'category', 'source']

// Returns { clean, rejected } where rejected lists fields that carried PII.
export function sanitizeResolveInput(input) {
  const clean = { ...input }
  const rejected = []
  for (const f of TEXT_FIELDS) {
    if (typeof clean[f] === 'string' && clean[f]) {
      if (containsPII(clean[f])) rejected.push(f)
      clean[f] = stripPII(clean[f])
    }
  }
  // Country/language normalisation.
  if (clean.country) clean.country = String(clean.country).toUpperCase().slice(0, 2)
  if (clean.language) clean.language = String(clean.language).toLowerCase().slice(0, 5)
  return { clean, rejected }
}
