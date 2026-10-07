# Print pieces — sizes, bleed, density, and the trifold imposition

Canvas pixels stand in for physical size on this surface: author at the pixel
size below, export a vector PDF, and the piece prints crisp at any scale.

## Size table

| Piece | Canvas size | Physical intent |
|---|---|---|
| Flyer / one-sheet | 816×1056 | US Letter (A4: 794×1123) |
| Half-sheet flyer | 528×816 | 5.5×8.5in handbill |
| Poster (small) | 1350×1800 | 18×24in |
| Poster (large) | 1800×2700 | 24×36in |
| Trifold brochure | 1056×816, 2 pages | Letter landscape, 3 panels per side |
| Menu | 816×1056 (often 2 pages) | Letter |
| Resume | 816×1056 | Letter (A4 outside the US) |
| Certificate | 1056×816 | Letter landscape |
| Invitation | 525×750 | 5×7in |
| Letterhead | 816×1056 | US Letter (A4: 794×1123) |
| Postcard | 528×384 | 5.5×4in |
| Business card | 375×225, 2 pages | 3.5×2in + bleed, front and back |
| Sticker | 300×300 | 3in square; keep art off the die edge |
| T-shirt front | 1200×1600 | ~12×16in print area, flat art |
| Mug wrap | 2250×1050 | wraparound; the seam is at the far left/right |

Merch is flat art, not a mockup: deliver the artwork at the print area's ratio
and say what the print area is. A picture of the product on a person is a
different ask.

## Bleed, trim, and safety

- Backgrounds, colour fields and textures run to the canvas edge — that is the
  bleed.
- Keep every meaningful element (text, logos, faces, rules) at least ~3mm inside
  the trimmed edge: roughly 12px at Letter scale, 20px on a poster, 8px on a
  business card.
- Never place a hairline rule exactly on a trim edge; a 1mm cut drift makes it
  look like a mistake rather than a design.
- Business cards are two pages, front and back, in that order. Say which is which
  at hand-over.

## Density — the print rule that differs from screen

A print piece is read UP CLOSE and held still. Pack the page: icons, dividers,
stat rows, cards, captions and footers all carry structure. A layout that looks
generous on a screen looks empty in the hand. Body type sits around 11px at
Letter scale with an 11px floor — smaller than any screen piece, and correct,
because the reader's eye is 40cm away and the output is 300dpi.

## What changes versus screen

- **Color drifts on press.** Prefer solid, well-separated palettes over subtle
  gradients, which band or shift. Skip glows and other RGB-only effects. For
  large dark fields use `#0B0B0B`, not `#000000` — pure black lays down too much
  ink and smears.
- **Print is static.** No animated shader fills.
- **Raster art doesn't scale up.** Target the print pixel dimensions when
  generating or sourcing imagery, and remember the user may export at 150 or
  300 dpi. Vector shapes and large display type are immune, so lean on them when
  fidelity matters.
- **Type can go smaller**, which is why the density floor above sits under any
  screen piece's. Very small contact type still risks legibility on press, so
  don't undercut it.

Unsure whether a palette survives the press? `moda ask "will this brand kit's
gradient print cleanly on uncoated stock, or should I flatten it to solids?"`.

## Per format

- **Business cards** are two-sided: the front carries identity — name loudest,
  role a tier down, wordmark large at top or small at bottom — and the back
  carries contact details or one distinctive asset. A card gets about two
  sentences of attention; spend it on the one thing the recipient should
  remember. Safe area is non-negotiable here: cards are cut on a stack with
  loose tolerances.
- **Flyers** want a single-message hero and one CTA (date, place, URL) — treat
  them like an ad. They are a natural fit for a full-bleed photographic
  background generated at print resolution, with a scrim under the copy.
- **Postcards** are flyers with a back: hook on the front, explanation and
  address block behind. Keep the right side of the back clear if it will be
  mailed.
- **Letterheads** are the opposite of stopping power. A small mark at the top, a
  generous empty body area for correspondence. Don't fill the page.
- **Trifold brochures** are their own problem — the panel map below is the
  content plan, not just an export detail.

Unsure what a second side should carry? `moda ask "should this business card's
back carry contact details or one distinctive asset?"`.

## The trifold imposition (panel order is NOT reading order)

Two landscape Letter pages, three equal panels each (352px wide at 1056×816).

```
Page 1 (OUTSIDE):  | panel 5 | panel 6 | panel 1 |
Page 2 (INSIDE):   | panel 2 | panel 3 | panel 4 |
```

Reading order for a standard right-hand roll fold:

1. **Panel 1** — front cover (right third of page 1).
2. **Panels 2-3-4** — the inside spread, read left to right as one field.
3. **Panel 5** — the inner flap that folds in first (left third of page 1).
4. **Panel 6** — the back panel: contact, logo, the one ask.

A flat six-page document folds WRONG. Author to the map above, and keep a ~6px
quiet gutter either side of each fold line so no headline lands on a crease. The
first-folded panel (5) is 2–3mm narrower on a real press — do not put a rule
flush to its edge.

## Export

`--format pdf` with no `--flatten`: the default is a vector PDF with selectable
text and embedded fonts, which is what a printer wants. `--flatten` degrades to
raster and is for screens only, on request.

Print-production facts to state plainly, never promise around: the canvas is
pixel-only — no physical units, no DPI setting; pixels map to PDF points at
96 px per inch (816 px = 8.5in). The exported PDF is RGB with no CMYK
conversion, no ICC/PDF-X profile, and no DPI metadata — a print shop's
preflight does that conversion, so say so when press-ready CMYK is demanded.
And a printer's dieline file cannot be imported as a locked vector guide
layer — rebuild trim/fold geometry as your own shapes and delete them before
the final export.

Read `warnings[]` and relay `font_substituted` (a face did not embed; the
printed piece will not match the screen — fix the font or disclose it).

## Boundary

A poster or flyer FOR a platform (an Instagram poster, a story flyer) is not a
print piece: it goes to the matching moda-social child, which owns that
platform's size and safe areas. Multi-page reports, whitepapers and one-pagers
stay with moda-document. Slides are moda-deck.

Scope, density and page balance: `references/document-design.md`. Export
mechanics: `references/export.md`.
