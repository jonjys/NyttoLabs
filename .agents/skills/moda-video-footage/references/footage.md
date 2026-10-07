# Local footage → a Moda timeline — the Rushes workflow

The lane for "here is a folder of clips, make me a film/reel/highlight".
Analysis is LOCAL: Rushes (`moda rushes …`) ingests, indexes and searches
footage on this machine — no account, no cloud inference, and it never
uploads; originals stay untouched. Moda's side is the opposite boundary: the
canvas timeline, rendering and export live on the server and see only what
YOU upload. Never imply Moda's cloud agent can read the user's disk, and
never bulk-upload raw footage — only the selects that made the cut go up.

The spine, end to end:

```
moda rushes doctor --json                 # 0. toolkit present and healthy?
moda rushes ingest ./footage --project ./index
moda rushes analyze ./index
moda rushes status ./index --json         # 2. coverage before conclusions
moda rushes search ./index "…" --top-k 8 --json   # 3. probe, then choose
moda rushes select ./index mom_… mom_… --name opening --reason "…" --json
moda rushes extract ./index sel_… --handles 2s --out ./selects --json
moda file upload ./selects/…              # 5. selects only, never the folder
# rewrite media-map entries pending → uploaded, author cut-v001.otio
moda edit import CANVAS_REF cut-v001.otio --media-map media-map.json --dry-run
moda edit import CANVAS_REF cut-v001.otio --media-map media-map.json --yes
moda export CANVAS_REF --format mp4 --scope main_edit -o draft.mp4
```

Every verb takes `--json`: stdout is exactly one result-or-error envelope,
progress rides stderr. Parse the envelope, honor the exit status, and consume
returned ids (`mom_…`, `sel_…`) — never guess or retype them. Bounded
`search`/`show`/`status` calls are the evidence lane; dumping raw index files
is never needed.

## 0 — Is the toolkit there?

`moda rushes doctor --json` first. Not installed → every rushes verb exits
typed `rushes_not_installed` naming the fix: `moda rushes install` (installs
the package AND runs its setup — a multi-GiB model provision that states
sizes before fetching; `--no-setup` for a package-only or media-only
install, then `moda rushes setup` gates the analysis verbs). An outdated
install gets typed `rushes_update_required` — same fix. `moda update`
refreshes an installed Rushes and preserves projects, models and caches; it
never downloads models.

When the toolkit cannot be installed (no consent for the download, an
unsupported platform — full inference is Linux x86_64 and Apple Silicon),
degrade honestly rather than failing the ask: watch or sample the clips with
the harness's own tools, pick selects by eye, upload those files, and build
the timeline with edit operations or a hand-authored `.otio`
(references/otio.md). Say plainly that selection was manual, not indexed.

## 1–2 — Ingest, analyze, and trust `status` for exactly what it says

`ingest` inventories the folder into a project directory (put it somewhere
persistent — it is the reusable index, not a temp file); `analyze` runs
segmentation, captions, transcription, embeddings, quality and duplicate
grouping. Captioning is the expensive stage; hours of footage take real time.

- A nonzero `analyze` is not "done with warnings" — read the structured
  error, fix or honestly scope down, and never continue as if analysis
  completed.
- Model provisioning missing (media-only install)? `analyze --only
  segment,quality,cluster` plus `search --lexical-only` still work — say the
  index is lexical/media-only and that semantic search is off.
- `status --json` reports source availability, coverage, recorded stage
  completions and bounded artifact checks. It does NOT promise freshness for
  a different model choice — `analyze` decides that, validates cache
  signatures and repairs damaged outputs. Never wipe or re-setup a project
  just to re-run a query; caches are the point. Re-run `analyze` after
  adding files — existing inference is reused.
- Moved originals? Re-ingest the new paths — content identity relinks them.
  A finished index still answers search/grouping with sources offline;
  `extract` is the step that needs the actual bytes.

## 3 — Probe before you choose

Run a few `search PROJECT "query" --top-k 8 --json` probes shaped by the
brief, and `show PROJECT mom_… --json` on candidates: it hydrates the
moment, its contact sheet, duplicate cluster and transcript evidence. Look
at contact sheets with your own vision wherever the pick matters.

- **Captions can hallucinate and retrieval rank is not confidence** — the
  evidence (sheet + transcript overlap) is the check, not the score.
- **Reason at duplicate-cluster level.** The same action shot three times is
  one editorial slot; the cluster names the alternates, so inspect takes and
  pick the best rather than stacking near-duplicates.
- Filenames are never the identity of footage — moments and hashes are.
- `--filter` narrows mechanically (`speech=true`, `duration>=4`,
  `sharpness>0.7`, `shot_type=wide`) and repeats.

Before selecting, get the brief straight with the user in ONE short exchange:
target duration, tone, and what to prioritize (people? action? scenery?
chronology?). Reuse preferences already given — don't re-interview.

## 4 — Select and extract

`highlight PROJECT --target-minutes N --filter …` builds a candidate pool
(~2.5× the target, one candidate per duplicate cluster — material, not an
assembled film, and it reports a shortfall against the filtered pool).
`select` records the editorial decision: caller order is preserved, every
item carries a reason, and `--items items.json` (or `-`) adds per-item exact
trims. **Trims are absolute source-media time** — exact rationals
(`{"value": "1001", "timescale": 30000}`), within the moment, end-exclusive;
they are NOT offsets from the moment's start, and never derived from nominal
fps or rounded through floats (references/otio.md carries the exact-time
discipline). Identical name+items reuses the selection; changed choices mint
a new id — earlier decisions survive.

`extract PROJECT sel_… --handles 2s --out ./selects --json` re-encodes
frame-bounded intermediates (H.264 CRF 16 default; `--codec prores` when a
grade or another NLE is downstream) and writes `media-map.json` with
`pending` entries. Two coordinate systems live in that map: the original's
and the intermediate's — an intermediate's clock starts at its own first
frame, so downstream timeline references use the intermediate-relative
ranges the map records, never original times. `validate PROJECT --json`
before handing anything on.

**Whole-source upload is the simpler road when the folder is a few small
files** and the user wants most of them: skip extract, upload the originals
themselves, and trim on the timeline. Extract earns its step when sources
are long, heavy, or the cut uses slivers of them. Either way the user chose
uploads of SELECTED media — never treat that as permission to upload the
whole folder.

## 5 — Upload, map, import, render

1. `moda file upload` each select (or chosen original) → `file_…` refs.
2. Rewrite the matching media-map entries `pending` → `uploaded` with the
   real returned `moda_asset_id` — never invented, never placeholders; a
   `pending` entry is a typed import rejection (references/otio.md).
3. Author the timeline as `.otio`, versioned (`cut-v001.otio`, `v002`, …;
   never overwrite the only cut), and import with the media map — dry-run
   first, then the same command with `--yes` (replace mode clears the
   existing timeline and refuses unconfirmed). Read the fidelity report and
   surface anything dropped or approximated.
4. Draft render: `moda export CANVAS_REF --format mp4 --scope main_edit`
   (ceilings and warnings: references/export.md). LOOK at the draft —
   sample frames from the file and judge against the brief
   (references/reading-and-verifying.md when the harness has no vision).
   Iterate: small fixes as edit operations, a recut as the next `.otio`
   version.
5. Deliver the live canvas link FIRST — **the human always gets an editable
   timeline**, not just a file — then the rendered mp4. Music beds and VO
   ride audio tracks on the same timeline (upload → `media-stream` clips);
   generated scores are moda-audio's lane.

Selections, the index and the media map are the project's memory: keep them
with the project directory so the next revision reuses every cache and every
decision.
