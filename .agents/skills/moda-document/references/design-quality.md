# Design quality — the taste layer

This is the judgment layer that separates a designed artifact from a rendered one. It distills how Moda's own design agent is instructed to work; everything here executes through the ordinary CLI verbs.

## Data preservation (non-negotiable during recreation)

Source nodes are the canonical record: relay their content into a better layout, never author new content. Copy every text string, number, percentage, date, currency value, sample size (`n=...`), question id (`Q12`), citation, source line, and footer VERBATIM — you may delete and recreate the nodes, but not change what they say. N source bars → exactly N bars with the same labels and values; no source chart → don't add one to fill space. Never import data from memory, training examples, or your own prior turns. Two exceptions only: an explicit user request (do exactly what they ask) and an unambiguous typo/grammar fix in narrative prose — never an auto-fix to a number, label, citation, sample size, question id, or footer. Applies to every content-bearing layout: chart, stat callout, methodology page, pricing table.

## Smallest-change routing — edit vs markup

Pick the verb by the most layout-intensive part of the request, not the number of sub-tasks.

Use `moda canvas edit` when the whole change is mechanical, localized, or a deterministic transform:

- Color, font, copy, opacity, stroke, corner radius, shadow.
- Bulk style ("all headers to Playfair Display", "body text +2px").
- Precise minor move/align ("title down 20px", "center this logo").
- Text replacement, reordering, duplication, simple resizing.
- Layout changes ONLY when truly minor: one node, one obvious pair, or removing stray outlier nodes without changing the composition (removal itself goes through `moda canvas delete-items`).

Use `moda canvas markup` when the request asks for layout quality, visual redesign, or structural cleanup:

- "Clean this up", "make it polished", "improve the layout", "fix this messy slide".
- Coordinated decisions about hierarchy, spacing, grouping, font scale, card structure, rows/columns, or responsive composition.
- Anytime the edit equivalent would mean hand-computing x/y/width/height for several related nodes.
- Coordinating 3+ nodes, rebalancing a section, or making a messy area look polished is recreation territory. Rebuild the smallest coherent region with `<row>`/`<column>`/gap/padding rather than absolutely repositioning many existing nodes.

Escalation: if ANY change within the target scope needs non-trivial layout recomposition, route the WHOLE scope through markup and fold the simpler fixes (copy mistakes, font-size tweaks, deleting bad nodes) into the recreation — the layout requirement decides.

Target scope: recreate the smallest region the request implies. If the user names a section, card group, table, diagram, hero, or middle area, recreate only that. Preserve unrelated content, background, logos, image assets, brand colors, and copy, reusing asset refs from `moda canvas read` exactly. If scope is ambiguous, pick the visually coherent region implied — or ask one brief clarification if destructive replacement would be risky.

### Recreate workflow

1. Inventory the target region — text, numbers, images, brand colors, approximate bounds — and write the source values down before generating markup. Note any explicit user edits alongside them.
2. Remove the prior content: for a sub-region, `moda canvas delete-items` only those nodes; for a WHOLE-page rebuild, skip the separate delete and pass `--mode replace` to `moda canvas markup` in step 3 — one atomic call, never delete-all then recreate (a separate delete+create can leave the page empty if interrupted).
3. Recreate with `moda canvas markup` (`--mode replace` for a full-page rebuild), auto-layout containers first; every text/number must trace to an inventoried source node or the user's explicit request.
4. `moda canvas screenshot` the changed pages, review, then make small follow-up `moda canvas edit` adjustments only if needed.

## Typography — compute the ladder from the canvas you chose

Type sizing is a formula, not a vibe. Body size anchors everything:

```
body_px = max(base_pct × min(canvas_width, canvas_height), floor_px)
```

Per viewing context:

| Context | Formats | base_pct | floor |
|---|---|---|---|
| Projected (read across a room) | slides, video | 0.037 | 18px |
| Feed (bold at thumb-scroll scale) | social, carousel | 0.042 | 28px |
| Web ad (small banners, stays proportionate) | web-ads | 0.050 | 11px |
| Document (read up close) | pdf, prints | 0.014 | 11px |

Every other role is a multiple of body, and no role ever goes below the floor:

| Role | × body |
|---|---|
| Hero / cover headline | 6.0–8.0 |
| Headline / title | 2.4–3.6 |
| Subhead / section label | 1.3–1.8 |
| Body | 1.0 |
| Caption / small label | 0.7–0.85 (clamped to the floor) |
| Stat / KPI numeral | 3–12 |

**Worked examples** (compute yours the same way — do the arithmetic explicitly, don't estimate):

- **1920×1080 deck** (projected): body = max(0.037 × 1080, 18) ≈ **40px**. Hero 240–320, headline 96–144, subhead 52–72, caption 28–34, KPI 120–480.
- **816×1056 one-pager** (document): body = max(0.014 × 816, 11) ≈ **11px**. Headline 27–41, subhead 15–21, caption 11 (floor), KPI 34–137.
- **1080×1080 social post** (feed): body = max(0.042 × 1080, 28) ≈ **45px**. Hero 270–363, headline 109–163, subhead 59–82, caption 32–39.

The FLOOR is the one hard rule — never go below it; **cut copy before shrinking type**. The per-role sizes are calibrated starting points, not compliance targets: deviate when the layout calls for it, and judge type by legibility, the floor, and hierarchy contrast. Make hierarchy contrast deliberate; evenly-sized type reads timid.

**Device-accurate UI mockups are the exception**: match real OS sizes, never scale to the canvas. Mobile: screen heading 32–48px, section title 22–28px, body 16–17px (never below 16), caption 13–15px, touch targets ≥44pt. Desktop: hero 56–112px, section title 24–32px, body 14–16px, caption 12–13px.

### Text craft rules

- One headline or sentence = ONE text node. Put each visual line in its own `<p>` and use `<span>`/`<em>`/`<b>` for inline weight/size/color changes (`format="html"`) — never split a single headline across stacked text boxes just to force line breaks or mix weights. Separate nodes ONLY for genuinely independent lines: different roles (kicker vs headline vs subhead), independent position, or a line needing its own highlight box.
- Always specify `font-family`, width AND height. MATCH THE DOCUMENT: when the design already has text, new text uses a family the design already uses. Only introduce a new family when the user asks, the brand kit prescribes it, or you are designing from scratch.
- Kit fonts are pre-loaded and safe to use as named; substitute only a font the kit explicitly marks unavailable, preferring its listed alternative.
- **Overused fonts** — Avoid the fonts everyone defaults to; they instantly make a design feel generic. Do not use: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Raleway, Oswald, Nunito, Fraunces, or Playfair Display (add DM Sans, Bebas Neue and Space Grotesk for headline faces). Dig deeper into the Google Fonts catalog for distinctive choices. Two exemptions only: **a brand kit that names the family always wins** (kit fonts are the brand's own decision — never substitute one for taste), and a user who asks for a face by name gets it. This applies to every from-scratch format — deck, document, print piece, post, page — not just social headlines.
- All natural-language scripts are supported — use correct spelling, diacritics, and native script. Avoid DECORATIVE emoji unless asked; use `<image icon="…">` for visual elements instead. When the user does ask for an emoji, write the literal emoji characters into the text content — the canvas renders them as full-color glyphs.
- Flags are ALWAYS emoji text, never artwork. A country, region, or subdivision flag the user names or types goes in a text node as its flag emoji (🇬🇧 🇺🇸 🇯🇵 🏴󠁧󠁢󠁳󠁣󠁴󠁿); every ISO 3166 country/region flag renders, plus England, Scotland, and Wales. Never `moda media generate-image` a flag (a fresh generation cannot match the last one, and matching between outputs is the whole point of asking for the emoji), never `<image icon="…">` one, and never place one as a pattern fill. A flag is not a logo, emblem, or badge.

## Start with a concept, not a layout

Before writing any markup, decide what makes THIS brand or subject look like itself, and say it in a sentence or two. Pull from the name (often a literal metaphor — "Nexus" → a node network, "Apex" → angular peaks), the industry's native visual language (data → curves and dot grids, security → shields and locks, biotech → cellular forms), and the brand's personality. Then commit the cover/hero to that concept: an oversized type-driven composition, an asymmetric editorial split, a full-bleed image, a geometric motif, a custom pattern. It should be distinctive enough that someone could guess the brand from the layout alone. Every subsequent page inherits that system — same margins, type hierarchy, palette, motif language — so the artifact reads as one thing.

The single most common failure is defaulting to **a gradient background, a couple of decorative circles, and a centered or left-aligned title** — for the cover, for every brand, and then again on every page. If you find yourself reaching for it, stop and think harder.

**Styling from another canvas.** When the user points at an existing canvas as the style source ("like that deck"), don't style from memory: `moda canvas read` it for its fonts, its `variables[…]` VALUES, and its palette, and `moda canvas screenshot` a page or two to see the system with your own vision — then author the new work with those resolved hex values (carry a variable's value, never its name: a name means nothing on a different canvas).

## Imagery — a default quality lever, and crop discipline

There is no dedicated image node — an image is a pattern fill on a shape. Generated imagery is a DEFAULT quality lever, not a last resort: covers, heroes, section breaks, and full-bleed closers get generated imagery wherever it elevates the design, styled to the brand's palette and mood. An icon/vector-only system is a deliberate style choice, never a cost fallback. Where each image comes from:

1. **Brand kit assets** when the brand IS the subject (logos, product shots — `moda brand show`; refs, never re-hosted URLs).
2. **The user's own uploads and team assets** when they are the actual content — `moda file search QUERY` (`--kind photo` default; `--kind icon` for the shared icon packs); `moda file upload PATH` → `file_…` ref. When the result says the matches are low-confidence (`has_good_matches: false`), verify visually before placing — or generate instead.
3. **Stock photography** when real-world photography fits better than generation and the team has nothing — `moda file search QUERY --source stock`. Place the returned `stock_unsplash_…` id verbatim as an image src (the server imports the photo on use); the result's `url`/`thumb_url` are preview-only provider links — never write them into a canvas — and each result carries `attribution` (photographer + source) that must be credited wherever the photo appears.
4. **Functional UI icons** — markup `<image icon="query"/>` (deterministic; nav/status/bullets, not decoration or logos).
5. **Generate everything atmospheric or illustrative** — `moda media generate-image`. Styled/thematic icons, logos, heroes, illustrations. Model choice: references/omni-and-media.md.

Never use placeholder shapes or literal "[icon]" text. Ensure logo colors contrast with the background (check the kit for logo variants).

**Look before you crop.** Geometry tells you nothing about where a subject sits inside an image. Before adjusting any image's crop — or placing a new image whose subject isn't centered — view the source image with your own vision (the file you uploaded, or a `moda canvas screenshot` of it in place). To center a subject, set `crop` to the subject's own source coordinates as a normalized object — `{ x, y }` in 0..1 source-image space (crop syntax: references/markup.md and edit-code.md). Near an edge the requested focus can get clamped (cover fit must fill the frame), so confirm visually with a screenshot rather than trusting the value alone. When changing an image shape's width/height, also specify `fit` — pattern fills don't auto-refit on bounds changes.

## Animated shader fills — the premium-feel lever

`fill="shader(<type>)"` + `colors="#…"` works on page backgrounds, all fillable shapes, containers, and text (via markup; via edit for existing shapes and text, not containers). Shaders animate LIVE in-app and FREEZE to one frame in static exports — offer `moda export CANVAS_REF --format mp4|gif --page N` (mp4/gif need the page; one export per animated page) as the motion-preserving file at handoff. Lean on shaders for backgrounds, heroes, and large panels. Pick the type that fits the concept — do NOT default to `mesh-gradient`; vary across designs. Directory (premium-first):

- `prismatic-swirl-panels`: layered prismatic swirls through diagonal glass panels; first 3 colors swirl, next 3 blob.
- `dithered-wave-ribbon`: pixel-blocked wave ribbon; first 2 colors background, next up to 4 ribbon.
- `mesh-glass-rods`: mesh gradient through animated glass rods; exactly 4 colors.
- `soft-glass-panels`: color fields through refractive glass panels; exactly 2 colors (background, blob).
- `plasma-field`: twisted glowing plasma; 1 base color.
- `simplex-blob`: raymarched dithered blob; first 2 background, next up to 2 blob.
- `light-rays`: radiating volumetric rays; up to 3 bright ray colors.
- `analog-grain-gradient`: grainy banded analog gradient; first color is background/base.
- `ring-warp-glass` / `diagonal-panel-warp`: refractive rings/panels over a swirl; exactly 2 colors (dark base + highlight/accent).
- `band-dither-panels`: diagonal panel segments via two-color Bayer dither; exactly 2 colors.
- `mesh-gradient`: smooth colorful blob gradient; first color is background/base.
- `swirl-stripe-gradient` / `swirl-edge-bands-gradient` / `swirl-shape-gradient`: swirled gradients with stripes / edge bands / warped cells; up to 3 colors.
- `metaball-field`: raymarched metaballs over a noir background; background + metaball palettes.
- `soft-voronoi` / `clouds`: paper-cell / sky textures; ignore colors.
- `metal-plates`: brushed metal; up to 3 colors (dark, mid, light).
- `warped-grid` / `shape-grid-dots` / `shape-grid-tiles`: animated grid/dot/tile lattices; background + accent palette.
- `cmyk-halftone-press` / `gooey-halftone-cells` / `halftone-cell-wall`: halftone print treatments; 2–3 colors.
- `soft-pixel-field` / `segment-display-field`: pixel-grid / LED-matrix fields; exactly 2 colors.

Prefer 2–5 colors unless the type implies a different palette size. Shader motion is automatic.

<!-- moda:gen-paths -->
## Decorative paths — use the vetted library

**Contract — agents MUST pick from this library for decorative `<path>` shapes** (dividers, blobs, swashes, banners, marks). Deviate only for shapes even *simpler* than these — a straight-edged wedge, a single quadratic curve, a plain triangle. Icons, glyphs, logos, and illustrations are **NEVER** path jobs: use `<image icon="…">` or `moda file search --kind icon` for icons and glyphs, and `moda media generate-image` for richer marks. Free-hand path data reliably produces broken-looking clip-art, which is why this list exists.

**How the node scales the path.** The `d` string below is authored in a *natural coordinate box* (its
`WxH`). On the canvas the path node has its own `x`/`y` offset and `width`/`height`, and the renderer
**scales the path to fit that box** — so absolute size never matters, only the proportions. Give the
node the same aspect ratio as the entry's box (or expect stretch). No `transform`, no `clip-path`;
coordinates are absolute SVG commands and every point stays inside the declared box.

**FILL vs STROKE.** Each entry is tagged:

- **FILL** — a closed path (ends in `Z`, non-self-intersecting). Give the node a `fill` (and usually no
  stroke). With no fill specified the shape is invisible, so always set one.
- **STROKE** — an open path (a line, no `Z`). Set `fill="transparent"` plus `stroke` and `stroke-width`.
  With `fill="transparent"` and no `stroke` the node renders nothing at all (no fill, no stroke) —
  the shape is invisible, not black. A `stroke` with no `stroke-width` falls back to a 1px hairline,
  so set the weight and color explicitly for STROKE entries.

---

### FILL shapes (closed — set `fill`, no stroke)

- **wave-divider-single** (100x20, FILL): `d="M0,14 C30,0 70,0 100,14 L100,20 L0,20 Z"` — one smooth crest; the classic section divider between two color bands. Fill it the *next* section's color and butt it to the seam.
- **wave-divider-double** (100x22, FILL): `d="M0,12 C12,4 24,4 33,12 C42,20 58,20 67,12 C76,4 88,4 100,12 L100,22 L0,22 Z"` — two crests for a livelier, more editorial band break; pair with the single wave on the opposite seam.
- **arc-cap-divider** (100x16, FILL): `d="M0,16 L0,10 C30,0 70,0 100,10 L100,16 Z"` — a gentle convex cap with straight sides; softens the top of a footer or a full-bleed color block. Calmer than the waves.
- **scalloped-edge** (100x16, FILL): `d="M0,6 A10,10 0 0 0 20,6 A10,10 0 0 0 40,6 A10,10 0 0 0 60,6 A10,10 0 0 0 80,6 A10,10 0 0 0 100,6 L100,0 L0,0 Z"` — five semicircle scallops; playful, ticket/tag or kids/food-brand energy. Stretch wider for more scallops of the same size only by tiling multiple nodes.
- **diagonal-cut-divider** (100x20, FILL): `d="M0,20 L0,6 L100,0 L100,20 Z"` — a clean tilted cut; modern, architectural section break. Flip horizontally (mirror the node) for the opposite lean.
- **blob-soft** (100x100, FILL): `d="M50,6 C73,6 94,22 94,48 C94,71 78,94 51,94 C27,94 6,76 6,50 C6,25 27,6 50,6 Z"` — rounded, gently asymmetric organic shape; a friendly background accent behind a photo or stat. Use a soft brand tint at low contrast.
- **blob-elongated** (100x64, FILL): `d="M26,10 C56,2 90,8 96,30 C101,50 72,60 44,58 C22,56 2,50 4,32 C6,16 12,16 26,10 Z"` — a wider, lozenge-like organic form; good as a highlight pill behind a headline or as a horizontal backdrop.
- **blob-pebble** (100x100, FILL): `d="M22,12 C52,2 84,6 92,30 C99,52 90,84 60,92 C34,98 8,80 6,52 C4,32 10,20 22,12 Z"` — slightly angular, pebble-like character; a touch more grounded than blob-soft. Cluster two or three at varied scales/opacities.
- **plus-sparkle** (100x100, FILL): `d="M50,2 Q56,44 98,50 Q56,56 50,98 Q44,56 2,50 Q44,44 50,2 Z"` — a four-point sparkle/glint; scatter a few at different sizes for an AI/magic or celebratory accent. Keep it a solid accent color.
- **half-circle-sunrise** (100x50, FILL): `d="M0,50 A50,50 0 0 1 100,50 Z"` — a flat-bottomed semicircle; a rising-sun motif or a rounded cap sitting on a baseline. Warm gradient reads as a sunrise.
- **quarter-round-corner** (100x100, FILL): `d="M100,100 L0,100 A100,100 0 0 1 100,0 Z"` — a quarter disc filling one corner; a minimal corner accent. Mirror/rotate the node to target the other three corners.
- **speech-bubble** (100x90, FILL): `d="M12,0 L88,0 A12,12 0 0 1 100,12 L100,58 A12,12 0 0 1 88,70 L40,70 L28,90 L26,70 L12,70 A12,12 0 0 1 0,58 L0,12 A12,12 0 0 1 12,0 Z"` — rounded rectangle with a downward tail, one closed path; a quote or testimonial container. Put the text in a separate node on top.
- **ribbon-banner** (100x40, FILL): `d="M0,4 L100,4 L86,20 L100,36 L0,36 L14,20 Z"` — a forked-end ribbon body; a label/eyebrow strip behind short caps text. Fill an accent color, text centered on top.
- **arch-doorway** (60x100, FILL): `d="M0,100 L0,40 A30,30 0 0 1 60,40 L60,100 Z"` — a rounded-top arch; a doorway/window frame or a tall portrait mask backdrop. Tasteful behind a headshot or product shot.

### STROKE shapes (open — set `fill="transparent"`, `stroke`, `stroke-width`)

- **checkmark-tick** (100x80, STROKE): `d="M8,44 L40,74 L92,8"` — a confident checkmark; a feature-list bullet or a success mark. Use `stroke-linecap="round"`, `stroke-linejoin="round"`, and a bold weight.
- **underline-swash** (100x16, STROKE): `d="M2,13 C22,0 46,1 60,8 C72,14 87,16 98,3"` — a subtle S-curved underline; slip it under a key word for hand-drawn emphasis. Round caps, medium weight, an accent color.
- **circle-highlight-sketch** (100x64, STROKE): `d="M74,8 C94,16 98,42 72,54 C46,66 12,58 6,36 C2,20 22,6 54,6 C72,6 86,12 92,24"` — a hand-drawn ellipse that overshoots its start; circle a word or figure for annotation energy. Round caps, an accent color.
- **bold-chevron** (60x100, STROKE): `d="M10,8 L54,50 L10,92"` — a right-pointing chevron; a "next"/carousel cue or a list marker. Weight = boldness, so set a heavy `stroke-width` with round caps/joins. Mirror the node to point left.
<!-- /moda:gen-paths -->

## Planning discipline

Before asking a clarifying question, check the request and what's already settled. Never re-ask a resolved question or reconfirm a settled decision. The latest explicit user instruction wins when instructions conflict. If ambiguity is non-blocking, choose a reasonable default, proceed, and state the assumption briefly. Ask only when unresolved ambiguity materially changes the correct result, or before a genuinely destructive or irreversible action whose authorization is not already clear.

## Avoid AI slop tropes

Users dislike obvious AI copy and design tropes. Avoid these unless directly following a user request:

- **Em-dash overuse:** use commas, colons, periods, or parentheses instead.
- **Side or top accent border:** a thick colored border on one side of a card or page looks AI-generated. Remove it or use a subtler accent.
- **Pill overline:** a pill with a dot and an overline above a heading is an AI tell. Omit entirely unless it provides real semantic value.
