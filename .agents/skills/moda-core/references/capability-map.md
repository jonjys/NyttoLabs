# Everything Moda can do

One table set, whole surface. **FREE** = deterministic and unlimited. **METERED** = charges
credits; `moda media models` publishes each model's price and billing basis, every result carries
a usage receipt, and `moda account status` shows the balance.

Ids are prefixed (`cvs_`, `bk_`, `file_`, `fld_`, `task_`); anywhere a canvas is named you may pass
its id, a raw UUID, or a pasted moda.app canvas or share URL.

## Canvas authoring — FREE, the substrate under decks, documents, social, diagrams

| Do | Verb |
|---|---|
| Create pages, sized by category or from a team template, with a brand kit bound | `moda canvas create` |
| Add content in Moda markup — append, or an atomic whole-page replace | `moda canvas markup` |
| Add more pages to an existing canvas | `moda canvas add-pages` |
| Edit precisely: sandboxed JS over the short node ids, all-or-nothing | `moda canvas edit` |
| Read state: lossless snapshot, whole-canvas, page-scoped, or a summary index | `moda canvas read` |
| See it: page images, three per call, with degradation warnings | `moda canvas screenshot` |
| Delete nodes, pages, or the canvas (soft delete) | `moda canvas delete-items`, `moda canvas delete` |
| Reuse pages from another canvas, including cross-team via a share token | `moda canvas import-pages` |
| Copy a whole canvas as-is, then edit the copy | `moda canvas duplicate` |
| Rename, re-describe, re-brand, or flag as a team template | `moda canvas rename`, `moda canvas brand`, `moda canvas template` |
| Read a canvas's owner guidance before editing someone else's work | `moda canvas instructions` |
| Share: a public link, view-only or view-and-remix | `moda canvas share` |
| Find work again: newest first, or by name | `moda canvas list`, `moda canvas search` |

Resize in place is a recipe, not a verb: group the page's content, set the new page size, scale the
group. Never recreate a canvas to resize it.

Markup speaks 24 elements: shapes, paths, lines, anchored connectors, rich text (markdown or HTML,
with hyperlinks), image fills (`src`, or `icon="query"` for a searched UI icon), video fills, groups
and clip masks, flex rows/columns/layers, HTML tables, charts (bar, line, area, scatter, combo, pie
from pipe-delimited rows), QR codes, LaTeX, maps, backgrounds (solid, gradient, procedural shader,
image), comments, `repeat`, and JS `generate` blocks. Fills take gradients and shader fills;
effects are shadow, layer blur, and backdrop blur/glass.

**Scripts and languages.** Text is vector-shaped: full Unicode, including CJK, and complex scripts
(Arabic, Hebrew, Indic, Thai) shape and reorder correctly inside a paragraph. Paragraph base
direction is left-to-right today, so for an RTL block set `text-align="right"` yourself and confirm
with a screenshot. Missing glyphs fall back to a Noto family, and an export warns
`font_substituted` when a requested font could not be used.

## Formats it produces

| Artifact | What lands | Skill |
|---|---|---|
| Slide decks | native editable PPTX (real shapes and text layers) or text-layer PDF; PowerPoint files import to an editable canvas | moda-deck, moda-deck-pptx |
| Documents and reports | one page or fifty; real PDF with selectable text (unflattened keeps links live) | moda-document |
| Print pieces | poster, flyer, brochure, menu, resume, certificate, invitation, business card | moda-document-print |
| Social creative | platform-sized posts, stories, carousels (multi-page images arrive as one zip; a LinkedIn carousel is ONE PDF), channel art, ad and banner sets | moda-social and its children |
| Diagrams | flowcharts, org charts, architecture, swimlanes, 2x2s — connectors stay anchored when nodes move | moda-diagram |
| Data charts | bar, line, area, scatter, combo, pie from a CSV, a table, or pasted numbers | moda-chart |
| UI mockups | app and site screens at real viewport sizes — pictures of interfaces, not hosted pages | moda-mockup |
| Websites | multi-page hosted sites at a public `*.moda.page` URL, editable and re-publishable | moda-website |
| Motion and video | keyframes, easing, staggers, timeline cuts and transitions; one animated page exports mp4 or gif, FREE | moda-video-motion |
| Films from real footage | a folder of local clips indexed and searched on the user's machine, only the selects uploaded; an editable Main Edit timeline + mp4 out, FREE | moda-video-footage |

## Generated media — METERED unless marked

`--model` is required everywhere; there is no "auto". `moda media models` is FREE and serves live
capability cards (aspect ratios, durations, voices, price axes) — copy values from the card
verbatim, because a guessed one is a rejected call.

| Do | Verb |
|---|---|
| Generate an image; edit one generatively; guide it with reference images | `moda media generate-image`, `moda media edit-image` |
| Generate video: prompt-to-video, image-to-video, reference-guided, extend a clip | `moda media generate-video` |
| Generate audio: voiceover/TTS, music, sound effects, up to 600 s per render | `moda media generate-audio` |
| Upscale an image, or a video to 1080p and beyond | `moda media upscale`, `moda media upscale-video` |
| Remove a background, returning a transparent PNG | `moda media remove-background` |
| Get a real company's own logo files, by domain — FREE | `moda media fetch-logo` |
| Extend an image past its own frame | `moda media outpaint` |
| Reframe a video to a new aspect without losing the shot | `moda media reframe-video` |
| SEE a generated clip — sampled frames, FREE; never present a clip you have not looked at | `moda media video-frames` |

Every result is a durable team file (`file_…`) with lineage: usable directly as a markup fill, as
the input to the next media call, and downloadable with `moda file download`. Audio has no canvas
slot — it is a file to play, and reference audio on a video render is the only verb that consumes
one. Real type, prices, and logos belong on the canvas, never in a generation prompt.

## Brand kits — FREE

List kits and read model-safe tokens (palette, fonts, tagline, logos, guide prose); create a kit
from a website URL **or** from tokens the user gave you — never both in one call; update it
(palette and font lists REPLACE wholesale), attach images, set the team default, and audit an
existing canvas against the kit. Bind the kit at create time; never retype hexes from memory.
`moda brand list`, `moda brand show`, `moda brand create`, `moda brand update`, `moda brand guides`.

## Files, drive, templates — FREE

Upload local files or by URL; search team assets, stock photography (placeable directly, with the
result's attribution credited wherever the photo appears), and icon packs; read an uploaded PDF,
DOCX, PPTX, XLSX, or CSV as text — the "ground the design in the user's own brief" lane; browse and
organize folders (a folder owns its contents' visibility); list team templates, LOOK before
choosing (a template IS a canvas — screenshot it), then instantiate one as a full copy; or search
single pages inside templates and themes and import just the one you need.
`moda file upload`, `moda file search`, `moda file download`, `moda drive tree`, `moda drive mkdir`,
`moda drive move`, `moda drive visibility`, `moda template list`, `moda template pull`,
`moda template search`.

Moda designs NEW pages grounded in the user's files; it never rewrites the uploaded source file in
place. A DOCX or PDF goes in as reference and comes out as a new designed artifact.

## Delivery and jobs — FREE

Export png, jpeg, pdf (flattened by default; unflattened keeps text selectable and links live),
native pptx, and mp4 or gif from one animated page (`moda export`). Read the typed warnings channel
— rasterized shapes, dropped content, flattened links, substituted fonts — and relay caveats
honestly rather than withholding the file. A long render returns a job handle: poll it with
`moda task status`. An identical re-call reuses the job instead of running it twice.

A long `queued` is not always queue contention — a task whose attempt died is retried
automatically and sits in `queued` through the backoff. `attempts_started` counts attempts BEGUN
(`0` = never claimed), and the claim itself increments it, so `queued` + `attempts_started >= 1` is
a retry while `running` + `attempts_started == 1` is an ordinary first run — the threshold is `>= 1`,
not `>= 2`. On a non-terminal task `error` describes the PREVIOUS, already-dead attempt: keep
polling, do not report the job failed or start a replacement. `created_at` → `first_started_at` is
the true queue wait (`started_at` restarts on every attempt, so it overstates it); `first_started_at:
null` means unknown, never "never started".

## Meta — FREE

`moda doctor` (health), `moda update` (CLI and skills in one command), `moda describe` (any verb's
ground-truth schema), `moda docs`, `moda last-error`, `moda account status` / `moda account usage` /
`moda account costs` for plan, credits and spend, `moda org list` / `moda org use` for workspaces,
repo-pinned defaults via `moda context show`, and `moda ask` — the live product expert, free.

CLI-only lanes: metered web research (`moda web search`, `moda web read`) for harnesses with no
browsing of their own, PowerPoint import (`moda canvas import-pptx`), local footage analysis
(`moda rushes …` — the optional Rushes toolkit; moda-video-footage carries the workflow), and
OpenTimelineIO timeline interchange (`moda edit export` / `moda edit import`).

## Not available here — say so plainly, and route to the Moda app

- **Creative identity work** — generating a brand-guide document (kits are read, created from a URL
  or tokens, and applied here; the guide itself is authored in the app).
- **Decomposing a flat image into editable layers** — the in-app design agent serves exactly this.
  Hand over the app link; do not decline, and do not fake it with traced shapes.
- **Stateful hosted web apps** behind a site, and site authoring beyond what moda-website teaches.
- **Sending mail.** There is no send verb and no mail provider — delivery is always the user's own
  ESP. The email HTML itself is NOT outside Moda: the canvas pipeline never emits it (it exports
  png/jpeg/pdf/pptx/mp4/gif), but you hand-write the self-contained file — load moda-document (or
  moda-website), which carries the email-HTML craft.
- **Any generation mode the roster does not list.** `moda media models` is the authority; check it
  before promising a mode, a voice, or a duration.

When something is genuinely outside Moda, say so in one line, then offer the nearest thing Moda
CAN do. Unsure whether it is outside? `moda ask` first — it is free, and it is faster than a wrong no.
