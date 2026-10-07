# LinkedIn — document posts, feed images, and profile art

## The size family

| Format | Size | Category | When |
|---|---|---|---|
| Link / landscape image | 1200×627 | `social` | the feed default for link-style posts |
| Portrait post image | 1080×1350 | `social` | type-led posts that want feed height |
| Square post image | 1080×1080 | `social` | quote cards, stat cards |
| Document-carousel page | 1080×1350 | `carousel` | 6–10 pages; 1080×1080 also renders well |
| Profile banner | 1584×396 | `social` | personal profile |
| Company page cover | 1128×191 | `social` | very short strip |

## The document post — the format that defines this platform

A LinkedIn carousel is not an image carousel: it is a **document upload**, and
the deliverable is **ONE multi-page PDF**. Exporting a zip of pngs is the single
most common failure on this lane — png/jpeg multi-page exports arrive as a zip,
so carousels export `--format pdf`.

Consequences for the design:

- LinkedIn renders document pages SMALL in the feed and the reader swipes with a
  thumb. Headline-first pages, one idea each, body type no smaller than ~34px at
  1080 wide, and no two-column layouts.
- Page 1 is a cover: the promise in 5–9 words, no logo. The last page carries the
  one ask.
- Bottom-centre ~60px of each page is overlapped by LinkedIn's page counter —
  keep it clear.
- 6–10 pages is the working range. Past 12, completion collapses.
- The exported PDF carries real clickable links, but LinkedIn renders document
  pages as flat images in the feed, so nothing on a page is tappable there. Put
  the URL in the caption, never as a clickable page element.

## Feed images

- Link-style posts crop to 1.91:1 — 1200×627 is exactly that shape, so nothing
  is lost. Anything taller is the user's deliberate choice for feed height.
- Copy on a feed image is read in a scroll: one headline, at most one supporting
  line, and the brand mark small.

## Profile banner (1584×396)

The profile photo covers the **bottom-left** corner — roughly a 250px square
starting at the left edge. Keep that region quiet: place the lockup and copy in
the right two-thirds, vertically centred. A name and role plus at most one short
line is the whole budget; anything more is unreadable on mobile, where the
banner is cropped further from both sides.

Person-first when a name is given: the name is the hero lockup and the company
supports it. Company-led only on request — logo plus one value proposition, no
headshots. At least one concept should work with no logo at all.

### Treatments

- **Individual banners** (creator, consultant, realtor, lawyer, founder,
  executive): if they have a personal mark — a signature, a stylized name, a
  logo — feature it. The name stays the hero and a role sits under it,
  secondary; prefer a low-copy identity system over marketing copy. If they are
  selling a course or a service, include a simple CTA like "Book time with me"
  or "Subscribe".
- **Company-led** (only when the user explicitly asks for it): the logo
  prominent but not overpowering, plus a tagline or a single value prop.
  Optional elements, used sparingly and never allowed to dominate — logos of
  3–5 marquee customers or partners, with transparency or an overlay so they
  don't fight the brand; logos of awards (G2, Gartner) or certifications
  (SOC2, HIPAA); 3 value props with checkmarks next to them.
- **No headshot or portrait supplied?** Do not default to a generic company
  banner. Use one or more of: strong typographic name treatment,
  signature-style name, monogram or personal mark, professional background
  imagery, abstract brand-aligned motif system.

### Backgrounds and motifs

Workspace, desk, laptop, studio and soft professional lifestyle photography
works as **atmosphere, not a busy collage**; abstract tech imagery suits modern
and product leaders. Decorative motifs earn their place as geometric shapes
sprinkled around the edges, soft grids, lines or abstract network patterns, and
mesh or full-bleed gradient fields. All of it stays subordinate to the
name/title lockup.

### Quality bar

At least 1 concept should feel distinctly personal/professional rather than
corporate-marketing. **If the design could work unchanged for any employee at
the company, it is too generic.**

Unsure what carries the banner with no photo to work from? `moda ask "what
should a LinkedIn banner use as its hero when no headshot or personal mark was
provided?"`

## Company page cover (1128×191)

A strip, not a canvas: a horizontal lockup, one line of positioning, and a colour
field. Assume the middle 60% is what most viewers actually see.

## Where the rest lives

Markup grammar: `references/markup.md`. Export mechanics — the PDF-not-zip rule,
warnings, pixel ratio: `references/export.md`. Carousel theory (one design system
across N pages, prove page 1 first) lives in the moda-social parent. An animated
LinkedIn post is moda-video.
