# OTIO — timeline interchange for the Main Edit

The Main Edit round-trips as OpenTimelineIO JSON (`.otio`), the editorial
interchange format Resolve, Premiere and the rest of the NLE world read and
write. Two verbs own the lane:

```
moda edit export CANVAS_REF [-o cut-v001.otio]
moda edit import CANVAS_REF cut.otio [--media-map media-map.json]
                 [--mode replace|append] [--on-unsupported reject|skip]
                 [--dry-run] [--yes]
```

Both are free and deterministic. Export never mutates. An import of up to
100 operations — one batch, which covers most cuts — commits atomically: the
whole timeline applies or none of it does. A bigger import lands per
≤100-operation batch, and a mid-chain failure returns typed with
`import_incomplete` progress accounting: `moda edit read` first, then repair
from where it stopped (a replace-mode re-import of the same file is also
safe — it clears and rebuilds) — never a blind re-run of an append.

## OTIO or edit ops — pick before authoring

- **Building or restructuring a whole timeline, or interchanging with another
  tool → OTIO import.** Assembling a cut from footage, reordering a film,
  round-tripping through Resolve/Premiere, restoring a versioned cut: author
  the complete timeline as one `.otio` document and import it.
- **Nudging an existing timeline → edit operations.** Trim an edge, move one
  clip, swap a source, mute a track: `moda edit read`, then a small
  `moda edit apply` batch (ground-truth operation schema:
  `moda describe "edit apply"`; the worked grammar rides the moda-video
  family's video reference). Never re-import a whole timeline to change one
  clip — a re-import replaces ids and erases another editor's concurrent
  work.
- Unsure? A change you can say in one or two operations is an edit op;
  everything bigger is a new `.otio` version.

## Exporting — versioning, diffing, handoff

`moda edit export CANVAS_REF -o cut-v001.otio` writes the timeline as plain
JSON: version it in files (`v001`, `v002`, …) and diff cuts like code. **Never
overwrite the only copy of a cut** — a new version is a new file, and the
canvas itself always holds the live one. The exported document stamps the
canvas and revision under `metadata.moda`, and clip sources come back as
`moda-composition://<id>` / `moda-asset://<file-id>` URLs, so a re-import of
an exported file needs no media map.

One honesty note for NLE handoff: the exported clip sources are Moda URLs
(`moda-asset://…`, `moda-composition://…`), so a foreign NLE reads the
timeline's structure — tracks, clips, exact in/outs — but shows the media as
offline until it is relinked to local files (the original footage the user
already has, or pages rendered out as mp4). Say so when handing the file over.

Export prints a fidelity line: `everything mapped natively`, or the items
whose payload OTIO's native vocabulary cannot carry — those survive verbatim
under the `moda` metadata namespace (`preserved_in_metadata`), and a foreign
NLE will not honor them. On re-import the restorable carriers (sources, exact
times, the clip envelope, supported transition overlaps and visual tracks) come
back. Linear dissolves map natively; dip-to-black, directional push/slide-over,
and eased dissolves use Custom plus exact Moda metadata. Foreign NLEs may not
render Custom effects. Carriers this surface cannot re-create — unsupported
overlap/transition policy, clip links, a non-default mix — are
RE-REPORTED by name instead (rejected under strict, dropped under skip),
never silently restored and never silently lost. Read the items and tell the
user what a foreign tool, or a round trip, will and won't carry.

## Importing — the media map comes first

An imported clip binds to Moda media one of three ways:

1. `moda-composition://<composition-id>` — a canvas page as a clip
   (`?stream=audio` for its audio); ids come from `moda edit read`.
2. `moda-asset://<file-id>` — an uploaded video (`?stream=audio&index=0` for
   an audio stream). Ids are `file_…` refs from `moda file upload`.
3. **An external file path plus a media map** — the NLE-shaped case: the
   `.otio` references local footage, and `--media-map map.json` tells Moda
   which uploaded asset each file IS. Matching is ranked: `content_hash`
   first, then exact path, then basename — a basename matching two entries
   rejects as ambiguous (real exports carry same-named files in different
   folders), so carry content hashes where you can.

A media-map entry is `{content_hash, path, status, moda_asset_id,
uploaded_at}`. The flow is strict and ordered: **upload the selected media
first** (`moda file upload clip.mp4` → `file_…`), rewrite each entry from
`status: "pending"` to `status: "uploaded"` with the real returned
`moda_asset_id`, then import. There is no other order:

- A clip matching a `pending` entry rejects typed `media_pending_upload`.
- A clip matching nothing rejects typed `media_unmapped`.
- **Never invent or placeholder an asset id** — the upload response is the
  only source of `moda_asset_id`, and a made-up id is a hard failure, not a
  warning.
- A clip referencing an ORIGINAL source that the map covers only through an
  extracted intermediate rejects `media_intermediate_retiming_required`:
  re-reference the intermediate file with intermediate-relative timings (an
  intermediate's clock starts at its own first frame, not the original's) —
  the toolkit's media map records both coordinate systems, so use the
  intermediate's, never arithmetic of your own.
- A fresh upload can lack duration metadata for a few seconds while the
  server probes it; an import rejecting on "no usable duration" heals on a
  brief retry.
- **Audio policy on imported media clips.** OTIO has no per-clip
  audio-policy vocabulary, so a media clip on a visual track imports with
  source audio following the clip — except when the same asset also plays
  from an audio track in the document (the linked-clip pattern), where the
  visual copy imports muted and the report says so (`linked_audio_muted`).
  A SOUNDLESS source refuses the follow-source default, typed
  `unsupported_edit_capability` / `edit.visual.audio-policy` naming the
  clip: set `"metadata": {"moda": {"audio": {"mode": "muted"}}}` on the
  named clips and re-import — the `moda` metadata namespace is how
  wire-only fields (audio policy included) ride an OTIO document.

Flags: `--mode replace` (default) clears the existing timeline — destructive,
so pass `--yes` deliberately on every replace import: under `--json` /
`--no-input` the CLI refuses without it, and a plain interactive run does NOT
stop to prompt, so the flag IS the approval, never ceremony. `--mode append`
adds the imported timeline after the existing cut. `--dry-run` converts and
validates without applying — run it first on any import you did not just
export. `--on-unsupported reject` (default) refuses the whole import when any
item cannot be represented; `skip` imports the rest and reports every item it
left behind.

## The fidelity report — read it, then say it

Every import and export returns `fidelity[]`, and the contract is that
nothing is EVER silently dropped or approximated — every loss is a named
item: `{disposition, code, message, otio_ref}` with disposition `dropped`
(omitted, rest converted), `approximated` (converted with a stated, bounded
loss), or `rejected` (why a strict conversion refused). A rejected import
fails typed `otio_import_rejected` with the items in the error details.

A Moda-exported transition round-trips exactly: the `SMPTE_Dissolve` (or
`Custom`) offsets come back rationally equal, empty report both ways. If
another tool changed a transition's offsets but left Moda's saved metadata
behind, import reports `transition_metadata_conflict` instead of silently
restoring the stale exact values. To keep the external edit, remove only
`duration` and `in_offset` from that transition's `moda` metadata and keep
`type`, `direction` and `easing` — stripping the whole `moda` namespace
destroys a Custom transition's type and it rejects `transition_unsupported`.
To keep Moda's cut, restore the original offsets. Under the default
`--on-unsupported reject` a conflict refuses the whole import; `skip` drops
that transition by name and lands the two clips as a hard cut.

Reading it is not optional, and neither is relaying it: after an import,
surface every `dropped` and `approximated` item to the user in plain words
("the unsupported custom effect between clips 2 and 3 was dropped") instead
of declaring a clean import. An empty report is the only clean import.

Supported transitions and ordered visual tracks render in preview and export.
Unknown transition policy, unpaired/three-way overlaps, and resource-limit
violations decline by name in `validation.diagnostics`; export refuses the
unsupported edit rather than silently omitting it. Inspect every fidelity item
and diagnostic; the video reference carries supported types and authoring examples.

## Exact time — carry rationals, never invent floats

Every Main Edit time is an exact rational: integer-string `value` over
integer `timescale` (`{"value": "1001", "timescale": 30000}`), and OTIO's
RationalTime `value`/`rate` maps onto it. The discipline:

- **Copy source rationals through verbatim.** A trim from a transcript, a
  beat grid, or a toolkit selection arrives as a rational — carry it, do not
  round it through a decimal float and re-derive it.
- Never derive frame boundaries from nominal fps arithmetic — 29.97 material
  is `30000/1001`, and a hand-computed `0.0333…` drifts.
- Equality is rational equality: the server may renormalize to lowest terms
  (`450450/30000` reads back `3003/200` — the same instant), so compare
  values as fractions, never as strings.
- OTIO RationalTime is a double: values a double cannot hold exactly are
  preserved through the `moda` metadata namespace and named in the fidelity
  report rather than silently rounded.

## After the import

1. `moda edit read CANVAS_REF --json` — confirm tracks, clips and
   `validation.diagnostics`; the editor link in every response is the
   user's live timeline, send it.
2. Small corrections ride edit operations against the read's revision — not
   a re-import.
3. Render a draft: `moda export CANVAS_REF --format mp4 --scope main_edit`
   (rules and ceilings in references/export.md). A timeline whose visual
   track has no renderable clip declines typed — an audio-only timeline does
   not export as mp4 here, so keep at least one visual clip on the cut.
4. Export the accepted cut to the next `.otio` version when the user wants a
   file they can take to another NLE, or a checkpoint they can diff.
