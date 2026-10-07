# `moda canvas edit` — the sandboxed JS batch editor

`moda canvas edit` runs synchronous JavaScript against the live canvas to **mutate** existing nodes, pages, variables, and animations. Use it for bulk styling, duplication, reordering, grouping, page creation, variable updates, and text/image swaps.

**It cannot delete.** The sandbox `remove()` is a throwing stub → the call fails typed with nothing applied. Deletion is only through `moda canvas delete-items`.

`moda canvas delete-items CANVAS_REF n7 n8 p_b` — the ids are positional and mix nodes, pages, variables, and animations freely. Z-order is not deletion: send a covered node backward with `reorder(id, 'back')` in edit code instead of deleting it.

```
moda canvas edit CANVAS_REF --file edit.js [--page PAGE_ID] [--screenshot out.jpg]
moda canvas edit CANVAS_REF --file - <<'EOF'
update('n1', { color: '#0A66FF' });
EOF
```

- All operations go in ONE code payload; there is no second file.
- `--screenshot PATH` captures **every page the edit changed** right after the commit (the response's `changed_page_ids`; more than 3 pages auto-batches) — the same files as `moda canvas screenshot -o PATH`, in one invocation. An edit that changed no page (variable-only) falls back to the current page. `--page` never steers the capture. A capture failure never changes the edit's exit code.
- `--page` scopes the read-only `nodes` snapshot to one page, AND is the fallback destination page for every `create()` in the payload that does not carry its own `pageId` prop. It is NOT a duplicate destination.
- **Ids:** reference nodes/pages by the **short ids** from your latest `moda canvas read` (e.g. `update('n7', …)`). The server resolves short refs to real ids for you. Real canvas ids you already hold also work (identity pass-through).
- Writes accept `--revision` (defaulting to the CLI's cached last read). A write against a stale revision exits 5 with `STALE_REVISION` and commits nothing — re-read, then re-apply.

## Sandbox API surface

**Read-only snapshots** (frozen, captured BEFORE queued mutations replay — so a returned script value reflects pre-replay state): `nodes`, `pages` (incl. `page.background`), `variables`, `animations`, `comments`.

**Functions:**

- `create(type, props)` → temp id. **On a multi-page canvas, pass `pageId`** — `props.pageId` is the page the new node lands on, and it accepts a page short id, a real page id, or a temp id returned by `create('page')`. Omit it and the node falls back to the call's page scope; omit both and placement is left to the create arm's own default (bounds overlap for shapes, page 1 for images and SVG paths). A `pageId` naming no page — a typo, a stale id, or a temp id whose `create('page')` failed — warns `create_page_invalid` and takes that same default placement; it does NOT fall back to the call's page scope. Node types: `rectangle, ellipse, container, richtext, line, star, polygon, path, group, table, image`; plus `'page'`, `'variable'`, `'animation'`, `'comment'`. Aliases: `rect/box/square/shape`→rectangle, `text/label`→richtext, `circle/oval`→ellipse, `arrow`→line, `triangle/hex/hexagon/pentagon/octagon`→polygon. (`create('image', …)` is sugar for a pattern-filled shape.) Image fill on a SHAPE create takes the canonical spellings only — `{src, crop, fit}` — because create props skip the alias-resolving patch normalizer `update()` runs. An alias (`href`, `focus`, `objectPosition`, `object-position`, `crop-focus`, `fitMode`, `fit-mode`) is not resolved and warns `create_image_fill_alias_ignored`; the crop/fit aliases are dropped, and `href` is the sharp one — it still lands the pattern src, but with no fit math, so the artwork draws at natural size instead of cover-fit.
- `update(id, changes)` — nodes, pages, variables, animations, comment threads. Richtext: `{text}` plain, `{markdown}` or `{text, format:'markdown'}`, `{html}`/`{htmlContent}` for inline styling. Image replacement: `{src, fit?:'cover'|'contain'|'match', crop?}` (crop = keyword, `{x,y}` focus 0..1, `{x,y,w,h}` bbox, or `'50% 25%'`; `objectPosition` alias). Backdrop: `{backdrop:'blur'|'glass'|'pixelate'|'dither'|'none', backdropPreset?:'subtle'|'strong'}`. Line arrowheads: `{startArrowShape, endArrowShape}` = `'triangle'|'open'|'reverse-triangle'|'diamond'|'circle'` (`null` or `'none'` removes), sized by `pointerLength`/`pointerWidth` (positive px; `null` resets) — these are the node property names; markup's `arrow-start`/`arrow-end` attrs are markup-only. Comments: `update('c1', {reply:'…', resolved:true})`. Tables: structural patches are reconciled — see **Tables** below.
- `duplicate(ids[, options])` — nodes and/or pages → temp ids; cross-page via `{destinationPageId}`; a page copy can be named on the spot with `{newPageName}` (page duplication only — it warns and is ignored for node copies). Unknown option keys are invalid.
- `reorder(id, position[, targetId])` — position: `'front'|'forward'|'backward'|'back'|'before'|'after'|number`.
- `group(ids[, options])`, `ungroup(id)`, `movePages(ids, {index?, afterPageId?})` — moves the named pages as ONE block, keeping their current relative order; the order you write `ids` in is NOT applied, and naming every page is a no-op (warns `move_pages_all_pages_selected`) because nothing is left to position against. For an explicit sequence, chain one page at a time: `movePages(['b'], {afterPageId:'a'}); movePages(['c'], {afterPageId:'b'})`. An `afterPageId` naming a page inside the selection cannot anchor the block (it lands at the END, warning `move_pages_anchor_in_selection`).
- `details(id)` — full node detail (needed for effect arrays the lightweight `nodes` snapshots omit).
- `print(...args)` / `log(...)` / `inspect(label, value)` — output comes back in the JSON result.
- `Math` — a frozen facade (the raw global is withheld).
- `remove()` — **BLOCKED**: throws, nothing applies. Use `moda canvas delete-items`.

## Video clips — the fill owns playback, the bar owns placement

A clip reaches a canvas only through `<video src="file_…"/>` markup (references/markup.md): `create('rectangle', {fillVideoSrc})` strips the video props with a `create_video_fill_ignored` warning, because placement has to run the server-side ref resolver.

- **Writable on a placed clip** via `update(id, …)`: `fillVideoTrimStartMs`, `fillVideoTrimEndMs`, `fillVideoMuted`, `fillVideoVolume` (0–1), `fillVideoPlaybackRate` (0.1–4), `fillVideoLoop`. Trim off the readable `fillVideoDurationMs` — "the middle 3 s of this 8 s clip" is one call.
- `null` clears a numeric field back to its default: `update(id, {fillVideoTrimEndMs: null})` restores the clip's full length.
- Bad values are ERRORS naming the field and its range, never clamped or dropped — a window outside `[0, fillVideoDurationMs]`, an inverted window (`trimEnd <= trimStart`), an out-of-range volume or rate, or any of these on a node with no video fill. Only the bounds a patch actually writes are range-checked, so a clip left with an out-of-range trim can still be muted or re-rated.
- `fillVideoSrc`, `fillVideoAssetId`, `fillVideoPosterSrc`, `fillVideoNaturalDimensions`, `fillVideoDurationMs` and `fillVideoHasAudio` are NOT writable — the first four belong to the ref resolver (swapping a source is placement: place a new `<video>`), the last two are facts read off the file.
- **`t.video(node, {startMs, endMs})`** (`timeline.video`, inside `motion.page(…)` on an animation canvas) places that clip's bar. There is no top-level `timeline` or `t` global — `t` only exists as the callback parameter `motion.page(pageId, options, (t) => { … })` hands you, so call `t.video(...)` inside that callback, never `timeline.video(...)` at the top level (that throws, undefined). The bar is the clip's LIFETIME on the page — outside it the node is HIDDEN, not frozen on a poster — and N bars at different `startMs` IS a cut. `endMs` defaults to the trimmed clip's length clamped to the page. One bar per node: calling it again REPLACES that node's bar (also how you retime one). Its only options are `startMs` (alias `at`), `endMs`, `description`; `offsetMs`, `rate` and `loop` are hard errors redirecting to `fillVideoTrimStartMs`, `fillVideoPlaybackRate` and `fillVideoLoop`. Set the fill FIRST — the bar re-derives from it on every call. Drop one with `t.clearTrack(id)`.

## Tables — `create('table', props)` / `update(id, changes)`

Table structure is the one *shaped* (non-scalar) patch, so a reconciler runs on every table update: it pads a jagged `cells` array, mints missing cell ids, refits `rows`/`columns` to the grid, rewrites `width`/`height` to the axis sums, and remaps header metadata. It repairs and **warns** rather than rejecting — read the warnings.

- **`cells`** — 2D row-major array, always written WHOLE: a short/partial array is not a merge, its dimensions BECOME the grid and `rows`/`columns` are grown/trimmed to match. Cell shape: `{ id?, textContent, textPadding?, textHorizontalAlign?, textVerticalAlign?, textResizeMode?: 'no-resize' }` — `textContent` is richtext-style HTML (`<p style="font-size: 20px; font-family: Inter; color: #000000">…</p>`); a missing/duplicate `id` is minted, and omitted cell props get the editor defaults back.
- **`rows` / `columns`** — `[{ size: number, fill?: color }]`; a bare `[number]` array is accepted; `size` clamps to ≥5. `fill` is a ROW background (ignored on columns) and beats `headerBackgroundColor` + the zebra cycle. Count = array length, so adding/removing rows or columns means resizing `cells` (or the axis array).
- **`rowStrokeConfig` / `columnStrokeConfig`** — `'all'|'outside'|'inside'|'after-first'|'none'`; anything else is dropped with a warning.
- **`backgroundColors`** — `string[]` zebra cycle by row index. **`headerBackgroundColor`** — one color, ROW 0 only.
- Generic fields also apply: `x`,`y`,`width`,`height`,`opacity`,`hidden`,`locked`,`metadata`,`stroke`,`strokeWidth`,`cornerRadius`. An explicit `width`/`height` stays authoritative — axis sizes rescale into it, exactly like a drag-resize. `cornerRadius` rounds the 4 corner cells; `opacity` multiplies into cells + gridlines.
- Markup attr names work here too and normalize: `headerBackground`, `headerColor`, `headerFontWeight`, `rowHeight`, `cellPadding`, `rowLines`/`columnLines`, `fill` (→ `backgroundColors`), plus `fontSize`/`fontFamily`/`color`/`fontWeight`/`fontStyle`/`letterSpacing`/`lineHeight` — those text styles rewrite EVERY cell's HTML (header cells keep their own header overrides).
- Header text styling is keyed by `metadata.tableHeaderCells` — the CELL IDS of the header cells. Cell ids are stable across row/column inserts and deletes, so the designation follows the cells.
- `create('table', props)`: `rows`/`columns` also accept a plain COUNT (`create('table', {rows:3, columns:4})` → a 3×4 grid of 150×50 cells); every other prop lands through the same reconciled update path.

## Operation limits

Over-limit calls are ignored with a structured warning, not a hard error — watch `operation_counts.skipped`.

| Limit | Value |
|---|---|
| create() calls | 500 |
| duplicate() calls | 200 |
| update() calls | 10,000 |
| reorder() calls | 500 |
| group() / ungroup() calls | 100 / 100 |
| movePages() calls | 100 |
| details() calls | 200 |
| print entries | 32 |
| `nodes` snapshot cap | 10,000 |

## Sandbox constraints

- **Code cap: 16,384 chars** — over it the program is rejected whole and nothing runs. Execution budget: **100 ms, synchronous.** Runaway loops trip an "execution timeout" (a loop guard covers every loop form). Heavy O(n²) work over thousands of snapshots is the classic trip — **batch across multiple `moda canvas edit` calls.**
- **Must be synchronous.** These get a clear pre-run error: `eval`, `new Function`, `import`, `require`, `fetch(`, `await`, `async`, `window`, `document`, `globalThis`, `process`, `console` (use `print`/`inspect`).
- The sandbox is a speedbump, not a hard security boundary — don't rely on it to contain untrusted code.

## Result shape (what to read)

Key fields in the `--json` result of a committed edit:

- `operation_counts { queued, applied, skipped }` — **`skipped > 0` = ops silently dropped** (unresolved ids or hit limits). Read the skipped bucket first.
- `created_ids`, `updated_ids`, `removed_ids` — the mutation's own id arrays.
- `warnings` — structured, per-op. **Any entry with `severity: "error"` requires remediation even on exit 0.**
- `requires_repair`, `no_op_reason` (`lexically_mutates_zero_applied` | `all_queued_ops_skipped` | `partial_no_op`) — the edit committed but did nothing useful; repair before building more.
- `revision` — the post-commit revision token, ADVISORY only. Trailing CRDT chunks of the same write can land after the response, so the CLI deliberately does not cache it and you must not pin it; only a read mints a pinnable token. Re-read before a write that pins.
- `detail` — the tool-host result verbatim, where your own script output lives: `detail.scriptResult` (camelCase, your explicit `return` value) and `detail.prints` (`print`/`inspect` output).
  - **Both are capped, and over the cap the value is REPLACED, not clipped.** `detail.scriptResult` past 8,192 serialized chars — and each `detail.prints` entry past 4,096 — comes back as `{ truncated: true, originalLength: <number>, json: '<string slice>' }`, i.e. your payload as a *string* inside a wrapper, with your own fields gone. On a committed edit more than 8 print entries are also compacted to the first 3 + last 2 plus a `{ truncated: true, totalEntries, omittedEntries }` marker, so many small prints is no escape hatch either. **Return a small summary — ids, counts, a few sampled values — not whole snapshots.**
  - Nested values at depth 12 or deeper (the returned value is depth 0) become a bare `{ truncated: true }`, and keys past 500 per object / items past 1,000 per array are dropped. Each of these adds a `serialization_warning` to `warnings`.

## Failure semantics — NOTHING applied

When the call exits nonzero (a typed `invalid_edit_program*` code naming the cause, exit 2), no ops are applied — edit failures are atomic:

- **Parse failure** — fix the *syntax*; do NOT strip APIs you think are blocked.
- **Blocked pattern** — a sandbox speedbump was tripped (or you called `remove()`). Remove the forbidden pattern.
- **Code too large** — the program is over the 16,384-char cap and is rejected whole; do NOT hunt for a syntax error. Split the work across several calls.
- **Runtime throw** in code with mutation call sites: queued ops are NOT applied. Diagnostics carry `{line, column, code_excerpt}` plus any prints before the throw. (A read-only probe that throws recovers as a warning instead.)
- **No nodes found** — empty scope, no mutations; the error details list valid page ids.
- **Invalid page** — the `--page` you scoped to is not in the live document (deleted mid-session, or your view is stale). Nothing was edited. Do NOT recreate the lost work: `moda canvas read` for current page ids and retry against a page that exists.

**On any nonzero exit: STOP, read the typed error and its hint, fix the code, then retry — retrying is safe because a failed script made no changes.** Do not blindly re-send.

## Appendix — page resize recipe

**Back the page up before you resize it.** A page resize is destructive and this surface has **no undo** (the working-contract reference), so the first statement in the payload duplicates the page under an explicitly named backup — `duplicate([pageId], { newPageName: 'Story 1080x1920 (backup)' })` — ahead of the width/height change. That named page is the only recovery path if the rescale goes wrong. Verify the resized page by screenshot, then remove the backup with `moda canvas delete-items` (edit code cannot delete).

There is no dedicated page-resize verb; compose it from edit primitives: group the page's top-level nodes (skip this when a single node or group already holds everything), set the page's new width/height with `update(pageId, …)`, then scale that group — or that sole root — to fit the new size. Grouping first keeps the layout intact while the page changes under it. Resizing to the same aspect ratio is a single uniform scale. To a different aspect ratio, still scale uniformly and balance the leftover space as margins — don't stretch content non-uniformly; reflow the layout with `moda canvas markup --mode replace` only when the user wants the design recomposed for the new shape.
