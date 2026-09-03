# Nytto Relay

**Focused software. Invisible infrastructure. Practical outcomes.**

Nytto Relay is the private control plane and deterministic offer-routing engine behind Nytto Labs. Nytto Labs products create or detect commercial intent; Relay converts that intent into the most useful, relevant next action — and records the resulting partner revenue.

## What it is
- A public Nytto Labs company website (`/`, `/products`, `/partners`, `/privacy`, `/terms`, `/contact`)
- A private owner control plane at `/control`
- A deterministic, auditable resolver at `POST /api/resolve`
- A safe redirect + attribution layer at `/go/[click_id]`
- A signed conversion webhook at `POST /api/event`
- A partner & offer database, a CycleTag adapter, and a generic adapter for any Nytto Labs app

## How it makes money
Affiliate commission, direct referral agreements, revenue share, disclosed sponsored placement, CycleTag Inside licensing, white-label licensing, and (later) paid API access.

## What it does NOT do
No inventory, no packaging, no third-party checkout, no shipping, no returns, no dropshipping, no warehouse. Partners keep checkout, payment, VAT, delivery, returns, and product support. No fake products/partners/prices/conversions/integrations.

## Active portfolio (authoritative)
1. **CycleTag** — Live, flagship, first real Relay integration (reorder, replace, print, compare)
2. **VIESProof** — Live, B2B verification (verify, export, compare)
3. **GateZero** — Building, developer infrastructure (monitor, compare, route)
4. **AI Venture Worker** — Ventures/internal (launch, host, register, compare)
5. **Nytto Relay** — internal infrastructure (not shown on the public product grid)

> Netfold, Skrivklart, and Invoic are intentionally out of scope and absent everywhere.

## Data store note
The reference spec suggests Supabase Postgres. **This deployment runs on MongoDB** (per the hosting environment) with the same logical tables/collections, RLS-equivalent server-side authorization, and the same routing/attribution/revenue logic. Auth uses an email + passcode admin session (allowlisted via `ADMIN_EMAILS`) instead of Supabase magic links. All business logic lives in `lib/relay/*` and is store-agnostic.

## Run locally
```bash
yarn install
# ensure MongoDB is running and /app/.env is set (see .env.example)
yarn dev        # http://localhost:3000  (managed by supervisor in this env)
```
Applications self-seed on first API call. DEMO partners/offers seed only when `DEMO_MODE=true`.

## Configure admin access
Set in `.env`:
```
ADMIN_EMAILS=you@nyttolabs.com,@nyttolabs.com
ADMIN_PASSCODE=<strong passcode>
RELAY_WEBHOOK_SECRET=<random hex>
```
Sign in at `/control`.

## Create the first REAL partner
1. `/control` → **Partners** → Add partner. Set **approved domains** (destinations are validated against these).
2. `/control` → **Offers** → Add offer. Use only allowlisted placeholders in the destination template: `{query} {country} {language} {category} {brand} {model} {sku} {click_id} {source}`.
3. Turn `DEMO_MODE=false` in production so DEMO offers never route.

## Test routing
Use `/control` → **Simulator**, or:
```bash
curl -s -X POST $BASE/api/resolve -H 'Content-Type: application/json' \
  -d '{"app":"cycletag","action":"reorder","country":"SE","category":"water-filter","query":"Brita Maxtra Pro","brand":"Brita"}'
```

## Deploy to Vercel
Relay is Vercel-compatible (App Router server routes). Set the environment variables from `.env.example` in the Vercel project (use a hosted MongoDB such as MongoDB Atlas for `MONGO_URL`). Point `nyttolabs.com` at the deployment; `/control` is the private plane.

## Connect an existing Nytto Labs app
Every app calls the same API with its own `app` slug and an `action`. See `docs/CYCLETAG-INTEGRATION.md` and `docs/PARTNER-INTEGRATION.md`.
