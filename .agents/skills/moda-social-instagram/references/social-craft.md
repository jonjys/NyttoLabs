# Social craft — concepts, backgrounds, references, resizing

The platform-neutral half of social work: how a concept is chosen, how
backgrounds get made, what an attached image means, how a finished piece moves
to another size, and how to show creative inside a platform frame. Per-platform
sizes and safe areas live in the platform recipe (moda-social-instagram,
-linkedin, -tiktok, -youtube, -ads); the carousel lock system, narrative arc
and per-slide push rules are below.

## Concept directions

- Each concept is a nameable aesthetic **direction**, not a rearrangement:
  different world, different headline face, different background treatment
  (solid / gradient / generated pattern / photo / shader — directory in
  references/design-quality.md). Across a set, at least one type-led and one
  image-led; never all-dark or all-light.
- **How many.** An explicit count in the request wins, even beyond four. With
  no count anywhere, plan 1–4 and **default to 3** — a social post or a logo is
  a taste-sensitive one-off, and three named directions is what makes one of
  them land. Note in one line which rule you followed. Each concept is a
  genuinely different playbook (product-as-hero, before/after, visual metaphor,
  typographic manifesto, category-code reversal, testimonial,
  problem-solution), not a variant of one.
- **Shader quota per set.** Shaders are an instant premium-feel hit, so across
  N concepts put a shader background on at least 2 (when N=3) or 2–3 (when
  N=4), a **different shader type on each**, and do NOT default to
  `mesh-gradient`. Directory: references/design-quality.md.
- Name the direction in the delivery note ("editorial slab-serif on paper
  stock"), so a revision request has something to aim at.
- **Match markup density to the concept.** Maximalist, brutalist and editorial
  directions invite layered shapes, offset slabs and decorative rules; minimal
  and luxury directions need restraint and precise spacing. A minimal concept
  rendered with clutter and a maximalist one that comes out thin are both
  failures.
- **AI-slop defaults to avoid**: centered headline + subhead + pill button on a
  flat fill; glass cards floating on a gradient; purple/blue gradients with no
  point of view; rounded corners and soft shadows everywhere; the same layout
  with colors swapped; every concept at the same brightness.
- Headline faces to avoid unless the brand kit names them: Inter, DM Sans,
  Roboto, Montserrat, Poppins, Oswald, Bebas Neue, Space Grotesk. Prefer
  long-tail Google Fonts that fit the brief, and keep body type calmer than the
  headline. The full ban and its kit carve-out: references/design-quality.md.
- **Brand kit adherence** (only when a kit is active; default Balanced) —
  **Strict** = brand colors/fonts/assets only. **Balanced** = brand defaults
  plus limited complementary accents. **Loose** = brand-inspired; new colors,
  fonts and imagery are fine if the brand stays recognizable. The mode sets how
  far concepts may vary — don't reuse the same headline font across concepts
  unless adherence is Strict — and it decides what a brand audit may flag.
- One stat per page: numeral oversized in the accent, unit set smaller with an
  inline `<span>` (needs `format="html"` on the `<text>` node), source in a
  small footer. Arrows are real elements (`<line … arrow-end="triangle"/>` or
  an icon), never a "→" glyph.

Unsure how many directions a request wants? `moda ask "how many concepts should
I make for a social post when the user didn't name a number?"`

## Plan the carousel

**Slide count** — 5–8 on Instagram, 6–10 on LinkedIn, unless the user names
one. Past those ranges completion collapses; the platform recipe carries the
caps and is the only source for dimensions.

**Orientation** — portrait or square, never landscape: landscape wastes mobile
feed height. Every slide shares the exact same width and height.

## Carousel depth — pushing each slide

**Lock the system**: 2–4 colors (a dominant ground, text, ONE sharp accent),
exactly two fonts, one grid and outer margin, one repeating device — a color
strip, an index-numeral system, a ticker, a rule grid — **used at full
strength, not as a faint corner decoration**.

**Narrative.** Slide 1 is the hook: 5–9 words, a specific or contrarian
promise, and NO branding — a logo on slide 1 reads as an ad. Slides 2..N-1
carry one idea each and end pointing forward. The last slide is one clear ask,
and that is where the brand finally appears. A repeated contact/email line on
every slide is the ad pattern.

**Consistency is not sameness.** Commit to one aesthetic world you could name
in a phrase, build the strict system, then vary the composition slide to slide
inside it — loud next to quiet, scale jumps, a full-bleed moment — so the swipe
has a heartbeat.

- **Vary and push.** Type carries the personality: one opinionated display face
  plus one calm support face, with deliberate **4–8× contrast** between them;
  labels and slide numbers get caps, heavy tracking, and the accent color.
  Overflow means cut copy, never type below the ladder floor.
- **Build atmosphere, not flat fills.** Default away from pure white grounds; a
  gradient field, a faint full-bleed texture, a glow on a dark ground, or a
  duotone photo grade all beat a flat panel. Full-bleed-faint, never
  corner-faint.
- **Add depth.** Overlap deliberately — a numeral crossing a photo, a block
  under a headline, an element bleeding off the canvas. Layering comes from
  absolute x/y and source order (later paints on top). A deck where every
  element sits in its own zone reads as a template.
- **Photography is a material.** Grade every photo to one treatment — a duotone
  or consistent monochrome grade is the fastest way to make mixed images read
  as one deck — with consistent crop logic and a scrim under any copy.

**Assign each slide a composition type** and never repeat one on adjacent
slides: full-bleed type, number-hero, split panel, quiet/breathing, pull-quote,
designed list (index numerals and accent rules, never literal bullets),
edge-bleed, photo-led, collage, film strip.

**Skip custom pagination dots** — IG and LinkedIn draw their own, though one
low-opacity "3/8" is fine. Both platforms also draw chrome OVER the slide, so
keep content out of it: Instagram covers the top ~60px (username), the bottom
~50px (dots) and the top-right ~50px (counter) — content stays inside roughly
960×1200 centered on a 1080×1350 slide — and LinkedIn overlaps the
bottom-center ~60px. The platform recipe carries the exact per-platform safe
areas.

Build slide 1 alone first and screenshot it — proving the look on one cheap
slide before the deck commits to it. Then one `moda canvas add-pages` call for
the full list, and one `moda canvas markup` per page **reusing the identical
`<styles>` block so the system can't drift**.

Unsure which composition types to spread across a deck? `moda ask "which
composition types should I assign across an 8-slide Instagram carousel?"`

### Before finishing — answer with facts rather than adjectives

Screenshot each slide, then the filmstrip. "Looks clean" is how a weak slide
passes, so answer with facts. Per slide, name:

- the largest and smallest type size, against the ladder floor;
- the headline font — a body sans on a headline is a miss;
- one element that overlaps or bleeds — if you can't name one there's no depth;
- the dominant element;
- the one bold move.

Across the filmstrip: adjacent slides differ in composition AND scale; one
dominant color plus one sharp accent rather than four spread evenly; one slide
that goes all out; brand held to the last slide.

Fix what's broken or timid — but don't sand off a bold choice because it looks
risky rendered. **Most AI design fails by being too safe, almost never by being
too bold.**

## Generated backgrounds

`<generate>` (grammar and limits in references/markup.md) makes dot grids,
rings, and hatching without reaching for imagery. Keep the pattern the backdrop:
confine it to a quadrant, strip, or radial source; contrast it against the
content (round dots behind hard-edged slabs) rather than echoing it. Instant
depth: two stacked rectangles, the back one offset 6–8px at low opacity.

Across a multi-slide piece, **a generated motif goes on EVERY slide for
continuity — vary its scale and placement, not the motif itself.** Contrast it
against the content instead of echoing it: round dots behind hard-edged panels,
soft line fields behind solid blocks. For a complex reference background
(gradients with effects, textures, light rays) that shapes can't rebuild,
generate a clean background image once and reuse it across the slides; a clean
photo with no overlays is content for a photo-led slide, not a background.

Photography rarely reads at small ad sizes — prefer solid color, gradients,
shapes, type, and `<generate>` patterns there, with a product silhouette over
scenic imagery. Copy over a photo always gets a scrim.

## Style references vs content images

An attached image is one of two things, and the answer changes what you do:

- A **style reference** — a designed piece the user likes. Rebuild its layout,
  type treatment, and palette on the canvas; do not place the image itself.
  Backgrounds too complex for shapes: `moda media generate-image` with the
  reference attached, producing a clean background that carries its palette and
  texture, then compose type and brand marks on top.
- A **content image** — a clean photo of the actual subject. Place it as
  subject matter (`<image src="file_…"/>` after `moda file upload`), crop it
  deliberately, and let the composition work around it.

Ask only when the intent is genuinely unreadable; the file usually says which
it is.

## Resizing to another platform

**Back the page up first.** Resizing is destructive and this surface has **no
undo** (the working-contract reference), so the recipe opens with a backup: in the same
`moda canvas edit` call, `duplicate([pageId], { newPageName: '… (backup)' })`
before the `update(pageId, { width, height })`. Once the resized composition is
verified by screenshot, remove the backup page with `moda canvas delete-items`.

**Resize in place** — never create a new canvas just to change size. Follow the
page-resize recipe in references/edit-code.md: group the page's top-level
nodes, `update(pageId, …)` to the new width/height, then uniform-scale that
group. It preserves the composition and balances leftover space as margins when
the aspect ratio changes.

Then **re-breathe the composition**: the focal point, the headline and the CTA
all need repositioning at the new shape. Never a squish.

Keeping BOTH sizes: `moda canvas add-pages CANVAS_REF --count 1 --size WxH`,
copy the elements across with `duplicate(ids, { destinationPageId })`, then
reposition and re-scale by hand. Either way: never let a composition squish, and
re-check type against the ladder floor at the new size — a headline that clears
the floor at 1080x1350 can fall under it at 300x250.

## Post-in-platform-frame pages

"Show me what it looks like on Instagram" wants the creative composed inside a
hand-built platform frame — not a real app UI (that is moda-mockup's work) and
not a screenshot.

1. Create the page at the frame's size (a phone-shaped 1080x1920 works for
   feed and story mocks alike), `--category other`.
2. Build the chrome as plain vector: a rounded rectangle for the device or
   card, a small circle avatar, two short text lines (handle, timestamp), a row
   of simple icons. Keep it grey-on-white and low-contrast — the chrome is a
   frame, not the design.
3. Place the real creative at its true aspect ratio inside the frame, so what
   the user judges is the artwork, not the mock.
4. Deliver BOTH: the raw creative at platform size (the file they post) and the
   framed page (the file they show). Say which is which.

If the user's instructions contradict any of the above, follow the user.
