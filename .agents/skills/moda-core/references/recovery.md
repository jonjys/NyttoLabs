# Recovery — typed errors, warnings, and the move that ends every stall

Moda fails LOUDLY and specifically. Every failure carries a typed code, a message naming the
offending construct, and a hint. **The hint is the instruction** — follow it before you retry
anything, and never retry a failed call just to see its error again (`moda last-error` re-prints
the last failure in full when your scrollback ate it).

Two rules govern the whole file:

1. **A failed call committed nothing.** Fix the cause, then retry — retrying is safe, and
   mutations carry idempotency keys so even a retried timeout cannot double-apply.
2. **The same typed code twice on one operation means stop.** Do not spin a third time. Ask an
   expert (bottom of this file), or report the code, what you tried, and everything that DID
   succeed. A stalled agent that says so beats a busy one that loops.

## The gallery, keyed on the literal code

### `stale_revision`

Your write was pinned to a revision that has moved. Nothing committed.

**Recipe:** re-read the canvas, then re-apply — once. It heals. Someone else advancing the canvas
(the user in an open tab, a collaborator, a running task) is normal, not a fault.

Still stale after that one retry? A human is editing live. Stop writing, say so, and offer to pick
it up when they are done — do not fight them for the canvas. One more cause worth knowing: a long
gap between your read and your write (re-read at the start of every new request).

Note which writes can even produce this. Only the ones that PIN a revision — `canvas edit`,
`canvas delete-items`, `canvas markup --mode replace`, `edit apply`. Append-mode `canvas markup`
and `canvas add-pages` send no revision unless you passed `--revision`, so a stale pin is usually
not what went wrong there; a parallel batch of those contends on the canvas LOCK instead, and
surfaces as `canvas_busy` when it surfaces at all.

### `invalid_markup` / `invalid_edit_program*`

The markup or edit program was rejected atomically: nothing was applied, and the message names the
construct that failed. An edit program names its cause in the code itself: `invalid_edit_program_parse_failed` (it did not compile), `invalid_edit_program_runtime_error` (it threw, and the WHOLE call rolled back), `invalid_edit_program_patch_field` (`update()` rejected a field name), `invalid_edit_program_no_render_impact` (nothing renderable changed) and `invalid_edit_program_blocked_verb` (a verb `edit()` does not expose — deletion lives in `canvas delete-items`). Plain `invalid_edit_program` is the residual: a rejection we did not classify. Do not re-send it unchanged, and do not degrade to a simpler design because
of it — the fix is almost always a wrong attribute name, not an impossible request.

**Recipe:** read the named construct in the message → fix that attribute or element → re-apply.
Then check the markup reference for the element's real attribute list. Common shapes of this error:
an attribute that belongs on a different element, a CSS-ism the dialect does not take (there is no
bare `blur` or filter attribute — use `layer-blur` or `backdrop`), a `width="fill"` on a root-level
container that has no parent to fill, or a `<line>` with no endpoints outside a flex container
(that one is skipped with `line_missing_endpoints` rather than failing the call).

### Success with `requires_repair`, `no_op_reason`, or skipped operations

Not an error — a partial win. The mutation COMMITTED, and something in it did not land.

**Recipe:** read `warnings[]` (anything with `severity: "error"` needs remediation),
`operation_counts.skipped`, and `no_op_reason`; author a corrective edit; verify with a screenshot.
Never re-run the original command — you would duplicate what already landed.

### `conflicting_brand_source` / `missing_brand_source` / `missing_brand_name`

Brand-kit creation takes ONE source. Extract from a website URL, **or** build from tokens the user
gave you (colors and fonts) — passing both is refused. A *name* alongside a URL is fine: it just
titles the kit. With no URL and no tokens there is nothing to build from (`missing_brand_source`),
and the manual path needs a name (`missing_brand_name`).

**Recipe:** prefer the URL when the user has a site — extraction finds logos and fonts a
description leaves out. Otherwise ask for the colors and fonts and pass those alone.

### Quota and billing — `insufficient_credits` and friends

The TEAM is out of credits or has hit a plan cap. You did nothing wrong, and a retry cannot fix it.

**Recipe:** say so plainly, relay the hint verbatim, and stop. Never retry it, and never quietly
drop the quality lever and hand over a lesser thing without saying that is what happened.

### Not found, or a rejected reference

The ref does not resolve for this account: a mistyped id, a canvas in another team, or a share
token that names a canvas without granting access. Re-read to get fresh ids rather than editing the
ref by hand, and check which org you are in before assuming the object is gone.

### Auth and entitlement gates

Re-authenticate when the code says auth; when it names an entitlement or a scope, relay the hint
verbatim and stop. Never loop on an auth error, and never handle or print a credential.

### Execution limits inside edit code

A program that runs too long ("execution timeout") or exceeds the 16,384-character cap is rejected
WHOLE — nothing applies. Split the work across several calls, keep the code synchronous and
single-pass, and return ids or counts rather than whole snapshots (an oversized return changes
shape instead of being clipped, so your own fields disappear).

### `canvas_busy`

The canvas is locked by another write and yours was refused. Nothing committed. Retryable, unlike
most conflicts.

**Recipe:** if you fanned out writes to one canvas, that is the cause — serialize them and re-run
the losers. Same-canvas writes must go one at a time whatever their revision, including per-page
markup of a single canvas.

If you were already writing serially, someone else holds the lock — usually a running agent task
on that canvas. Wait for it and retry with backoff rather than hammering; if it never clears, say
so rather than looping.

Screenshots take the same lock. A parallel batch of captures of one canvas, or a capture fired
while your own write is still running, loses the same way — capture one canvas serially (several
pages per call is fine), after the write it verifies has returned.

### `screenshot_refused`

The requested page could not be captured because that page id is not on the canvas. Nothing is
wrong with the canvas, and retrying the same id cannot succeed.

**Recipe:** use one of the page ids the error lists in `details.available_page_ids`, or re-read them
with `moda canvas show`. Short page ids (`p_a`-style) expire after 24h — an id from an older
session is the usual cause, so re-read rather than reuse it. An empty list means the canvas has no
pages to capture (its content, if any, sits on the canvas root) — read it instead of retrying.

### `canvas_crdt_state_corrupt`

The canvas itself needs recovery; retrying cannot succeed. Stop and tell the user.

### `render_failed` and screenshot flakiness

Retryable: re-request the capture, the canvas state is intact. `pendingAssets` / `failedAssets` in
a screenshot report are transient load states — **never** delete or regenerate an image because one
appeared. Re-capture shortly instead.

## Export warnings — read them, relay them, still deliver

An export can succeed with caveats. `pptx_shape_rasterized` (an image baked in rather than shipped
as an editable shape), `pptx_content_dropped` (elements missing from the deck),
`pdf_pages_dropped` (pages missing from the document), `pdf_page_rasterized` (a page shipped as
pixels — it looks right, but its text is not selectable and its links are not clickable),
`pdf_page_reduced_quality` (an oversized page rendered below the DPI you asked for),
`font_substituted` (a requested family was unavailable),
`audio_source_dropped` (an mp4 shipped without one clip's audio).

Most are deterministic: an identical re-run degrades identically, so a warning is almost never a
reason to re-export and never a reason to withhold the file. Hand it over and name the caveat. The
one exception is an `audio_source_dropped` whose message names a fetch failure or timeout — that
shape is transient and may resolve on a later export.

Two more worth knowing: a page whose video fill has no poster frame exports blank to png/jpeg/pdf
(`video_poster_unavailable`) — deliver mp4 or gif instead, never a blank still; and multi-page png
or jpeg arrives as ONE zip, which is the deliverable, not a file to rename.

## The CLI exit-code contract in one table

| Exit | Meaning | Committed? | Do |
|---|---|---|---|
| 0 | Success (check `requires_repair` and skipped counts) | yes | read the report; corrective edit if needed |
| 2 | Invalid input — markup, edit program, or flags | no | fix the input; retry is safe |
| 3 | Auth or missing scope | no | `moda auth login`; the hint names the scope |
| 4 | Not found | no | check the ref, and the org you are in |
| 5 | Conflict — stale revision, busy canvas, corrupt state | no | stale: re-read and re-apply; busy: serialize your own writes, else wait for the owning task; corrupt: stop |
| 6 | Payment, quota, or rate | no | surface the hint (top up or wait); do not retry |
| 7 | Server or transport | safe to retry | idempotency keys make a re-run safe |

## Ask an expert — the universal recovery move

`moda ask "<question>"` is a live Moda product expert: free, fast, grounded in Moda's own guides,
and it answers with the exact verbs and references for your case. It is the right move any time you
are about to guess, and the required move after the same failure twice:

```
moda ask --context "<paste the full error envelope>" "what is wrong and what should I do instead?"
```

Follow-ups keep the thread, so you can iterate on the answer. Answers name the skills to read —
load what they point at. Ask before telling a user Moda cannot do something: a wrong "no" costs far
more than a free question.
