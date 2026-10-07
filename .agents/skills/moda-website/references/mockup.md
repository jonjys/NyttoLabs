# UI mockups and wireframes — screens as pictures

A mockup is a **static picture of an interface**: no routes, no state, no
hosting. A page that must actually be visited is a website, not a mockup.

The viewport decides everything downstream — grid, type sizes, how much
content fits — so pick it before composing.

| Screen | Canvas | Pattern |
| --- | --- | --- |
| Desktop app | 1440×900 | sidebar nav, multi-column content |
| Dashboard / analytics | 1920×1080 | dense grid, KPI row above charts |
| Marketing / landing page mock | 1440×4000–6000 | ONE tall scroll — craft in references/landing-page.md |
| Tablet landscape / portrait | 1024×768 / 768×1024 | split view / single column |
| Phone (iOS / Android) | 390×844 / 412×915 | single column, bottom nav |

Multi-screen flows: one page per screen in ONE canvas, added with
`moda canvas add-pages`, same viewport across all of them, named for the step
("Sign-up — email", "Sign-up — verify"). Screenshot them in batches of three.

## Fidelity — decide it, don't drift into it

- **Wireframe** (asked for by name, or "rough"/"structure only"): grayscale
  boxes, real hierarchy, honest labels, no color story, no imagery. It is a
  layout argument, and it should look deliberately unfinished.
- **Mockup** (the default when the user says "design a screen"): brand
  palette and fonts, real type ladder, real imagery, realistic content. A
  mockup with a point of view beats a gray wireframe every time.

Never split the difference: half-styled screens read as a broken mockup
rather than an honest wireframe.

## Type and touch

- **UI type uses real OS point sizes**, not display-scaled canvas type: body
  small but legible (14–16 on desktop, 15–17 on phone), headings stepping up
  by viewport, labels and captions stepping down. Cut copy before shrinking
  below the ladder floor (references/design-quality.md).
- **Phone safe bands**: ~47pt status bar at the top, ~34pt home indicator or
  ~16dp gesture area at the bottom. Nothing tappable or readable inside them.
- **Touch targets ≥44pt**, and no hover-only affordances on a touch viewport
  — a tooltip that only exists on hover is a mockup lie.
- **Desktop density**: 8px spacing rhythm, 12/16/24px paddings, and a
  consistent card corner radius across the whole screen.

## Structure the shell with containers

Nest `<row>` and `<column>` for the chrome — app shell, sidebar, header, card
grids, table rows — and reserve absolute `x`/`y` for decorative accents and
full-bleed blocks. A sidebar built from absolute coordinates breaks the
moment a nav item's label changes; one built from a column does not.

Typical desktop shell:

```xml
<content font-family="Inter">
  <row width="1440" height="900">
    <column width="240" height="fill" fill="#0f172a" padding="24" gap="8">
      <text text="Acme" font-size="18" font-weight="700" color="#ffffff" />
      <text text="Dashboard" font-size="14" color="#94a3b8" />
    </column>
    <column width="fill" height="fill" fill="#f8fafc" padding="32" gap="24">
      <row gap="16" height="96"><!-- KPI cards --></row>
      <row gap="16" height="fill"><!-- charts and tables --></row>
    </column>
  </row>
</content>
```

## Content that reads as real

- **Real copy, never lorem ipsum.** Product names, plausible metrics, dates
  that make sense together. Fake-but-coherent beats placeholder every time,
  and a reviewer judges a screen on whether the content hangs together.
- **Numbers in a dashboard mock are still data**: if the user gave real
  figures, they survive verbatim; if they did not, keep the invented set
  internally consistent (the KPI row must agree with the chart under it).
- **Charts inside a mockup are authored here**, in place, with `<chart>` —
  set `font-size` explicitly (the default is 12px at any canvas size) so the
  axis labels read at screen scale. Grammar in references/charts.md.
- **Icons** come from `<image icon="query"/>` or from
  `moda file search --kind icon` (the shared packs ARE the stock icon
  library). Product photography and avatars come from uploads or
  `moda media generate-image`.
- **Show the interesting state.** An empty state, an error, a loading
  skeleton, or a table with one row selected says more about the design than
  a third happy-path screen.

## Push past the default

Three equal cards in a row is where a screen goes to die. Reach for a bento
grid (a 2fr feature beside stacked 1fr cards), a full-bleed color block
carrying nav and hero together, oversized low-opacity step numerals, colored
overline labels, a data table with a sticky summary row. Whatever the first
screen establishes — spacing rhythm, radius, accent, shadow depth — every
later screen in the flow inherits.

A landing-page mock is not just a tall screen, and none of its craft is
restated here: the one-page rule, the named dead patterns to refuse, the
type/grid/color levers, the 5–8-section arc, and the four hero archetypes all
live in references/landing-page.md. Load it whenever the screen being comped
is a landing page, homepage, or marketing hero, and treat this file as the
viewport, shell, and fidelity half only.

## Verify and deliver

Screenshot and LOOK at it as a user would: is the primary action obvious, is
anything clipped, do the columns line up, does the type ladder survive at
this viewport? Then deliver png (`--pixel-ratio 2`) for chat and docs, pdf
when it is going into a document, and the canvas link — mockups get revised
more than they get shipped.

If the mockup is being used to decide whether to BUILD the page, say so
plainly: Moda can host the real thing (moda-website), and the mockup is the
cheaper step before it — not a substitute for it.
