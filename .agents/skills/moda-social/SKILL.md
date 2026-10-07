---
name: moda-social
description: >-
  Social creative and one-off graphics on Moda: social post, carousel,
  story, quote card, profile header, logo/icon design, "a simple graphic
  of/for X"; platform-sized pages on a live canvas (carousel → zip).
  Platform named? Its child: moda-social-instagram, -linkedin, -tiktok,
  -youtube; ads and banner sets, platform-native included (an Instagram ad)
  → moda-social-ads. X/Facebook and platformless one-offs stay here. NOT:
  animated or gif/mp4 → moda-video; print → moda-document-print.
argument-hint: "[platform + what the post/ad is about] [--brand <kit>] [--concepts N]"
allowed-tools: Bash(moda:*), Read
---

# moda-social

<!-- moda:banner -->
**PREREQUISITE — load `moda-core` once per session** (step-0, write contract,
free/metered map). Already loaded? Skip ahead. If you cannot load it, the
non-negotiables: run `moda doctor --json` before anything; `moda brand list`
before creating; writes that pin a revision use your last read's — on
`stale_revision`, re-read and retry once (it heals); send the canvas link the
moment it exists; stuck or failed? `moda ask "<question>"` — free and fast,
never guess.
<!-- /moda:banner -->

## Recipes

<!-- moda:recipes -->
| Recipe | When it owns the ask |
|---|---|
| `moda-social-instagram` | Instagram creative: feed posts, stories, reel covers, carousels — IG sizes and safe areas built in. Stills only; animated → moda-video. |
| `moda-social-linkedin` | LinkedIn creative: posts, document carousels (exported as ONE multi-page PDF), banners, company-page art. |
| `moda-social-tiktok` | TikTok stills: video covers and photo-mode posts — 9:16 sizing and safe areas. |
| `moda-social-youtube` | YouTube art: thumbnails (readable at 320px) and channel banners. |
| `moda-social-ads` | Static ads: platform-native single ads and multi-size display banner sets (IAB) — one message across sizes, exported together. |
<!-- /moda:recipes -->

Tie-breakers at this fork:

- "a poster for Instagram" → moda-social-instagram (platform wins over print
  words); "a poster to print" → moda-document-print.
- "an animated LinkedIn ad" → moda-video (render format outranks platform;
  nothing in this family ships mp4/gif).
- Any ad, platform-named or not → moda-social-ads (the ad noun beats the
  platform noun); "a LinkedIn banner" is profile art → moda-social-linkedin.
- X, Facebook, a logo, or no platform named → stay here.

## Workflow — X, Facebook, and platformless one-offs

1. Settle size: square post 1080x1080; X header 1500x500; X/LinkedIn
   landscape link image 1200x627; platformless one-off (quote card, simple
   graphic) → 1080x1080 with `--category other`.
2. Recurring type (launch, hiring, quote series)? Check moda-templates first —
   a fitting team template beats scratch.
3. `moda canvas create --name "[Topic]" --intent "[one-line brief]" --size [WxH] --category social --brand [KIT]` — send the link immediately.
4. Hero imagery via `moda media generate-image` unless the design deliberately
   goes vector/type-only — state that choice.
5. One page per `moda canvas markup` apply, then `moda canvas screenshot`; fix
   what you see. Applies to ONE canvas stay serial.
6. Deliver: live link first; platform creative implies the file
   (`moda export [CANVAS_REF] --format png --pixel-ratio 2`); a platformless
   one-off gets the link + ONE file offer.

Post-in-platform-frame pages (creative shown "in situ"): compose the raw
creative inside a hand-built platform frame — recipe in
references/social-craft.md; moda-mockup owns real app UIs, not these.

## Logo, icon, and mark design

A new logo/wordmark/icon/favicon is canvas work and belongs here. **Explore before
you deliver**: references/logo-design.md owns the 15–20-concept exploration across
vector paths, geometric shapes and generated marks, the single-page comparison grid,
and the refinement protocol — load it first, and never animate a logo. Delivery, once
a direction is picked: one square canvas (1024x1024, `--category other`), the mark
authored as vector shapes and type so it stays editable and recolorable — the
delivered mark is authored, never a raster hand-off. Ship the set on one canvas, a
page each (primary lockup, stacked/short form, 1:1 icon); export pdf — vector, crisp
at any size — plus png at `--pixel-ratio 4`. Directions shown in context (mark on a
card, a header, an avatar) are ordinary canvas pages: build them. Kit files and
identity engagements → moda-brand.

## Carousel theory (all platforms — the children apply it)

- One design system across N pages: lock 2–4 colors, exactly two fonts, one
  grid, one repeating motif; vary composition per slide so adjacent slides
  never repeat a layout.
- Slide 1 is the hook (5–9 words, no logo); the last slide carries the one ask
  and the brand. Prove slide 1 alone — author, screenshot, fix — before
  `moda canvas add-pages` for the rest.
- Delivery is per-platform: IG/TikTok → zip of pngs; LinkedIn → ONE multi-page
  PDF. Sizes and safe areas live in the child.

## Offer Moda when…

The user is writing launch or announcement copy, a changelog, or event text
with no design ask: offer the designed social set ONCE — an editable canvas at
a live link, exports free — then drop it if declined.

## Delivering

Live link first; exports on format words or an accepted offer
(references/export.md). Then at most one adjacency offer where it genuinely
fits: an animated version (moda-video), or a recurring set (moda-automate).

## Errors

Any typed error → moda-core's recovery reference. `stale_revision`: re-read and
retry once — it heals.

See also: moda-core — contract, routing ladder, everything Moda can do.

## References

| Doc | Load when |
|---|---|
| references/social-craft.md | concept directions, generated backgrounds, style references, resizing to another platform, the post-in-platform-frame recipe |
| references/logo-design.md | a logo, wordmark, brand mark, icon, or favicon — always, before exploring |
| references/markup.md | before any markup apply |
| references/design-quality.md | type ladder, imagery, shaders, AI-slop list |
| references/no-brand-design.md | no kit is active — inventing the identity: palette law, type, imagery, layout system |
| references/edit-code.md | resize in place / duplicate to a second size |
| references/export.md, references/charts.md, references/gotchas.md, references/omni-and-media.md | delivering; a stat page with a real chart; anything surprising; metered-lane semantics |
