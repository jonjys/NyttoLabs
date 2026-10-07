# `moda canvas markup` — markup grammar cheat-sheet

`moda canvas markup` is the **only** path for creating content. You pass XML markup describing shapes, text, images, layout containers, and generated graphics; the parser turns it into canvas nodes. It is **partial-success**: elements that fail are skipped and reported in the result's warnings, while the rest render — a committed-but-imperfect apply exits 0 with `requires_repair: true`.

```
moda canvas markup CANVAS_REF --file page.xml --page PAGE_ID [--mode append|replace] [--screenshot out.jpg]
moda canvas markup CANVAS_REF --file - --page PAGE_ID < page.xml     # stdin — the agent-ergonomic path
```

- `--page` is **required, even on a fresh single-page canvas** — a page short id from your latest `moda canvas read` (or `canvas` for floating, canvas-absolute nodes on a Design canvas).
- `--mode replace` is the atomic full-page rewrite: it deletes every node on the page and then adds the markup — deletion happens only after a clean parse, so an interrupted call can never leave the page empty. Default is `append`. Replace requires a revision token: the CLI uses your cached last `moda canvas read` automatically, so read first (or pass `--revision`).
- `--screenshot PATH` captures the touched page right after the commit — the same capture and files as `moda canvas screenshot -o PATH`, folded into one invocation. Use it when a screenshot is your next step anyway (`--page canvas` falls back to the default capture; a capture failure never changes the mutation's exit code).

## Text is auto-fitted after the fonts load — read the warnings

A `<text>` whose copy does not fit its box is shrunk below the `font-size` you declared, by a fit that runs once the real fonts have downloaded. It is reported in `warnings[]`; a success can still carry type you did not ask for.

- `text_auto_shrunk` — the node was shrunk. `details.declaredFontSizePx` → `details.fittedFontSizePx` are the real numbers; `details.classConsistencyDriven` means a `<styles>` class sibling forced it, so THAT node's box is the lever, not this one's; `details.truncated` means it *still* didn't fit and copy was discarded. To KEEP the declared size, `details.fix` is the complete repair — apply ALL of it (`maxLines` + `height` + `fontSize`) in ONE edit; restating only the font size overflows the box and paints over neighbors (edits never re-fit, nothing is clipped). Or send `{ fontSize: <declared>, fitHeight: true }` and the box grows itself. `details.widthBound` means one word is wider than the box — only widening or shortening helps.
- `text_truncated` — the node was already at the minimum font size, so the fit discarded copy instead of shrinking. Always a real content loss.
- `text_fit_failed` — the fit broke for the nodes in `details.nodeIds`. `details.stage == 'measure'` means they kept their authored size and may overflow; `'apply'` means they were measured but the write failed, so what's on the canvas may not be what the fit computed. Check their bounds either way.
- `text_fit_pending` — the fit was still loading fonts when the result was built, so the sizes above may still move. Re-read the nodes before trusting the type.

## Root & flow

- **All markup wraps in `<content>`** (aliases: `<svg>`, `<body>`). `<content>` attributes (e.g. `font-family`) become defaults for every text descendant.
- `<content padding="60" gap="40">`: `padding` offsets all top-level elements and shifts explicit coordinates; `gap` (or any non-zero padding) enables **vertical flow** — elements without an explicit `y`/`cy` auto-stack top-to-bottom by their actual bounds + `gap`.
- Positions are baked at parse time (posts, slides, posters, documents). There is no live auto-layout mode on this surface.
- **Floating nodes** (any Design canvas): pass `--page canvas` → `x`/`y` are canvas-absolute. Fails with a typed error on Slides/Motion canvases.

## Elements

The parser dispatches all 24 elements below — including `<chart>`, `<path>`, `<repeat>`, `<generate>`, and `<video>`, which are easy to miss but fully supported. `<content>` is the root wrapper.

| Element | Key attrs | Notes |
|---|---|---|
| `<rectangle>` | x,y,width,height,corner-radius,fill,stroke,src | top-left origin; `src` makes an image-filled rect; `perspective`/`corner-pin` = 4 `"x,y"` pairs TL,TR,BR,BL |
| `<ellipse>` | x/y+w/h OR cx/cy+rx/ry (mixed OK); start-angle,sweep-angle,inner-radius-ratio | wedge/arc/donut via angles; `r` for circles |
| `<polygon>` / `<star>` | cx/cy+radius (or x/y+w/h), sides / points, inner-radius | radius → square bbox = 2r |
| `<path>` | d (SVG syntax), x,y offset, width/height scale-to-fit, corner-radius (uniform number only; no full/%/per-corner) | no fill specified → `none`; neither fill nor stroke → `stroke="#000"`; decorative shapes only — use the vetted library in references/design-quality.md, never hand-drawn glyph/logo path data |
| `<line>` | x1,y1,x2,y2 OR points="x1,y1 x2,y2" | endpoints REQUIRED outside flex; a bare `<line/>` inside a row/column = auto divider |
| `<connector>` | from="@NodeName:anchor", to="@Node:anchor", routing=straight\|elbowed\|curved, arrow-start/arrow-end, pointer-length/pointer-width | anchored line between shapes; may sit inside a `<group>`/`<row>`/`<column>` (out-of-flow: no layout slot); arrow attrs as on `<line>` (see the shapes appendix). Recovery: a target that fails to resolve after a structural change (groups, freshly-minted ids) → re-read for current ids, then prefer a replace-mode apply with inline connectors for the affected page over incremental patching |
| `<text>` | font-size,color,text-align,vertical-align,line-height,letter-spacing,paragraph-spacing,format,max-lines,stroke,glow,echo,extrude | plain by default; `format="markdown"` for bullets/bold/italic; `format="html"` for per-span styles. Tags kept: `<p>`,`<ul>`,`<li>`,`<span style>`,`<a href>`,`<br/>` plus the semantic inline set `<b>`/`<strong>`,`<i>`/`<em>`,`<u>`,`<s>`/`<strike>`/`<del>` (normalized to styled spans) — everything else is stripped, absolute http/https/mailto hrefs only. **`<ol>` never works, on any format** — the numbering is always dropped: under `html` a top-level one leaves plain paragraphs (no marker, no indent) and a nested one takes the enclosing `<ul>`'s bullets; on the other formats the item text merges into one run (`<ol><li>Alpha</li><li>Beta</li></ol>` → `AlphaBeta`). Use `<ul>` for bullets, or write `"1. "` into the text. Inline `style` keeps typographic properties only (font-family/size/weight/style/variant, color, letter-spacing, line-height, text-align, text-decoration); `margin`, `padding-left`, `text-indent` and every other layout property are dropped, so `paragraph-spacing="12"` (px between paragraphs/bullets) is the only way to space them |
| `<image>` | src OR icon (search query), fit=cover\|contain, tint, corner-radius, perspective | `fit="cover"` for full-bleed/hero; `contain` for logos; `icon="query"` resolves a functional UI icon by search — the deterministic icon path |
| `<video>` | src (a `file_…` ref, required), fit=cover\|contain, x,y,width,height, corner-radius, rotation, opacity, tint, layer-blur; clip attrs trim-start,trim-end,muted,volume,rate,loop | a rectangle with a VIDEO fill (not a node type), so z-order/opacity/clipping/corner-radius come free. See "Video" below |
| `<group>` | x,y, clip="true" | `clip="true"` = clipping mask: FIRST (bottom-most) child is the mask; needs ≥2 children |
| `<column>` / `<row>` | x,y,width,height,gap,padding,align,justify,fill,stroke,corner-radius,group | layout-only (children land at root level) unless `group="true"`; appearance props auto-create a background rectangle |
| `<layers>` | x,y,width,height,padding,fill | z-stack: children overlap; no x/y → (0,0); no size → inherit container content area; first child = back |
| `<table>` | row-height,row-sizing,cell-padding,header-background,header-color,header-font-weight,background-colors(zebra),row-lines,column-lines,column-align,stroke,stroke-width,corner-radius,opacity | HTML `<tr>/<td>/<th>/<thead>/<tbody>`; `<tr fill="#123">` per-row background; `<td width="50%">` proportional; defaults cols×150 wide, rows×50 tall; `row-sizing="auto"` grows rows to fit their text (inferred when no height is authored anywhere), `"fixed"` keeps authored heights; `row-lines`/`column-lines` = `all\|outside\|inside\|after-first\|none` (invalid → ignored); per-cell `<td>`/`<th>`: `text-align`, `vertical-align`, `text-padding` px (default 8); `header-color` + `header-font-weight` apply ONLY to `<th>` / `<thead>` / `<tr header="true">` cells, `header-background` paints ROW 0 only; font styles cascade table→cell (cell wins); per-cell background `<td fill="#123">` beats `<tr fill>`, `background-colors` and `header-background`; `corner-radius` rounds the 4 corner cells; `opacity` multiplies into cells + gridlines; `rotation`, `shadow`, `dash`, `blend-mode` are IGNORED on `<table>` |
| `<chart>` | type=bar\|line\|area\|scatter\|combo\|pie, title, palette, show-legend | pipe-delimited `<data>` block: `category\|series\|value` (or `x\|y` for scatter); the parser does the math; output = a single generated node — no per-bar/per-series child nodes. Full grammar: references/charts.md |
| `<qr>` | data (req), size (default 200), error-correction L/M/Q/H, fg/bg colors, border-modules | always square; a generated node |
| `<latex>` | latex/source/formula or body text, display-mode, font-size, color | generated node; can return a typed per-element refusal on some hosts (see gotchas.md) — the rest of the markup still lands |
| `<map>` | query OR center="lon,lat", zoom, style (light/dark/satellite/…), marker, marker-color | default 640×400 |
| `<background>` | fill (color/gradient/`shader(<type>)`/`image(url)`), src, type | native page background |
| `<comment>` | x,y,node="@Name",thread="c1",page_id | non-node side effect: create/reply to comment threads; resolve via `moda canvas edit` code `update('c1',{resolved:true})` |
| `<repeat count="N" as="i">` | count 0–1000, `{expression}` interpolation in any attr/text | nested repeats OK; expressions get `i`, `count`, `Math`, arithmetic/comparison/ternary/strings only |
| `<generate>` | body = JS calling `emit(tag, attrs)` | full `Math`; `let/const`, braced `for` only (no `while`), if/else, arrows, array methods; `_content` key = text content; limits: **2,000 elements/block, 16,384 chars/block, 5,000 global element cap**; runtime errors keep partial results |

**Cannot be created via markup:** `<blend>`, `<container>` (internal node types). **Unsupported attributes:** `transform`, `clip-path`, `mask`, `clip-content`.

## Images and asset refs

- A local file becomes canvas-usable through `moda file upload PATH`: the result returns a durable `file_…` reference **usable directly as `src`** in markup (`<image src="file_…">` / `image(file_…)` fills — the server resolves `file_` refs before dispatch). From-URL images: `moda file upload --from-url URL`.
- Full-bleed placement of an uploaded or generated file is `fit="cover"` plus the page's own dimensions (an image never resizes the page):
  `<image src="file_abc123" fit="cover" x="0" y="0" width="1080" height="1350"/>` — omit `fit` and `<image>` defaults to `contain` (letterbox).
- Refs are resolved server-side. Signed URLs are never part of the contract — never paste one into markup, and never retype a URL when you hold a ref.
- Reuse refs exactly as they appear in your latest `moda canvas read` (`img1`, `img2`, …). A hallucinated ref produces an `image_load_failed` error-severity warning that drives `requires_repair`.
- Functional UI icons (nav, status, bullets): `<image icon="search query"/>` — deterministic, no generation cost. Never use placeholder shapes or literal "[icon]" text.

## Video

`<video>` is the ONLY way a clip gets onto a canvas — placement runs the server-side ref resolver, so a video fill cannot be built with `moda canvas edit` `create()` (those props are stripped with `create_video_fill_ignored`). Tune a placed clip afterwards through `update()` (references/edit-code.md).

- **`src` must be a durable `file_…` ref** — upload the clip first (`moda file upload clip.mp4`), or reuse the `file_` ref a media result returned. External and provider video URLs are rejected: they expire, and the canvas would break later while still looking fine today.
- **Sizing** matches `<image>`: omit width/height for the clip's natural size (capped to the page cap), or declare a box — a clip NEVER resizes the page, so full-bleed means writing the page's dimensions on the clip. Inside a `<row>`/`<column>` an unsized clip falls back to a 320×180 stand-in. `fit="cover"` (default) crops into the box; `fit="contain"` letterboxes and — unlike `<image fit="contain">` — never shrink-wraps the node to the clip.
- **Clip attributes map 1:1 onto the `fillVideo*` fields `update()` writes**, so `<video trim-start="1.5s">` and `update(id, {fillVideoTrimStartMs: 1500})` land identical state: `trim-start`/`trim-end` (→ `fillVideoTrimStartMs`/`fillVideoTrimEndMs`), `muted`, `volume` (0–1), `rate` (0.1–4), `loop`. Durations accept `1500`, `"1500ms"` or `"1.5s"` (bare = ms). *Generate long and trim* is the normal move — model duration floors (4 s on Seedance, a fixed 4/6/8 on Veo) overshoot a 2–3 s beat.
- **`muted` and `loop` take HTML's boolean shorthand** (`muted=""` and `muted="muted"` both mean true) because XML rejects a bare `<video muted>`. On any other clip attribute an empty value is an error, not a silent skip.
- A bad clip value **fails that element** (nothing is clamped): a trim window outside `[0, clip length]`, an inverted window, an out-of-range volume or rate.
- **Audio is ON by default** for a clip you place (the generators produce native audio and the export mixer only pulls un-muted clips) — the opposite of a clip a user drags in.
- Placing N clips creates N independent elements; sequencing them is `t.video` on an animation canvas (references/edit-code.md).
- **Not authorable here** (narrower than `<image>`): `crop`, `perspective`/`corner-pin`, `icon`, `shadow`, `stroke`, `blend-mode`, `backdrop` (that one warns `backdrop_unsupported_for_element`).
- **Static exports draw a video-filled node's poster frame when one is available.** If poster derivation fails, placement warns `video_poster_unavailable` and static exports of that clip are blank; deliver mp4/gif instead when motion must be preserved (references/gotchas.md).

## Sizing & layout semantics

- **Flex child sizing:** fixed px, `fill` (=1fr), `1fr`/`2fr`, `hug`/`auto`/`fit-content`, named fractions (`half`,`third`,`quarter`,`two-thirds`,`three-quarters`), `1/3` slash notation, `50%`. Fractions/percentages compute against **available space after gaps**.
- **Containers themselves:** fixed, `hug` (shrink to children+padding+gaps), or `fill` — but `fill` is nested-only. **`fill` on a ROOT container errors** — use `hug` or explicit dimensions.
- **Auto dimensions:** rectangle/path/image default 100×100; text width defaults to `fill`, height ≈ font-size×1.2×lines; nested row/column computed from children; group = union of child bounds.
- **Scale-to-fit:** fixed children overflowing a fixed container are scaled proportionally (sizes, font size, gap; 1:1 children scale both axes so circles stay circular; padding never scales). Opt out per child with `shrink="false"`.
- **Cross-axis hug clamping:** a hug child bigger than the container's cross-axis content area is clamped to fit.
- **Child `x`/`y` inside a row/column = relative offsets** from the flex-computed slot (CSS `position:relative`; negatives allowed for overlaps).
- **`x="center"`/`cx="center"`** resolve against the page (minus padding) or a `<layers>` content area — NOT inside `<group>`/`<row>`/`<column>`.
- **Text-alignment inheritance:** `row align="center"` → text child `vertical-align="middle"`; `column align="center"` → `text-align="center"`; `justify` maps similarly. Immediate children only; explicit attrs win.
- **Auto vertical centering:** styled column + exactly one text child → text `vertical-align="middle"` (call-out box); a text child of a shape inherits the shape's w/h and centers (badge/pill); a lone non-text child of a shape auto-centers.
- **`max-lines="1"`** → `vertical-align` defaults to `middle` (provenance-stamped: if a later edit makes the text wrap or overflow, the pipeline flips it to `top` so the overflow spills one way instead of over neighbors on both sides; an explicit `vertical-align` is never flipped).
- **Styles:** `<styles>` block with `.class { fill: …; font: "Family" 48 700 }`. Cascade: builtin < content defaults < inherited (color/font-family/font-size/font-weight from row/column parents to text) < class < inline attrs < inline `style="…"`.
- **Value forgiveness:** units stripped (`100px`,`24pt`,`45deg`); `opacity="50%"`; camelCase→kebab; tag aliases (`rect`,`circle`,`img`,`div`→row, `p`/`h1`→text, `ul`→column, `card`/`box`/`panel`→column, `zstack`→layers, `for-each`→repeat); attr aliases (`bg`→fill, `radius`→corner-radius, `border-color`→stroke, `w`/`h`, `left`/`top`, `href`→src…); inline `style="border: 2px solid #ccc"` parsed to stroke props.
- **`corner-radius`:** `"full"` = min(w,h)/2 (pill/circle); `%` of the min dimension (≥50% = full); per-corner `"TL,TR,BR,BL"`.
- **Gradients:** `linear-gradient(…)`, `radial-gradient(…)` on fill+stroke; `conic-gradient(…)` fill-only (and not on a page `<background>`, which degrades a conic to its first stop color — use linear/radial or a shader there); shader fills `shader(<type>)` (e.g. `shader(prismatic-swirl-panels)`, `shader(plasma-field)` — many types; pick one that fits, don't default to `mesh-gradient`; directory in references/design-quality.md) on background, all fillable shapes, containers, and text.
- **Effects:** `shadow="x,y,blur,color"`; `inner-shadow="x y blur [spread] color"` (rect+ellipse only); `blend-mode`; `backdrop="blur|glass|pixelate|dither|none"` + `backdrop-preset="subtle|strong"`; text-only `glow`, `echo`, `extrude`. Re-applying updates in place; `="none"` removes.
- **`rotation`/`rot`:** clockwise degrees **around the shape's center** — the parser adjusts x/y so concentric rotated shapes stay concentric.

## Shapes appendix — geometry facts that prevent misplacement

- Coordinate systems by node type: top-left x/y + w/h for rectangle, richtext, polygon, star, ellipse; path is top-left of its bbox with LOCAL points (never hand-edit them); a group has no size of its own (bounds derive from children); a line is points-based (`points=[x1,y1,x2,y2]`, no x/y).
- Line arrowheads (markup attrs, on `<line>` and `<connector>`): `arrow-start` / `arrow-end` = triangle | open | reverse-triangle | diamond | circle (omit or `none` for none); size with `pointer-length` / `pointer-width`. In `moda canvas edit` patches the same knobs are the node properties `startArrowShape` / `endArrowShape` / `pointerLength` / `pointerWidth` — don't mix the dialects.
- Re-anchoring an EXISTING line (`moda canvas edit` patches, not markup): `update(<lineId>, { startAnchor: { nodeId: "<shapeId>", kind: "preset", preset: "right" }, endAnchor: {...} })` attaches a hand-drawn arrow to shapes so it follows them — no need to delete and re-author it as a `<connector>`. Setting an anchor MOVES that endpoint onto the target's boundary (that is the point); the line's own coordinates in the same patch are overridden for the anchored end. `kind` is `preset` (top | bottom | left | right | center | top-left | top-right | bottom-left | bottom-right), `bbox` (`u`/`v` in [0,1]), or `perimeter`. `startAnchor: null` detaches that end and leaves the geometry where it is. Targets must be anchorable shapes — another line, a group, or a page is rejected.
- Text in shapes (buttons, badges, diagram boxes): rectangle, ellipse, polygon, star, and lines embed text via `text="Label"`, `font-size`, `font-family`, `font-weight`, `color`, `text-align` (default center), `text-vertical-align`. Line labels: `text="Label"` + `text-position="0.5"` (0=start, 1=end). For anchored diagram lines use `<connector>`.
- Variables: markup takes LITERAL colors only. `$name` and CSS `var()` tokens do NOT resolve here — the token is written to the node as-is and the renderer paints its fallback — grey on a shape fill, BLACK on text `color`, which is where a brand token is most often reached for. The apply still SUCCEEDS and says nothing prominently — the result carries an `unparseable_color` warning, but this severity is not surfaced by default — so verify colors with a screenshot or by reading the result's warnings. Canvas variables are real and appear in the read's top-level `variables[…]` list, but the way to APPLY one is the edit lane (`moda canvas edit`, a color value of type `variable` whose `variableId` key carries the id from the read's `variables[…]` — that exact key; the `variableName` the read shows on a bound fill is accepted silently and paints black), not markup. In markup, write the kit's exact hex — copied from `moda brand show`, never retyped from memory.

## Top authoring rules / gotchas

1. **Wrap everything in `<content>`.** The parser is partial-success — failed elements are skipped and reported, the rest render.
2. **`width="fill"` on a ROOT container is an error** — the rejection reads "not supported in baked mode" (or "uses fill but has no parent container"); there is nothing for a root to fill against. If it hints at a layout-mode switch, ignore that — no such switch exists on this surface. Use `hug` or explicit dimensions on the root; nested `fill` children inside a sized container are fine.
3. **`<line>` outside a flex container** (directly under content / in a group / in layers) MUST have complete endpoints, or it's skipped (`line_missing_endpoints`). Inside a row/column a bare `<line/>` is the divider shortcut.
4. **Bullets = `<text format="markdown">- item</text>`.** Never build bullets from ellipse dots in a row, and never split same-styled paragraphs across adjacent `<text>` nodes — use markdown (uniform) or html (mixed styles) inside ONE node.
5. **Row/column are layout-only by default** — the container itself gets NO node id (the auto background rect maps to the container name if styled). Need a referenceable id (e.g. a connector target)? Use `group="true"` or an explicit `<group>`.
6. **In `<layers>`, `x`/`y` on a `<line>` are IGNORED** (warning `layers_line_xy_ignored`) — only x1/y1/x2/y2 or points move it.
7. **Explicit line endpoints + `fill` sizing conflict → fill wins**, slope discarded (`line_fill_overrides_points`).
8. **Text `fill` is aliased to `color`** (per-run color) — except gradient/`shader(…)` values, which become a whole-node fill override. Conic gradients are not supported on text.
9. **HTML-format text must be XML-valid:** lowercase tags, quoted attrs, `<br/>` self-closed, explicit close tags. Disallowed tags (`div`, `h1`–`h6`, `table`, `img`, `script`, …) are stripped.
10. **`<repeat>` max count 1000** (clamped + warning); **`<generate>` caps: 2,000 emits/block, 16,384 chars/block, no `while` loops**; expressions block eval/Function/import/require/assignment/DOM. Charts need the pipe-table header row (`category|value` or `x|y`; optional `series`).
11. **Badge/pill/chip labels: embed the text in the shape — never a hand-offset sibling `<text>` over a rect.** `<rectangle x="88" y="176" width="176" height="56" corner-radius="full" fill="#ff2fbd" text="LIVE" font-size="26" font-weight="700"/>` centers the label on both axes for free; a lone `<text>` child of a shape does the same (it inherits the shape's frame and centers). Hand-placing a separate `<text>` means guessing glyph metrics you cannot measure — the guess is systematically wrong for letter-spaced caps, and the label lands visibly off-center. Same instinct for multi-part lockups (label + dot, number + caption): a `row`/`column` with `align`/`gap` beats hand-spaced absolute siblings.
