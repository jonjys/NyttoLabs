# CycleTag → Nytto Relay integration

CycleTag is the first real Relay integration. It stays **privacy-first**: no CycleTag account, tag contents remain client-side, and the complete QR payload is never sent or persisted.

## What Relay receives (minimum commerce context only)
- `query` (product search phrase)
- `country`, `language`
- `category`, `brand`, `model`
- `source` (a non-personal source identifier)

Never send: names, emails, full IP/user-agent, or the full QR payload.

## Client helper (TypeScript) — copy into the CycleTag repository
```ts
export async function resolveReorder(ctx: {
  query: string; country: string; language?: string;
  category?: string; brand?: string; model?: string; source?: string;
}) {
  const res = await fetch('https://nyttolabs.com/api/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app: 'cycletag', action: 'reorder', ...ctx }),
  });
  const data = await res.json();
  // Relay returns a SAFE redirect_url (/go/{click_id}). Never expose destination_url as an open redirect.
  window.location.href = data.redirect_url;
}
```

## Example request / response
Request:
```json
{ "app": "cycletag", "action": "reorder", "country": "SE", "language": "sv",
  "category": "water-filter", "query": "Brita Maxtra Pro", "brand": "Brita", "model": "Maxtra Pro" }
```
Response (shape):
```json
{ "click_id": "<uuid>", "redirect_url": "https://nyttolabs.com/go/<uuid>",
  "destination_url": "https://partner.example/shop?q=...&subid=<uuid>",
  "partner_name": "...", "disclosure": "...", "sponsored": false, "fallback": false,
  "reason": "Selected ... because it matches the water-filter category, supports SE, ..." }
```

## Fallback behavior
When no partner offer matches the app/action/category/market, Relay returns a **neutral search URL** built from the user's own `query` + `country` (e.g. a shopping search). It is clearly not a partner recommendation (`fallback: true`).

## Rollout
Do **not** modify the live CycleTag app from this project. Introduce the helper above via a **separate, reviewed change** in the CycleTag repository. Use `/control` → **Simulator** to validate resolutions first.
