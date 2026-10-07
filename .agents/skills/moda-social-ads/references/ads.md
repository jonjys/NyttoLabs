# Static ads — the IAB set, per-size composition, and stopping power

## The size table

| Size | Name | Category | Notes |
|---|---|---|---|
| 300×250 | medium rectangle | `web-ads` | the workhorse; design the MASTER here |
| 728×90 | leaderboard | `web-ads` | above the article — hostile, one line only |
| 160×600 | skyscraper | `web-ads` | sidebar tall |
| 300×600 | half page | `web-ads` | the roomy one |
| 320×50 | mobile banner | `web-ads` | type only |
| 320×100 | large mobile banner | `web-ads` | one line plus a small mark |
| 970×90 | large leaderboard | `web-ads` | premium placement |
| 970×250 | billboard | `web-ads` | the only size with room for imagery |
| 336×280 | large rectangle | `web-ads` | in-article |

A bare "banner ad" request means build BOTH 728×90 and 300×250 — that pair is
what a trafficker expects when no sizes are named.

Platform-native paid formats: IG story ad 1080×1920 (CTA chrome reserves from
y 1400), IG feed ad 1080×1080 or 1080×1350, Facebook feed ad 1200×628. The ad
noun beats the platform noun: "an Instagram ad" is this lane, not the organic
platform child, and it borrows that platform's safe areas.

**When nothing is named** — a bare "make me an ad", no placement, no size —
default to **9:16** (Stories/Reels/TikTok, 1080×1920) unless the user asks for
feed (1080×1080) or 4:5 (1080×1350). The IAB table above owns the ask only when
it says *display*, *banner*, or a pixel size.

## The idea, before any layout

Write it in one sentence: "For [audience], [brand] is the [category] that
[single claim]." Then the **Rule of One** — one audience, one promise, one ask.
Kill every secondary message before it reaches the canvas.

**Stopping power before clarity**: one element dramatically larger than
everything else, colour that violates the page it will sit on, a deliberate crop,
exactly one focal point. The squint test: blur the draft — if it still shows what
it is for and where the eye lands, it works.

Headline and visual are ONE idea. If the headline works pasted on a different
image, the lockup is weak. Never describe the image in the headline.

Run the brand's distinctive assets — logo, colours, device, tagline — at real
scale in every concept. Multiple concepts get different playbooks
(product-as-hero, before/after, visual metaphor, typographic manifesto,
category-code reversal, testimonial, problem-solution), not variants of one.

## Audit the category's codes

Every category has a house look the audience already recognises: soft-focus
closeups in beauty, screenshots-on-gradient in SaaS, white pack shots in DTC
food. Name that look before designing.

Each concept then either **leans in** for instant recognition or **reverses**
the codes for disruption; a mix across the set gives the user real range. When
the brand sits in a stale category and multiple variations were requested,
dedicate at least one to reversal.

Unsure whether a category's codes want leaning in or reversing? `moda ask
"should a DTC skincare ad lean into the category's soft-focus closeups or
reverse them?"`

## Type

Ad type is louder and more opinionated than corporate type — the headline face
must have a point of view, and neutral is a liability. A brand's own font is
sometimes exactly right and sometimes too generic to carry an ad; pairing it
with a display face is often the answer.

- **Go bigger than feels comfortable: if the type isn't intrusive it's too
  small.** Size against the ladder in references/design-quality.md, and keep ad
  copy readable at feed-thumbnail scale.
- Make at least one concept **type-led**, where the setting IS the creative
  move.
- Don't reuse the same headline font across concepts — unless brand-kit
  adherence is Strict (brand colours, fonts and assets only).
- **Never these unless the user asks:** Inter, DM Sans, Roboto, Montserrat,
  Poppins, Open Sans, Oswald, Bebas Neue, Lato, Source Sans Pro. Body copy at
  most.

The kit's own font reading too neutral to carry the headline? `moda ask "what
display face pairs with a neutral brand sans for a bold paid-ad headline?"`

## Generated patterns in an ad

A pattern must never compete with the hero: confine it to a quadrant, strip, or
**radial source** — rings radiating off a cropped mouth to dramatize sound — or
let it BE the ad itself in a type-led concept. Contrast it against the content
instead of echoing it (round dots behind hard-edged slabs), and never repeat its
motif in the foreground accents. `<generate>` grammar and limits:
references/markup.md.

## Per-size composition

The master is a design; the other sizes are **re-compositions of the same
message**, never a squashed copy.

- **300×250 (master)**: hook, brand, CTA stacked. Everything that follows is a
  reduction of this.
- **728×90 / 970×90**: horizontal lockup — headline left, CTA right, brand mark
  small. One line of copy. No supporting text survives here.
- **160×600 / 300×600**: vertical stack with the CTA at the bottom; the tall
  formats are where a product silhouette earns its place.
- **320×50 / 320×100**: type only. Four or five words plus a button-shaped CTA;
  4–6px of clearance and never touching an edge.
- **970×250**: the one size where photography or a generated field can carry the
  frame — everything else prefers solid colour, gradients, shapes, type and
  generated patterns, because imagery rarely resolves at ad sizes.

Universal: keep type and CTA 8–10px off every edge (networks add a border at
serve time). The CTA is always button-shaped and the highest-contrast element on
the piece — "See the demo", never "Learn more".

## Motion, when the ad animates

The authoring is moda-video's lane, but the creative call is made here: **motion
in the first 500ms IS stopping power** — animate the focal element first, then
the headline, supporting text, and CTA. Chains stay short: 2–4 elements. For a
display banner set, the three-frame loop structure and the network caps it has
to fit live in the display-banner loop recipe in the motion-recipes reference.

## Delivery

One canvas, one page per size, exported together: a multi-page png export arrives
as a **zip**, which is exactly what the trafficker wants. Applies to one canvas
stay serial — they serialize on the server anyway, so a parallel batch across many
pages buys nothing and can come back `canvas_busy`.

## Not this lane

Animated or HTML5 ads → moda-video (the motion is authored on an animation
canvas and exported as gif/mp4). Organic posts and channel art → the moda-social
platform children. Markup grammar: `references/markup.md`; export mechanics:
`references/export.md`.
