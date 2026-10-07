# Instagram — sizes, safe areas, and IG-specific craft

The sizes and the three safe-area rules live in the skill body; this file is the
depth behind them.

## The size family, in full

| Format | Size | Category | When |
|---|---|---|---|
| Feed portrait | 1080×1350 | `social` | the default — 4:5 takes the most feed height IG allows |
| Feed square | 1080×1080 | `social` | quote cards, logo-led one-offs, grid-first accounts |
| Feed landscape | 1080×566 | `social` | almost never — it wastes mobile height |
| Story / Reel cover | 1080×1920 | `social` | 9:16 |
| Carousel | 1080×1350 × N | `carousel` | up to 10 pages; ALL pages share one ratio |

A carousel cannot mix ratios: IG crops every page to the first page's shape.
Settle 4:5 or 1:1 before authoring page 1.

## Safe areas in detail

Design full-bleed — backgrounds, textures and colour fields run edge to edge.
Only text, logos, CTAs and focal points respect the zones.

- **Feed / carousel (1080×1350)**: platform chrome overlays roughly 60px at the
  top, 50px at the bottom and 50px at the top-right (the carousel counter).
  Keep essentials in a centred ~960×1200.
- **Story / Reel (1080×1920)**: the username and menu sit above y 250; the reply
  bar, share row and (on Reels) the caption stack sit below y 1670. Essentials
  live in y 250–1670. Interaction stickers (poll, question, link) are placed by
  the user at post time — leave one clear horizontal band, usually y 900–1300,
  if the brief mentions one.
- **Grid crop**: the profile grid renders the CENTRE 1:1 of a 4:5 post. A face,
  a product, or the headline's first line must sit inside that middle square or
  the post reads as a blank tile in the grid.
- **Reel cover**: the cover is ALSO cropped to a 1:1 grid tile and to a 420×654
  in-feed preview. Keep the title inside the centre square and away from the
  bottom sixth.

## Typography at 1080 wide

Computed from the feed context, not invented: body ≈ 45px, floor 28px. Headline
sizes follow the piece — 90–140px for a hook slide, 60–80px for a statement post.
The floor is hard: below 28px, IG's own compression eats the strokes. Cut copy
before shrinking type; a feed image is read at arm's length on a phone.

## Grid strategy (when the ask is a series)

- Three-post arcs read as one unit in the grid: setup, proof, ask. Vary
  brightness across the arc so the profile does not turn into one flat block.
- Keep one repeating motif across a series — a rule, a corner mark, a colour
  band — and vary everything else. Repetition in the motif, variety in layout.
- Never plan a nine-tile mosaic unless the user asks: it breaks the moment a
  single post lands out of order.

## Carousel specifics

Carousel theory (one design system, hook slide, prove slide 1 first) lives in
the moda-social parent. IG-specific on top of it:

- 5–8 slides is the working range; 10 is the hard cap.
- Slide 1 carries no logo — branding on the hook reads as an ad and kills swipes.
- Seam continuity is optional and expensive: only run art across the seam when
  every page ships together, because IG shows one page at a time.
- The zip of per-page pngs IS the deliverable; there is no single-file carousel
  format on IG.

## Caption handoff

Moda designs; it does not post. When the ask implies a caption, deliver it as
paste-ready plain text next to the file — first line under 125 characters (the
truncation point), the ask on its own line, hashtags last and few.

## Where the rest lives

Markup grammar: `references/markup.md`. Type ladder, imagery, shader directory
and the AI-slop list: `references/design-quality.md`. Motion — an animated post,
a Reel, anything delivered as mp4 or gif — is not this skill: load moda-video.
