# Partner integration

Nytto Labs connects high-intent users to relevant products and services. Partners keep checkout, payment, VAT, delivery, returns, and product support. Nytto Labs holds no inventory.

## Relationship types
affiliate · direct referral · revenue share · embedded partnership (CycleTag Inside) · licensing.

## Onboarding (owner, in /control)
1. **Partners → Add partner** — set `approvedDomains` (destination URLs are validated against these; anything else falls back safely).
2. **Offers → Add offer** — map `supportedApplications`, `supportedActions`, `markets`, `categories`, `brands`; set commission model and (optional) disclosed `sponsored` flag.
3. Destination templates may use only allowlisted placeholders: `{query} {country} {language} {category} {brand} {model} {sku} {click_id} {source}`. No `eval`, ever.

## Attribution & conversions
Each resolution issues an opaque `click_id`. Report conversions server-to-server:
```
POST https://nyttolabs.com/api/event
X-Relay-Signature: hex(hmac_sha256(rawBody, RELAY_WEBHOOK_SECRET))
{ "click_id": "<from resolve>", "event_id": "<unique/idempotent>", "amount": 199, "currency": "SEK", "status": "approved" }
```
Conversions are idempotent by `event_id`. Money is stored as integer minor units with an explicit currency; totals are grouped per currency (never summed across currencies without an explicit rate).

## Adding future affiliate-network postbacks
Map the network's postback fields to `click_id`, `event_id`, `amount`, `currency`, then sign the body with `RELAY_WEBHOOK_SECRET`. Add per-network sub-ID support via the offer's `subIdParam` (defaults to `subid`).

## Scoring
User relevance and product compatibility always outweigh commission. Factors: category/brand/SKU match, market availability, partner reliability, verified conversion performance, revenue-per-click, commission (low weight), disclosed sponsored bonus. Every decision stores a human-readable reason.

Contact: partners@nyttolabs.com
