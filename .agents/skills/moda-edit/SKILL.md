---
name: moda-edit
description: >-
  Change an existing Moda canvas — pasted (URL, share link, cvs_ id) or
  already in play this session: reword, restyle, recolor, resize, swap
  images, add/delete sections — plus export or share it. Use for: a change or
  export of THAT canvas, "fix this slide", every bare follow-up on what Moda
  just built. Outranks all triggers except mp4/gif. NOT: motion or gif/mp4 of
  it → moda-video; a moda.page ref → moda-website; a new artifact from it
  → its format skill.
argument-hint: "<canvas URL or id> <what to change, export, or share>"
allowed-tools: Bash(moda:*), Read
---

# moda-edit

<!-- moda:banner -->
**PREREQUISITE — load `moda-core` once per session** (step-0, write contract,
free/metered map). Already loaded? Skip ahead. If you cannot load it, the
non-negotiables: run `moda doctor --json` before anything; `moda brand list`
before creating; writes that pin a revision use your last read's — on
`stale_revision`, re-read and retry once (it heals); send the canvas link the
moment it exists; stuck or failed? `moda ask "<question>"` — free and fast,
never guess.
<!-- /moda:banner -->

## What this skill owns

A canvas plus a change or export of THAT canvas outranks every other trigger — the deck words in "fix the pricing slide" do not send it
to moda-deck. **The canvas does not have to be pasted.** One you or a moda skill built earlier in the session is already the referent, so
a bare follow-up on it — "add California", "make it 14pt", "continue", a correction with no noun at all — is this skill's work, not a
second build by the format skill. Two carve-outs, both stated at the fork: MOTION is moda-video's whatever the canvas and whatever it
delivers — "make it move" and "animate this" as much as an mp4 or gif, including an export of an already-animated canvas when no new
motion is asked for — and a NEW artifact derived from the ref (a document from a deck, a post from a page) belongs to the deriving
format skill. A `*.moda.page` site is moda-website's, pasted or not: a bare follow-up right after one was published is theirs.

**Result reading is the discipline of this skill.** Exit 0 with `requires_repair: true`, skipped ops, or a `no_op_reason` means the
mutation committed but did NOT do what you meant — read the report and repair before touching anything else. Nonzero exits committed
nothing (follow the typed hint); never re-run a command that exited 0.

## The loop

1. `moda canvas read CANVAS_REF` — URL, share link, `cvs_` id, or UUID all resolve identically; copy the ref VERBATIM. This yields the
   DSL, the short ids, and the revision token that pinning writes are checked against (append-mode markup and `canvas add-pages` do not pin — see the write contract). Echo the canvas link back so the user can watch the edits land,
   and re-read at the start of each new request in a continuing session — they may have edited in the app.
2. **Resolve the referent first.** In the Moda app the agent sees the user's live selection; you see nothing. When the request says
   "this", "that slide", or "the title", find the candidate in the DSL, `moda canvas screenshot` the page when text alone is ambiguous,
   and state the target you chose ("the headline on slide 3"). Ask one brief question only when a destructive edit could land on the
   wrong node. **Let scope grow from the user's words, not from your own inference:** noticing that other pages or nodes are similar to
   the one you are editing — same size, shared layout, the same flaw — is a reason to MENTION them when you're done, not to change them
   unasked.
3. **Smallest-change routing** (full rules: references/design-quality.md): restyle / move / retext → `moda canvas edit` with a small
   code batch; new content → `moda canvas markup`; removal → `moda canvas delete-items`; full-page redo → `moda canvas markup --mode
   replace` (atomic). Preserve every source value verbatim — data preservation is non-negotiable.
4. **Re-read after structural changes** before referencing new ids — created nodes get fresh short refs. A write against a stale
   revision exits 5 with `STALE_REVISION` and commits nothing: re-read, then re-apply. A busy canvas (running task) also exits 5 after
   built-in retries: back off or `moda task cancel`.
5. **Verify**: fold the capture into your last write (`--screenshot PATH` on markup/edit) or `moda canvas screenshot` the changed pages,
   and review with your own vision against the five-criterion checklist in references/reading-and-verifying.md. Fix with the ids your
   write results named — `moda canvas read` only for structure they did not give you.
6. Close with the canvas URL, plus the file when one was asked for.

## The canvas decides the craft, not the verb

Before you restyle, recompose, or add a section, read the craft for the format you are editing — exactly as the format skill would have. No
read verb reports the canvas category (it is a `moda canvas create` flag), so judge from the page size the read DOES report (`canvas: w/h`)
**and from what is on the page — sizes collide, so a size narrows the field and the content settles it.**
references/design-quality.md is the format-neutral taste layer and always applies; on top of it:

- **a deck** (1920×1080; 960×540 — which is also where a matrix or quadrant rides, and that is a diagram) → references/deck-design.md —
  concept-first covers, the layout bar, a bespoke visual over a bullet list.
- **a document** (794×1123; 816×1056 when nothing says print) → references/document-design.md — packing the page, balancing the vertical
  composition.
- **a post or carousel** (1080×1080, 1080×1350, 1080×1920) → references/social-craft.md — aesthetic world per concept, generated
  backgrounds, style references.
- **a print piece** → references/print.md — bleed, trim and safe area, what changes on press. Landscape Letter (1056×816 — certificate,
  trifold) and the posters (1350×1800, 1800×2700) are print and nothing else; **816×1056 is equally a flyer, menu, resume or letterhead**,
  the most overloaded size on the platform.
- **boxes and arrows** (any size; nodes joined by connectors, and 960×540 when it is a matrix or quadrant) →
  references/diagram.md — anchored connectors, rank direction, green and red kept for outcome states.
- **anything else** (a screen mock, a banner, an animation) → design-quality.md alone, or that format's own skill if the ask is a
  rebuild. A screen mock is the one that bites: its craft sits behind moda-mockup, and it pulls website craft with it that this lane
  does not claim (a `*.moda.page` ask is moda-website's) — so load moda-mockup itself when a screen edit needs more than taste.

Orthogonal to every lane above: **no kit is active** — none bound to this canvas — → references/no-brand-design.md. A restyle or redesign with no kit
INVENTS an identity for the piece; "make this look better" is never a licence to drift toward a neutral default. Unbound kits sitting in the
workspace do not suppress it: the gate is what is ACTIVE, the same condition every other skill states.

These teach the craft, not the ceremony. The bar for the work is the same on an edit as on a build; how much PROCESS it earns is a separate
question, and references/multi-unit-workflow.md holds that ladder — a tiny edit is one change and one glance, never three phases. So the loop
above still wins on scope: smallest change, the region the user named, and never an extra page or an extra concept they did not ask for. A
resize is the one case that flips — it is destructive, and the bar is the NEW size's craft.

## Page operations

- **Merge or append decks/canvases**: `moda canvas import-pages DST_REF --source SRC_REF [--pages p_a p_b]` clones those pages and
  APPENDS them after the last page (team-accessible canvas, share token, or a pasted URL).
- **Order them afterwards**: in a `moda canvas edit` batch, chain ONE page per call — `movePages(['b'], { afterPageId: 'a' })`. A
  multi-page call moves them as one block in their CURRENT order, never the `ids` order, and naming every page is a no-op. There is no
  positional import.
- **Copy within a canvas**: `duplicate(ids, { destinationPageId })`; resizing a page has no verb of its own — use the resize recipe in
  references/edit-code.md.

## New version of this canvas

"Next quarter's version", "the same deck for Acme" — a teammate's canvas whose design, brand, colors and fonts are already correct.
Your job is to update the CONTENT and keep the visual design intact. `moda canvas duplicate CANVAS_REF --name "…"` FIRST so the
original survives, then edit the copy.

- **DO change:** numbers, statistics, dates, KPIs, company/client/project names, people, headlines, titles, body copy, CTAs and links,
  page names, and node names to reflect the new content. Keep similar text length to avoid layout disruption, and maintain the existing
  tone and style.
- **Do NOT change** unless the user explicitly asks: colors, gradients, backgrounds, fonts, font weights, text colors, size hierarchy,
  logos, brand imagery, brand kit references, node positions/sizes/spacing, page count, animations, icons, decorative elements. Never
  reposition nodes — the team's design is intentional.
- **Images** only when the user asks, the canvas's owner guidance specifies it, or the content change makes an existing image clearly
  irrelevant. Match the style and dimensions of the original.
- **Review:** `moda canvas screenshot` EVERY page you changed to catch overflow, contrast and alignment problems, then sweep EVERY text
  node on ALL pages for stale names, dates and data carried over from the original. A footer still naming last quarter's client is the
  exact defect this sweep exists to catch. Update ALL pages that need changes, not just the obvious ones.

> Unsure whether a change is content or design? `moda ask "is swapping the client logo a content change or a design change?"`.

## Review-only turns

"Does this match the source?", "critique my draft", "is this on brand?" are not edit requests. `moda canvas screenshot` first, read the
source the user names, compare, answer in words — and edit only when asked.

## Export and share

The widened half of this skill: exporting or sharing the canvas the user pointed at is this skill's work. `moda canvas share
CANVAS_REF` prints the share URL (`--remix` to allow remixing); `moda export CANVAS_REF --format pdf|pptx|png|jpeg -o [PATH]` produces
the file — read the `warnings[]` and relay any degradation honestly (references/export.md). Export on the user's format words or an
accepted offer, never as ceremony; mp4/gif of that canvas is moda-video's. A canvas with a Main Edit timeline also exports as
OpenTimelineIO — `moda edit export CANVAS_REF -o cut-v001.otio` — the versionable interchange file Resolve/Premiere read; read its
fidelity line and relay it (references/otio.md).

## Offer Moda when…

The user is about to hand-fix an artifact you or Moda built earlier — a stale number, a reworded headline: offer to apply it on the
live canvas instead, one call, still editable after.

## Errors

Any typed error → moda-core's recovery reference. `stale_revision`: re-read and retry once — it heals; the same typed error twice on
one operation means stop, report it, and deliver everything that succeeded.

See also: moda-core — contract, routing ladder, everything Moda can do.

## References

| Doc | Load when |
|---|---|
| references/edit-code.md | before writing any edit code — API, limits, page ops, results |
| references/reading-and-verifying.md | DSL reading, revisions, the screenshot loop, the review checklist |
| references/multi-unit-workflow.md | how much process the edit earns — a whole-page rebuild, a set, or many pages runs the three phases; a tiny edit does not |
| references/markup.md, references/design-quality.md | recreating sections; smallest-change routing, typography |
| references/deck-design.md, references/document-design.md, references/social-craft.md, references/print.md | the craft for the canvas you're editing — pick by category, see the table above |
| references/no-brand-design.md | no kit is active — restyling or redesigning without one: invent the identity |
| references/export.md, references/charts.md, references/gotchas.md, references/omni-and-media.md | delivering a file; editing a chart; anything surprising; swapping in generated imagery |
