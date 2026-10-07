# Multi-unit builds — PLAN, EXECUTE, VERIFY once

The loop: **PLAN (one frozen spec + acceptance criteria) → EXECUTE (build every unit) → VERIFY (exactly one round against those criteria) → ship.** Formats differ only in dimensions, page rhythm, and whether the units are cohesive (one artifact) or independent (a set).

**You own the whole thing.** The plan, the criteria, the page structure, every unit, and the final cross-unit pass are all yours, run serially — writes to one canvas never fan out. Nothing here buys speed. What the ceremony buys is the two things a per-page loop cannot give you: a bar declared before the first mutation, and a bounded end to the work.

## Match the weight to the job

Pick the rung first, then follow it. Never apply more process than the task earns.

- **Tiny edit** (single node, copy fix, simple restyle): make the edit, glance at a screenshot of that page, done. No phases, no criteria block.
- **Single artifact** (one post, logo, page): note your bar as 3 criteria or fewer, build, glance for gross defects, at most one targeted fix pass.
- **Multi-unit build or large edit** (deck, doc, carousel, new pages, whole-page rebuilds, sets, variants): the three phases below, in order, never interleaving building and polishing.

Scale VERIFY to the stakes: a throwaway draft skips it; everything else gets the single round, never more.

> Unsure which rung a request lands on? `moda ask "is a 6-page report a single artifact or a multi-unit build?"`.

**Precedence on that third rung.** There, these phases OUTRANK every other per-mutation review/polish instruction you are carrying — in this corpus AND in any other reference or skill loaded this turn. That covers, wherever you meet them: capturing a screenshot after each change and fixing what you see; the layout-balance/dead-zone bar; "review the result, then make small follow-up edits"; and any per-page self-review step. All of them describe the default one-artifact flow; on this rung they collapse into the single VERIFY round. One INVERSION rather than a suppression: the usual edit-vs-recreate bias — route the WHOLE scope through `moda canvas markup` when a change needs non-trivial layout recomposition — flips during the VERIFY fix wave. There, fix each violation with the smallest targeted change and recreate a region only when the violation is itself structural.

Everything those instructions say that is NOT about per-mutation review still applies in full — design quality, markup grammar, data preservation, and each format skill's page count / dimensions / layout structure. On the tiny-edit and single-artifact rungs, the per-mutation guidance governs unchanged.

## PHASE 1 — PLAN (before ANY canvas mutation)

1. **Read the scene.** `moda canvas read CANVAS_REF --summary` — empty (no pages) or populated?
2. **"Restyle / beautify / redesign / make professional" is usually NOT edit-in-place** — the source arrives as a file the user handed you and the canvas is empty. Empty canvas + a source file → `moda file upload PATH` once, read its extracted content (`moda file show file_…`), then build each page fresh; if the source is a PDF or visually rich, get its pixels in front of your own vision and match them before authoring. Populated canvas → edit in place, id-addressed.
3. **Pick the unit shape.** Cohesive artifact (deck, multi-page doc, carousel): shared narrative and one design system under a strict shared spec — never best-of-N. Independent set (poster/ad set, N variations, resize set, batch): the same spec, unit after unit. Explicit variants ("3 options", light/dark): one frozen spec per variant, and no cross-variant verification — the user picks.

### Freeze ONE spec, then follow it VERBATIM for every unit

Write the spec down ONCE, before any unit exists, and build every unit against that written text instead of re-deriving it. On this surface you are both the planner and the builder, which makes the drift easier, not harder: a spec you hold loosely in your head is a spec that shifts between page 2 and page 9.

- **Dimensions + surface** — exact `width×height` and what it is. Slide deck 1920×1080; carousel 1080×1350 or 1080×1080; doc/report/brochure 816×1056 (Letter) or A4 with consistent margins, running header/footer and page numbers; IG story 1080×1920. Default a deck to 1920×1080 and a doc to Letter.
- **Palette — literal hexes only** (markup has no tokens or `var()`). Sources in order: the brand kit (`moda brand show KIT_REF` for the color roles bg/primary/accent/text/muted/border, light/dark, plus `moda brand guides` / `moda brand guide` for the written rules); a `moda web read <url>` of the company's own site; or the source document. Logos: fetch a real company's official mark by domain (`moda media fetch-logo acme.com` — FREE), or ask the user for the files and upload them (`moda file upload`). No source at all → pick one palette and pin it. You are the designer here, and **a designer must never invent a color.**
- **Typography — families + ROLES, no px numerology.** Pin the exact families and which roles are in play. The ladder itself is computed at authoring time from the formula in references/design-quality.md (floor hard, role sizes are starting points) — so the SPEC and the CRITERIA carry ZERO px type values except the floor (quoted as the floor) and values the user or the source document literally stated. Never write a role ladder into your bar: "hero 6–8× body = 120px+" written down IS an invented scale, and a written ladder becomes a policed requirement you will then fail yourself against.
- **Layout skeleton** — grid, page padding ≈ 60–80px, per-page chrome ("logo top-right", "© footer + page number"), card/column grammar.
- **Voice** — tone plus Do/Avoid.
- **Per-unit content** — each unit's message and its exact copy/data. With a source document, extract the VERBATIM text, numbers and citations ONCE and treat that extraction as the record every unit draws its slice from; never re-summarize the source per unit. Honor "keep every word."

**Finish style discovery BEFORE building the first unit.** A designer given an underspecified spec re-derives the look from its own slice and the units drift — and when you are the designer for all of them, that drift is your page 9 disagreeing with your page 2. That is why the spec freezes at the end of PLAN, not during EXECUTE.

### Declare the acceptance criteria

Declare your bar as **VISIBLE TEXT in your response** — before your first tool call, not in private reasoning. A short markdown checklist under a bold **Acceptance criteria** heading, never as XML/angle-bracket tags.

- content: every required text, number and asset — verbatim where the source is fixed
- layout: objective constraints only — margins, alignment, nothing off-page or clipped, no occlusion or overflow
- typography: named families + roles present, floors respected — ZERO px values (a px criterion is valid only when the user or source document literally stated that exact value)
- brand: the palette/font/logo rules that must hold
- per-page: page ordinal or page id → that page's must-haves

These criteria are the ONLY acceptance bar for this turn; VERIFY judges against them, not against general taste. Err toward objective, checkable criteria. Close the plan by fixing the execution order: the units, and which one you build first.

> Unsure what the acceptance bar for a build should be? `moda ask "what acceptance criteria should I declare before building a 12-page investor deck?"`.

## PHASE 2 — EXECUTE

1. **Create the targets yourself, up front.** `moda canvas add-pages` with every page named fixes order and page ids before any unit is authored, and it shows the user the skeleton instantly. Into an existing deck, skip it and key every write to the real page id. Re-read (`moda canvas read --summary`) afterwards — new pages mint fresh short ids and the read refreshes your revision.
2. **Author each unit, one at a time, against the frozen spec.** Each unit gets the spec as written, its own page id, its content slice, and its acceptance-criteria lines — and gets built WITHOUT self-polishing. Serial is not a compromise here: writes to one canvas serialize on the server whatever you do, so a parallel batch buys nothing — it queues behind the canvas lock, or comes back `canvas_busy` when a running task or another process holds it.
3. **Account for every unit, then glance for gross failures only.** One entry per unit, with an explicit error entry for anything that failed, or that exited 0 carrying `requires_repair: true`, a `no_op_reason`, or skipped operations — a silently dropped unit ships as a missing page. On this rung the glance is over the RESULT report, not over pixels: build calls run WITHOUT `--screenshot`, and you run no standalone `moda canvas screenshot` and no review passes between builds. Every capture happens once, in VERIFY.
4. **Defer ALL polish** — spacing, balance, styling nits, minor overlaps — to VERIFY. The only thing that stops the build mid-flight is a hard failure: a unit that never committed, a nonzero exit, a repair report.

Bulk-applying one change across pages with a loop in the edit lane? Do ONE page first and check the result the call already returned before looping — this phase runs no capture rounds between builds, so the returned report is the check.

## PHASE 3 — VERIFY (exactly ONE round — hard cap)

Verify against your declared acceptance criteria; the criteria from PLAN are the review brief, not general taste.

1. **Review every changed unit once.** `moda canvas screenshot CANVAS_REF --page p_a,p_b,… --output verify.jpg` in ONE invocation — the CLI auto-batches past the 3-page server cap — then look at each image with your own vision against the SAME frozen spec you built to, read verbatim: never re-summarize, paraphrase or round its numbers, and never drop a per-element exception. A re-summarized spec makes you flag compliant work as a violation and "fix" a page that was already right. Run the five-criterion review checklist in the reading-and-verifying reference over every page.
2. **Key decisions off concrete, property-level issues — never off a score or a feeling.** Only violations of a declared criterion are defects. Typography is judged by legibility, floors and hierarchy contrast, never by px arithmetic — and never by an element's pixel count in a downscaled screenshot.
3. **ONE fix wave, sized per unit.** A SMALL mechanical fix list (~2 or fewer concrete property-level issues) is a targeted `moda canvas edit` you make yourself. Reach for `moda canvas markup` on that unit only when the fixes are numerous or structural. Smallest change per violation, never a whole-page rebuild for a local defect. The fix wave starts only after ALL pages are reviewed — one review pass, one fix pass, straight through: no retry loop, no "while it still looks off".
4. **Cross-unit coherence, then ship.** Only a whole-artifact look catches these, and only you can take it: palette / type / density drift between units, per-page chrome present on EVERY page, and dense pages audited for over-tight clusters and large empty regions. Fold what you find into the same fix wave.

If a targeted fix fails to clear its violation, do not re-roll the region with a new structural guess: isolate the failing node (`moda canvas read CANVAS_REF --page <id>` plus that page's screenshot), change the smallest property that explains the symptom, and **after two failed targeted attempts ship anyway and tell the user about the residual defect.** After the fix wave, **ship**. Do NOT re-screenshot, re-review, or start a second round: a residual imperfection that violates no declared criterion is not a defect, and subjective polish never justifies another round.

## Ship and disclose

If you skipped VERIFY or shipped with a residual defect, say so in ONE line of your final message — never silently. "Page 7's footer still sits 12px high after two attempts; everything else meets the bar" costs you a sentence and buys the user the one thing a silent ship never can: knowing what to look at.

Close the way every deliverable closes — the canvas URL, the export path when a file was asked for, and the suggested next steps (the working-contract reference, §Delivery).

## Variants and sets

- **Explicit variants** ("3 options", light/dark, "a few directions") get **one frozen spec per variant** — each with its own palette, type roles and layout skeleton — and NO cross-variant verification. They are not competing drafts to be scored against each other; the user picks. Verify each variant against its own criteria, once, and present them together.
- **Independent sets** (an ad set, a resize set, a batch of posters) share ONE spec and differ only in dimensions and the per-unit content slice. The cross-unit coherence pass matters most here: a set whose members drift is the failure mode the whole ceremony exists to prevent.
- **Cohesive artifacts** (deck, multi-page doc, carousel) share one spec AND one narrative. Build the cover/hero FIRST to set the visual language, then build the body pages against what it established — still no review pass between them.
