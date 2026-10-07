# Gotchas & known divergences

## Headless execution — what degrades or refuses

Canvas verbs execute on Moda's tool host, not a full browser tab. Most things behave exactly like the editor; a few paths degrade or return a typed refusal. (Treat a typed refusal you get back as authoritative over this doc.)

1. **`<latex>` on a host without the render seam** → a typed per-element refusal. It degrades **only that element/update**, not the whole call — the rest of your markup still lands.
2. **Canvas-space region captures on FLOATING (freeform) layouts** are unsupported. Page-anchored captures (default layouts) work fine, so `moda canvas screenshot` of a normal page is unaffected.
3. **Selection is not a document operation.** Nothing in this surface selects nodes for the user; the change itself is what collaborators see.
4. **Cross-session agent memory does not reach this surface.** Standing preferences and history the user saved with Moda's in-app agent are not readable from the CLI — no verb recalls them. Solicit standing preferences from the user or the repo context instead of assuming the account "remembers" them here.

Other minor divergences worth knowing: shrink-fit font sizes can land within a ±6% band; non-catalog fonts are heuristically measured; screenshot bytes differ slightly from the browser.

## Curated risk list

- **The 100 ms synchronous budget is tight.** Heavy O(n²) loops over thousands of `nodes` snapshots trip an "execution timeout" and nothing applies. Batch across multiple `moda canvas edit` calls.
- **One shared code-size cap: 16,384 chars** — for a `moda canvas edit` program and for each markup `<generate>` block alike (they run in the same sandbox). Over the cap the program is **rejected whole**: nothing runs and nothing is applied, so split the work across several calls. `<generate>` additionally caps at **2,000 emitted elements per block** (5,000 global).
- **An exit-0 mutation can still be a no-op or need repair.** `warnings` entries with `severity: "error"`, plus `requires_repair` / `no_op_reason`, mean remediation is required even though the command exited 0. And `operation_counts.skipped > 0` means SOME ops were silently dropped (unresolved ids or hit limits) — check the skipped bucket.
- **An oversized script return changes SHAPE, it is not clipped.** Past the 8,192-char serialized cap, the result's `detail.scriptResult` is replaced by `{ truncated: true, originalLength: <number>, json: '<string slice>' }`, so your own fields are no longer there to read. Splitting the payload across prints does not help: `detail.prints` entries hit the same wrapper at 4,096 chars each, and a committed edit keeps only the first 3 + last 2 of more than 8 entries. Return ids/counts/samples, not whole snapshots.
- **Any nonzero exit means NOTHING committed.** Fix the cause per the typed error's hint and retry; retrying is safe because a failed call made no changes (and mutations carry idempotency keys, so even a retried timeout cannot double-apply).
- **Deletion is intentionally absent from edit code.** `remove()` throws. `moda canvas delete-items` is the only deletion path.
- **Animation authoring is real but narrow: motion v3 on an animation-category canvas.** `moda canvas edit` authors motion there (`create('animation', …)`; existing tracks read back under `## Animations`), animated shader fills move on any canvas, and `moda export --format mp4|gif --page N` delivers the motion (the moda-video skill owns these workflows). Preset animations on ordinary canvases are still app-only; for choreography beyond what you can author confidently, hand the user the canvas link.
- **`failedAssets` in a screenshot are transient renderer load failures — never regenerate or delete an image because of them** (a real regression class).
- **Two coordinate frames.** Node `x`/`y` are parent-relative; markup coords are page-relative (or canvas-absolute only with `--page canvas` on a Design canvas). Mixing frames misplaces nodes inside groups.
- **Recreate fidelity.** Markup shorthand is lossy for explicit gradient geometry and shadow opacity. If the state shows radial/conic centers/radii/rotations or a shadow opacity, preserve them via `moda canvas edit` raw gradient/shadow object fields rather than flattening to centered gradients or opaque shadows. Likewise carry forward any shadow, inner-shadow, gradient stroke, stroke-align, blend-mode, clip-mask, or blur fields a node had before you recreated it — dropping visible effects during a recreate is a regression.
- **Video on canvases: placement is markup-only; static exports draw a poster frame.** A canvas DOES take video — `<video src="file_…"/>` places a clip as a video fill on a rectangle (references/markup.md). Three edges: (a) `create('rectangle', {fillVideoSrc})` does NOT work — the video props are stripped with a `create_video_fill_ignored` warning, because placement has to run the server-side ref resolver, so `<video>` is the only way in; (b) the clip's own knobs (`fillVideoTrimStartMs`/`fillVideoPlaybackRate`/`fillVideoLoop`) live on the FILL via `update()`, never on the timeline bar — `t.video` takes `{startMs, endMs}` only and hard-errors on `offsetMs`/`rate`/`loop` naming the fill field instead; (c) **png/jpeg/pdf/pptx exports draw a video-filled node's poster frame when one is available**; if placement warns `video_poster_unavailable`, that clip exports blank. Deliver mp4/gif instead when motion must be preserved, and never hand over a blank still. (d) **A freshly uploaded clip is not placeable until it has been MEASURED**: placement sizes the node from the record's stored width and height, which are probed from the container in the background a few seconds after the upload call returns — `moda file show` reports them, and says `not yet measured` until they land, so poll THAT rather than the bytes (the byte URL answers the instant the object exists and tells you nothing). Only MP4 and QuickTime are ever probed; a WebM is an accepted upload that never gets dimensions, and `file show` says so terminally rather than telling you to wait. Upload an MP4 when the clip is destined for a canvas.

## Top 8 mistakes — WRONG / CORRECT

**1. Deleting inside edit code**

```js
// WRONG — throws, nothing applies
remove('n7');
```

```
CORRECT — use the deletion verb:
moda canvas delete-items CANVAS_REF n7
```

**2. Reusing stale short ids after a structural change**

```
WRONG — created three nodes with moda canvas markup, then immediately
ran moda canvas edit referencing "n9" guessed from before the change.
CORRECT — moda canvas read again to pick up the new short ids (and the
new revision), THEN edit.
```

**3. Faking bullets / splitting paragraphs**

```xml
<!-- WRONG — dots + separate text nodes, misaligned and unstyled -->
<row><ellipse r="4"/><text>First point</text></row>
<text>Line one</text><text>Line two</text>
```

```xml
<!-- CORRECT — one markdown text node -->
<text format="markdown">
- First point
- Second point
</text>
```

**4. `fill` sizing on a root container**

```xml
<!-- WRONG — "not supported in baked mode" (or "uses fill but has no parent container") -->
<content><column width="fill">…</column></content>
```

```xml
<!-- CORRECT — hug or explicit dimensions at the root; nested fill children are fine -->
<content><column width="hug">…</column></content>
```

If the error hints at a layout-mode switch, ignore it — no such switch exists on this surface; fix the root's dimensions instead.

**5. Trusting exit 0 without reading the report**

```
WRONG — command exits 0, you move on.
CORRECT — inspect warnings (severity "error"), requires_repair,
no_op_reason, and operation_counts.skipped; remediate before continuing.
```

**6. Reacting to `failedAssets` by regenerating the image**

```
WRONG — screenshot JSON shows failedAssets:[{nodeId:'n4'}] → delete + re-create the image.
CORRECT — leave the image alone; re-run moda canvas screenshot shortly.
```

**7. One oversized, async, brute-force edit**

```js
// WRONG — >16k chars, O(n²), and async — trips timeout / speedbump, nothing applies
for (const a of nodes) for (const b of nodes) { await something(); update(a.id, …); }
```

```
CORRECT — synchronous, single-pass, and split across several moda canvas edit
calls, re-reading state between batches.
```

**8. `<line>` with no endpoints outside a flex container**

```xml
<!-- WRONG — skipped with line_missing_endpoints -->
<content><line stroke="#000"/></content>
```

```xml
<!-- CORRECT — give explicit endpoints (or put a bare <line/> INSIDE a row/column as a divider) -->
<content><line x1="0" y1="0" x2="400" y2="0" stroke="#000"/></content>
```
