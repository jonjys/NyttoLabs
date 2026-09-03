// Money is always stored as integer minor units + a separate currency code.
// We never mix currencies into one total without an explicit conversion rate.

export const ZERO_DECIMAL = new Set(['JPY', 'KRW'])

export function minorFactor(currency) {
  return ZERO_DECIMAL.has((currency || '').toUpperCase()) ? 1 : 100
}

// Convert a human major amount (e.g. 12.50) to integer minor units (1250).
export function toMinor(amount, currency) {
  const n = Number(amount)
  if (!isFinite(n)) return 0
  return Math.round(n * minorFactor(currency))
}

// Format integer minor units for display, grouped by its own currency.
export function formatMinor(minor, currency) {
  const cur = (currency || 'SEK').toUpperCase()
  const value = (Number(minor) || 0) / minorFactor(cur)
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: cur,
      minimumFractionDigits: ZERO_DECIMAL.has(cur) ? 0 : 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${cur}`
  }
}

// Group an array of { currency, amountMinor } into totals per currency.
export function groupByCurrency(rows) {
  const map = {}
  for (const r of rows || []) {
    const cur = (r.currency || 'SEK').toUpperCase()
    map[cur] = (map[cur] || 0) + (Number(r.amountMinor) || 0)
  }
  return Object.entries(map).map(([currency, amountMinor]) => ({ currency, amountMinor }))
}
