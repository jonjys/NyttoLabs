import { createHash, timingSafeEqual } from 'node:crypto'

// Compares a submitted passcode with the expected one in constant time.
// Both sides are hashed first so timingSafeEqual always gets equal-length
// buffers and the expected passcode's length is not leaked either.
export function passcodeMatches(submitted, expected) {
  if (typeof expected !== 'string' || expected.length === 0) return false
  const a = createHash('sha256').update(String(submitted ?? '')).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}
