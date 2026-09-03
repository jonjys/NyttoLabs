// Deterministic, auditable offer scoring.
// User relevance and product compatibility ALWAYS outweigh commission.

export const WEIGHTS = {
  categoryMatch: 30,
  brandMatch: 22,
  skuMatch: 18,
  marketExact: 20,
  marketGlobal: 8,
  reliability: 10, // scaled by reliabilityScore/100
  conversion: 12, // only when verified stats exist
  rpc: 10, // normalised within candidate set
  commission: 6, // deliberately low
  sponsored: 4, // small, always disclosed
}

function listIncludes(list, value) {
  if (!Array.isArray(list) || list.length === 0) return false
  const v = String(value || '').toLowerCase()
  return list.some((x) => String(x).toLowerCase() === v)
}

function isGlobal(markets) {
  return !Array.isArray(markets) || markets.length === 0 || markets.includes('*')
}

// Eligibility gate. Returns { ok:true } or { ok:false, reason }.
export function isOfferEligible(offer, partner, input, now = new Date()) {
  if (!offer.active) return { ok: false, reason: 'offer inactive' }
  if (!partner || !partner.active) return { ok: false, reason: 'partner inactive' }

  if (offer.startDate && new Date(offer.startDate) > now) return { ok: false, reason: 'offer not started' }
  if (offer.endDate && new Date(offer.endDate) < now) return { ok: false, reason: 'offer expired' }

  if (!listIncludes(offer.supportedApplications, input.app)) return { ok: false, reason: 'app not supported' }
  if (!listIncludes(offer.supportedActions, input.action)) return { ok: false, reason: 'action not supported' }

  if (input.country && !isGlobal(offer.markets) && !listIncludes(offer.markets, input.country)) {
    return { ok: false, reason: 'market not supported' }
  }

  // If the offer is category-scoped and the request has a category, require a match.
  if (input.category && Array.isArray(offer.categories) && offer.categories.length > 0) {
    if (!listIncludes(offer.categories, input.category)) return { ok: false, reason: 'category mismatch' }
  }
  return { ok: true }
}

// Score a single eligible offer. `norm` carries candidate-set maxima for normalisation.
export function scoreOffer(offer, partner, input, norm) {
  const factors = []
  let score = 0
  const add = (label, points) => {
    if (points > 0) {
      score += points
      factors.push({ label, points: Math.round(points * 100) / 100 })
    }
  }

  if (input.category && listIncludes(offer.categories, input.category)) add(`matches the ${input.category} category`, WEIGHTS.categoryMatch)
  if (input.brand && listIncludes(offer.brands, input.brand)) add(`matches the ${input.brand} brand`, WEIGHTS.brandMatch)
  if (input.sku && offer.sku && String(offer.sku).toLowerCase() === String(input.sku).toLowerCase()) add('matches the exact SKU', WEIGHTS.skuMatch)

  if (input.country && listIncludes(offer.markets, input.country)) add(`supports ${input.country}`, WEIGHTS.marketExact)
  else if (isGlobal(offer.markets)) add('is available globally', WEIGHTS.marketGlobal)

  const rel = (Number(partner.reliabilityScore) || 0) / 100
  add('has a reliable partner track record', rel * WEIGHTS.reliability)

  if (offer.stats && offer.stats.verified && offer.stats.conversionRate > 0) {
    add('has the strongest verified conversion performance', offer.stats.conversionRate * WEIGHTS.conversion)
  }

  if (norm.maxRpc > 0 && offer.stats && offer.stats.rpcMinor > 0) {
    add('has strong revenue-per-click', (offer.stats.rpcMinor / norm.maxRpc) * WEIGHTS.rpc)
  }

  if (norm.maxCommission > 0 && offer.commissionAmount > 0) {
    add('offers competitive commission', (offer.commissionAmount / norm.maxCommission) * WEIGHTS.commission)
  }

  if (offer.sponsored) add('is a disclosed sponsored placement', WEIGHTS.sponsored)

  return { score: Math.round(score * 100) / 100, factors }
}

// Select the best offer from a candidate set of { offer, partner }.
// Returns null if none are eligible.
export function selectOffer(candidates, input, now = new Date()) {
  const eligible = []
  for (const c of candidates) {
    const e = isOfferEligible(c.offer, c.partner, input, now)
    if (e.ok) eligible.push(c)
  }
  if (eligible.length === 0) return null

  const maxRpc = Math.max(...eligible.map((c) => c.offer.stats?.rpcMinor || 0), 0)
  const maxCommission = Math.max(...eligible.map((c) => c.offer.commissionAmount || 0), 0)
  const norm = { maxRpc, maxCommission }

  const scored = eligible.map((c) => ({
    ...c,
    ...scoreOffer(c.offer, c.partner, input, norm),
  }))

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if ((b.partner.reliabilityScore || 0) !== (a.partner.reliabilityScore || 0))
      return (b.partner.reliabilityScore || 0) - (a.partner.reliabilityScore || 0)
    return (b.offer.priority || 0) - (a.offer.priority || 0)
  })

  const winner = scored[0]
  const reasonFactors = winner.factors.map((f) => f.label)
  const reason = `Selected ${winner.partner.name} because it ${reasonFactors.join(', ')}.`

  return { ...winner, reason, candidatesConsidered: scored.length }
}
