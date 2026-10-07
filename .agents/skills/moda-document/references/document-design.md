# Document design — PDFs, one-pagers, reports

Scope decides the deliverable, so settle it first. Both bullets are the
**digital document** rule — a physical print piece is moda-document-print's
lane, covered two paragraphs down.

- **One page** (one-pager, brief, handout, fact sheet, infographic) → build **2 distinct concepts** as alternate directions: different layout structure, visual density, type hierarchy, and accent treatment. Plan each in a paragraph before building, then build both as sibling pages on one canvas so the user can compare them side by side.
- **Multi-page** (report, guide, proposal, or any request naming several pages) → build **1 cohesive document**, not alternates. Plan one visual system — grid, margins, type, palette, headers/footers — plus a page-by-page outline, then vary page layouts only as the content needs.

**Two concepts, one deliverable.** A "one-pager PDF" is one page. The live link
carries both directions so the user can compare, but never export the combined
canvas and hand it back as the one-pager — ask which direction wins, or export
them separately with `moda export CANVAS_REF --format pdf --page N` (lands at
`<canvas>.pN.pdf`, so the two never clobber).

Two, not three: the social and logo lanes default to 3 (the social-craft
reference) because a feed post or a mark is a pure taste pick with nothing else
to judge it by. A one-pager is content-led, so two well-separated directions
give the user a real choice without paying for a third. Multi-page gets one —
alternates there are cost without a choice.

**Physical print pieces are moda-document-print's recipe**, not this split:
business card, resume, certificate, invitation, menu, merch, and a poster or
flyer going to press. Build the one piece, where a second page means the
reverse side — never a second concept.

Default page size is US Letter: `moda canvas create --name … --size 816x1056` (A4: 794×1123). Typography is the document ladder — body ≈ 11px at US-Letter size, floor 11px (compute per references/design-quality.md).

## Making it good

- **Pack the page** — when the content is yours to compose. A PDF is read up close, not across a room, so it should be information-dense, and text-only is boring. Icons, dividers, stat rows, and cards break up prose and carry structure.
- **Restyling an attached document is the exception.** When the content came from a file the user asked you to beautify, that document IS the deliverable: keep its prose in whole paragraphs, keep its headings, lists and tables as headings, lists and tables, and keep their order. Do not split sentences across separate elements to build a denser grid, and do not add decorative shapes to fill space. Reach for the document's own images before you generate or draw anything. Density here comes from typography and spacing, not from cutting the text up.
- **Keep backgrounds print-friendly.** Simple fills and rules; do NOT generate images for PDF backgrounds.
- **Never encode a comparison in semantic red/green** ("problem vs solution", "before vs after"). Differentiate with layout, weight, or tonal variations of the brand palette.

## Balance the vertical composition

Content top-packed with a large empty band under it reads as unfinished — but forcing oversized type or stretched spacing to fill every pixel reads worse. When the content is shorter than the page, distribute the slack as deliberate spacing between sections, and/or anchor a natural closing element (signature block, sign-off, date line, footer) near the bottom margin so the whitespace sits inside the body.

Mechanically: a page-spanning top-level `<column justify="space-between">`, or an empty `<row height="fill" />` as a flexible spacer above a trailing block. Note that a tall fixed `height` does NOT push children down — they top-pack, so a `height="340"` column whose children total 234px just leaves 106px empty below it.

If the user's instructions contradict any of the above, follow the user.
