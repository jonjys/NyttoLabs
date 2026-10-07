# Landing pages — the craft, on a canvas or on a live site

A landing page is built two ways on Moda, and this file governs both:

- A **picture** of a landing page — a comp on a canvas, exported png or pdf.
  moda-mockup owns it; viewport, fidelity, and shell structure live in
  references/mockup.md.
- A **real hosted page** at a `*.moda.page` URL. moda-website owns it; the
  authoring rules, library and embed allowlists, and the publish loop live in
  the website reference.

Everything below applies to both unless a rule names one.

## One page, always

A landing page is a single tall scrollable page — **1440 × ~4000–6000** by
default, or whatever dimensions the user names. Every section stacks
vertically on that one page. Never create separate pages for features,
pricing, about, or team unless the user explicitly asks.

- **On a canvas**: ONE page at 1440 × 4000–6000. `moda canvas add-pages` adds
  a second *screen* (a different view of the product), never a section of this
  page. A features section on its own page is a broken landing-page comp.
- **On a site**: ONE route, `/`. `moda site add-page` is for real routes the
  nav points at, never for a section of the homepage.

## The bar

Modern landing pages are editorial and opinionated — closer to a magazine
spread than to "hero with stock photo + three feature columns + pricing grid".
Your default instinct will be to play it safe; resist it. Creative here means
distinctive (tellable apart from every other SaaS page), intentional (every
choice serves the brand), confident (big type, bold color, decisive
whitespace), and surprising in at least one section.

Patterns so overused they're invisible:

- Centered "The #1 Platform for [X]" + subtitle + two buttons + right-side
  mockup.
- Three-column feature grid with circular icons.
- Blue-white-gray with safe rounded corners.
- Identical width, rhythm and padding on every section.
- Testimonial carousel with circular headshots.
- Grayscale "Trusted by" bar.
- Good/Better/Best pricing table.

They work, and they say nothing about the brand — so use them only if the user
asks for a conventional layout.

## Levers

- **Type as the hero.** 120–200px+ headlines on a 1440 canvas. Mixed weights
  inside one headline, stacked single-word lines for rhythm ("Stop. /
  Guessing. / Start knowing."), display or serif headlines against clean sans
  body, uppercase with wide tracking for labels.
- **Break the grid.** Asymmetric hero with the visual bleeding off the right
  edge; elements overlapping a section boundary; bento grids with mixed cell
  sizes instead of feature lists; full-bleed color or image bands with text
  pulled into a narrower column; alternating dense and spacious sections;
  offset columns.
- **Color with a point of view.** Not "SaaS blue on white". Dark immersive
  pages with vibrant accents; high-contrast duotone; warm cream/terracotta/
  sage; radial or mesh gradients and gradient text fills; monochrome with one
  saturated pop. With a brand kit, build the **whole page mood** from the
  palette — backgrounds, text tints, decorative elements, shadows — not just
  the button color.
- **Purposeful visuals.** `moda media generate-image` for styled product UI
  shots (framed in browser chrome or floating panels, tilted or overlapped),
  custom illustration over stock, abstract gradient orbs and geometric
  texture, subtle noise or dot-grid backgrounds. Render key metrics ("10x
  faster", "99.9% uptime") as oversized typography that *is* the section, not
  small text in a card.

Unsure how far to push the palette? `moda ask "what color direction suits a
landing page for <this product> that isn't SaaS blue on white?"`.

## Section mix

Five to eight sections: hero → social proof → the core value proposition →
2–3 feature deep-dives → results/metrics → closing CTA. Adapt to the product,
but **never use the same layout twice on one page.**

Pick one hero:

- **Type-forward** — massive headline, no image.
- **Split** — text left, visual bleeding off-canvas right.
- **Editorial** — full-bleed image with overlaid text.
- **Motion** — dark ground, centered headline, animated gradient behind.

Unsure which hero archetype fits? `moda ask "which landing-page hero
archetype fits <this product and brand> — type-forward, split, editorial, or
motion?"`.

The motion hero is built differently per surface. On a **site**, the animated
gradient is CSS, or GSAP/Lenis from the self-hosted library list in
the website reference — never a third-party CDN, which is silently blocked. On
a **canvas**, it is a shader fill (`fill="shader(<type>)"`, directory in
references/design-quality.md), which animates live in the app and freezes to
one frame in static exports — so offer `moda export CANVAS_REF --format
mp4|gif --page N` (mp4/gif need the page; one export per animated page) as the
motion-preserving file at handoff, and say plainly that the png does not move.

Then vary the rest — logo bar tinted to the palette with a line that isn't
"Trusted by"; one testimonial as a typographic moment with a large photo; a
metric wall of 80–140px numbers; bento or alternating panels or full-width
stacked cards for features; a full-bleed dark CTA or a split CTA with the
pitch beside the input.

## Always / never

- Write **real, specific copy** from the user's context — never "Lorem
  ipsum", "Your headline here", or "The best solution for your needs".
- Name nodes for what they are ("Hero Headline", "Feature Bento Grid"), not
  "Text 1". (Canvas only — a hosted page carries the same discipline as
  meaningful section ids and class names.)
- Fill visual slots with `moda media generate-image` rather than leaving
  placeholder boxes. On a site the result must be a Moda-hosted ref: published
  sites block external image origins.
- Vary background color and heading scale between sections; keep body text
  under ~700px wide for readability (headlines are exempt).
- Every page ends with a clear CTA, and no page is a wall of text — landing
  pages are visual-first.
- On a site, a conversion path is part of the page, not an extra: wire the
  closing CTA to a real form, booking link, or contact deeplink from the
  allowlisted recipes in the website reference. A CTA button that goes
  nowhere is the landing-page version of lorem ipsum.
