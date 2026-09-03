# CycleTag → Nytto Relay: Go-Live PR Kit

A ready-to-review change to wire the **live CycleTag app** to Nytto Relay. It is intentionally small, privacy-first, and reversible. Do **not** apply this from the Relay project — open it as a **separate, reviewed pull request in the CycleTag repository**.

Positioning: CycleTag stays stateless and privacy-first. Relay receives only the minimum commerce context (never the full QR payload, never personal data).

---

## 1) Environment variable (CycleTag repo)

```
# .env / Vercel project settings
NEXT_PUBLIC_RELAY_BASE_URL=https://nyttolabs.com
```

## 2) New file: `src/lib/nyttoRelay.ts`

```ts
// CycleTag → Nytto Relay client helper.
// Privacy-first: sends only minimal, non-personal commerce context. Never sends
// the raw QR payload, names, emails, IPs, or user-agent.

export type RelayReorderContext = {
  query: string;            // product search phrase, e.g. "Brita Maxtra Pro"
  country: string;          // ISO-3166 alpha-2, e.g. "SE"
  language?: string;        // e.g. "sv"
  category?: string;        // e.g. "water-filter"
  brand?: string;           // e.g. "Brita"
  model?: string;           // e.g. "Maxtra Pro"
  source?: string;          // NON-personal source id (e.g. "tag" or a campaign code)
};

export type RelayResolution = {
  click_id: string;
  redirect_url: string;     // ALWAYS navigate here (safe /go/{click_id} link)
  partner_name: string | null;
  disclosure: string;
  sponsored: boolean;
  fallback: boolean;
  reason: string;
};

const BASE = process.env.NEXT_PUBLIC_RELAY_BASE_URL ?? "https://nyttolabs.com";

// Belt-and-braces: strip anything that looks personal before it ever leaves the client.
function scrub(v?: string): string | undefined {
  if (!v) return v;
  return v
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, "")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function resolveReorder(
  ctx: RelayReorderContext,
  opts: { signal?: AbortSignal } = {}
): Promise<RelayResolution> {
  const body = {
    app: "cycletag",
    action: "reorder",
    query: scrub(ctx.query),
    country: ctx.country,
    language: ctx.language,
    category: ctx.category,
    brand: scrub(ctx.brand),
    model: scrub(ctx.model),
    source: ctx.source,
  };

  const res = await fetch(`${BASE}/api/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: opts.signal,
  });
  if (!res.ok) throw new Error(`Relay resolve failed: ${res.status}`);
  return (await res.json()) as RelayResolution;
}

// Convenience: resolve then navigate to the SAFE redirect.
export async function goReorder(ctx: RelayReorderContext): Promise<void> {
  const r = await resolveReorder(ctx);
  window.location.href = r.redirect_url; // never use destination_url directly
}
```

## 3) Wire the reorder button (example)

Replace the existing direct "Buy again / Reorder" link handler with a Relay call. The QR payload is decoded client-side as today; only the commerce fields are forwarded.

```tsx
import { goReorder } from "@/lib/nyttoRelay";

// `tag` is the object you already decode from the QR payload, client-side.
async function onReorderClick(tag: {
  productName: string; brand?: string; model?: string; category?: string;
}) {
  await goReorder({
    query: [tag.brand, tag.productName ?? tag.model].filter(Boolean).join(" "),
    country: navigator.language?.split("-")[1]?.toUpperCase() || "SE",
    language: navigator.language?.split("-")[0] || "sv",
    category: tag.category,          // e.g. "water-filter" (optional)
    brand: tag.brand,
    model: tag.model,
    source: "tag",                    // non-personal
  });
}

// <button onClick={() => onReorderClick(tag)}>Reorder</button>
```

## 4) Optional test (Vitest)

```ts
import { describe, it, expect, vi } from "vitest";
import { resolveReorder } from "@/lib/nyttoRelay";

describe("resolveReorder", () => {
  it("posts minimal context and returns a safe redirect_url", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        click_id: "abc", redirect_url: "https://nyttolabs.com/go/abc",
        partner_name: "AquaPure", disclosure: "…", sponsored: false,
        fallback: false, reason: "…",
      }),
    });
    // @ts-expect-error test stub
    global.fetch = fetchMock;

    const r = await resolveReorder({ query: "Brita Maxtra Pro", country: "SE", category: "water-filter", brand: "Brita" });
    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(sentBody.app).toBe("cycletag");
    expect(sentBody.action).toBe("reorder");
    expect(r.redirect_url).toContain("/go/");
  });
});
```

---

## Review checklist (for the CycleTag PR)
- [ ] No personal data (names, emails, IP, user-agent, raw QR payload) is sent to Relay.
- [ ] Navigation uses `redirect_url` (safe `/go/{click_id}`), never `destination_url`.
- [ ] `NEXT_PUBLIC_RELAY_BASE_URL` is set in CycleTag's environment.
- [ ] Fallback works: if Relay returns `fallback: true`, the user still reaches a useful neutral search.
- [ ] The affiliate disclosure returned by Relay is displayed near the reorder action.
- [ ] Change is behind a feature flag if you want a staged rollout.

## Rollback
Delete `src/lib/nyttoRelay.ts` and restore the previous reorder link. No Relay-side data migration is involved because Relay stores no CycleTag personal data.

## On the Relay side (already done)
1. In `/control` → **Partners**, add the real reorder partner(s) with their **approved domains**.
2. In `/control` → **Offers**, create offers for `app: cycletag`, actions `reorder`/`replace`, the right `markets`/`categories`/`brands`, and a destination template using only allowlisted placeholders.
3. In `/control` → **Settings**, switch **Demo mode → Production** so only real partners route (and optionally set `DEMO_MODE=false` in the environment and purge demo data).
