# Team templates — start from the design the team already approved

A team template is a canvas someone on the team marked as the approved
starting point for a recurring artifact: the QBR deck, the launch post, the
customer one-pager. Starting from one is how the output comes out looking
like the team's other work — the brand-consistency argument one level up
from a kit: it carries the layout and structure, not just the tokens.

**Two opposite modes live in this file.** AUTHORING a template is designing
the reusable thing; FILLING one is instantiating it for a single use. The
recipes below are the fill mode — they strip placeholders out and replace every
line with content specific to this user. If the ask is "build us a reusable
template", "make this a template we can reuse", "a deck we fill in every
quarter", you are in the authoring mode directly below, and the fill rules
invert.

## Authoring a template — structure, not content

Design STRUCTURE and LAYOUT. Content that only makes sense for one use case is
the failure mode, and it is invisible until someone tries to reuse the thing.

- **Placeholder text NAMES its slot** — "Headline Text", "Product
  Description", "Company Name" — never a real headline about one launch. A
  future filler has to be able to read what goes where.
- **Design for varying text lengths.** Text boxes carry room for typical
  content variations, and spacing stays consistent enough to survive longer
  copy: a layout that only works at the exact length you happened to type is
  not a template. Three cards and four things to say means the layout absorbs
  a fourth card, not that the copy gets cut to fit.
- **Keep placeholder images generic**, and hold contrast and readability with
  the placeholder content in place.
- **Name elements with `metadata.name`** so a later fill can target the slot.
- **Use color variables** for backgrounds and text colors — bind them on the
  edit lane (`variableId`) so one update restyles every page.
- **Apply shared-element edits across ALL pages that share them**: a
  background change, a header or footer edit, is almost never meant for page 1
  only.
- **Preserve reusability**: before finishing, read every page and delete
  anything that only makes sense for one specific use case.

Unsure which parts to make variable? `moda ask "which parts of a reusable deck
template should be color variables rather than fixed hexes?"`.

## When to check (one cheap read, before designing)

The ask matches a recurring artifact type — something a team plausibly
produces again and again (a QBR or board deck, a launch or announcement
post, a customer/product one-pager) — or the user says "our template", "our
usual format", "what do we have". Check templates BEFORE designing from
scratch. One deterministic call; skip it for genuinely one-off asks (a quote
card, a novelty graphic).

## The two verbs (and why there are two)

```
moda template list                                # id, name, [category · N pages] — the browse
moda template pull --output /tmp/templates.json   # the SAME payload, thumbnails fetchable
```

`moda template list` is the model-safe browse. Signature material is scrubbed
from every byte it emits (`--output` included), so its `thumbnail_url` values
cannot be fetched — that is deliberate, not a bug. `moda template pull` is the
thumbnail read: it writes the raw payload, so the signed URLs still work.
Both accept `--limit` and `--cursor`.

## Look at the templates, don't pick by name

Names and categories don't tell you what a template LOOKS like. Same
discipline as brand logos (references/brand.md):

1. `moda template pull --output /tmp/templates.json`, then pre-filter with
   `jq '.data[] | {id, name, category, page_count, thumbnail_url}'` —
   category and page count do the cheap narrowing (a deck ask → `slides`
   templates; a social ask → `social`; a one-pager → a 1–2 page document).
2. Download the 2–4 plausible candidates:
   `curl -o /tmp/tmpl-1.png "<thumbnail_url>"`.
3. **View each image with your own vision** before choosing. A null
   `thumbnail_url` means nothing is rendered yet — judge that one on its
   name, category, and description, or skip it.

Signed thumbnail URLs are use-and-discard: never place one in markup, never
persist one, never hand one to the user. They expire.

## The decision

- **A template that fits the ask beats building from scratch.** Instantiate
  it: `moda canvas create --template cvs_… --name "Q3 QBR — Acme"`. The
  server makes a full copy that arrives with the source's size, page count,
  category, brand kit and content, so `--size`, `--pages`, `--category`,
  `--intent`, `--folder`, `--visibility` and `--brand` are all REJECTED
  alongside `--template` — a copy has no blank page for an `--intent` to
  explain. Place the copy afterwards with `moda drive move`, and rebind its
  kit with `moda canvas brand cvs_… bk_…`.
- The copy is a **regular canvas** — read it, then edit its content through
  the normal flow. Nothing about it is locked or linked back to the source.
- Want a copy of an EXISTING canvas rather than a template? `moda canvas
  duplicate CANVAS_REF --name "…"` is the pure as-is copy (no AI changes) —
  same idea, any canvas you can read.
- **None fit?** Say so in one line ("no team template matched, so I designed
  this fresh") and build from scratch per the usual design references
  (references/design-quality.md). Never force a bad-fit template.
- Tell the user which template you started from — it is a decision they may
  want to correct.

## One item, not a whole template

When the ask names a single existing slide or piece — "add our timeline
slide from the pitch deck", "use the team page we always use", "start from
our 2-page resume" — search the ITEMS inside the team's templates and themes
instead of copying a whole one. An item is one slide or page (of a deck, theme
or carousel), or a whole document (a resume, a menu):

```
moda template search "timeline slide"            # cvs_… page_ids  label — Template  [kind · category · item kind]
moda template search --item-kind team            # browse one kind of slide
moda template search resume --category resume    # whole documents come back as one item
```

Each hit names a canvas and the item's page ids (one for a slide, several for
a document). LOOK at it before choosing
(`moda canvas screenshot cvs_… --page <page_id>[,<page_id>…]`), then copy the
item into the canvas you are working on, passing EVERY page id it lists:
`moda canvas import-pages <target> --source cvs_… --pages <page_id> [<page_id>…]`. The
imported pages arrive with fresh ids after the last page; move them and replace
their content like any other page.

A search with no hits that reports meaning-based matching was unavailable is
not proof the item does not exist — retry it, or search its literal
words. A plain no-hits result is an answer: say so in one line and build the
page per the usual design references.

## Working inside a theme or an instantiated template

The theme already decided the look. Your job is to fill it: pick the layout
that fits each slide's content, start from it, and put the real words in.
Coherence with the theme is the goal here — **a deck where every slide
visibly belongs to the same theme is the success condition, and variety for
its own sake is the failure.** That INVERTS the vary-every-slide default the
deck-design reference teaches: there, a different layout per slide and a mix
of background treatments across the deck is the bar. Inside a theme, that
same variety is the failure.

**Layout can flex; the artistic direction cannot.** Switching a slide between
one and two columns, adding or dropping a bullet, card, or stat, and resizing
a text block so the copy fits cleanly are all expected and good. Keep the
theme's backgrounds, motifs, palette, and type scale exactly as they are.

**Do not rebrand to the brand kit.** If a brand kit is present, use it only
for literal content — the company name, or a logo dropped into a slot the
theme already has. Never recolor, refont, or re-skin a slide to match it; the
theme's identity wins. This is a deliberate override of the brand rules:
references/brand.md says on-brand work means authoring the kit's tokens — its
exact hexes, its font families — into what you write, and **that rule does
NOT apply inside a theme.** Reading the kit's palette and painting it over
the theme's is the exact failure this section exists to prevent. Binding the
kit to the canvas is still fine and still changes no pixels; authoring with
it here is not.

**Building a new slide** is for when no listed layout provides a format the
content needs (a timeline, say, in a theme with no timeline layout). Read an
existing theme page first — `moda canvas read CANVAS_REF` — and echo it: the
same background fill, the same motif shapes, the same accent colors, fonts,
and type scale, so the result is indistinguishable in style from the theme's
own pages and only the format is new. A new slide carrying a chart or a
diagram still gets styled into the theme's palette and type scale
(references/charts.md).

Unsure whether a slide needs a new layout? `moda ask "none of this theme's
layouts fit a timeline slide — do I build a new page in the theme's style?"`.

Copy budget still applies: ≤10 words per bullet, ≤3 bullets per card. When
copy overflows, cut the copy rather than shrinking the theme's type scale.

**Unless the slides came from a deck the user handed over to be restyled.** Then
their wording is the deliverable: keep sentences whole and resize or re-lay-out
the text block so they fit cleanly, rather than cutting to the budget. The
theme's type scale itself still does not move.

If the user's instructions contradict any of the above, follow the user.

## Instantiating under a different brand

**When the active brand kit differs from the brand the template was designed
for, rebranding is implicit and MANDATORY** — instantiating under a different
kit IS the rebrand request, and the user does not need to say "rebrand" or
"change the colors". So treat the user's prompt as describing **only the
content theme**: "announce our permissioning feature" means rebrand the whole
template to the active kit AND rewrite the copy to be about permissioning —
both. The dominant failure mode is reading the prompt as content-only and
leaving the template's original colors and hero images in place. If the
finished canvas still carries them, the run failed.

Rebinding is not this job. `moda canvas brand` records which kit the canvas
belongs to and changes no pixels (references/brand.md); the restyle below is
the separate, mandatory second half.

The template was designed by a professional: change the **content layer**
(colors, fonts, copy, images), never the **structure layer** (positions,
sizes, spacing, grouping, page count, animation presets, and any asymmetric
or overlapping layout patterns).

Work from `moda canvas read CANVAS_REF`, then apply the changes as batched
edit-lane payloads (references/edit-code.md): `update(id, …)` carries `fill`,
`stroke`, a page's `background`, text color, font, text content, `src`, and
`metadata.name`. Batch when one change lands across many nodes.

**1 — Plan.** Enumerate every distinct color hex in use across fills,
strokes, backgrounds and text (typically 3–6 — this is the template's
palette), note the fonts, and identify every logo, hero image and tinted
decorative shape. Read the kit's colors, fonts, logos and images
(`moda brand show BRAND_REF --json`) and count each. Then build a color map:
template color → brand color (primary → primary, dark ground → dark brand
color, neutral → neutral). Zero kit images means you will be generating hero
photos — plan for it now.

Unsure how to map a palette? `moda ask "our brand kit has fewer colors than
this template's palette — how should I map them?"`.

**2 — Colors.** Issue an `update()` for every node using a template color.
**Plain hex colors are the default path, not a fallback** — `update('n7',
{fill: '#0F0F0F'})` — and "the template doesn't define color variables" is
not a reason to skip. Only when a node's fill is genuinely a variable
reference do you update the variable or repoint it (`variableId`, per
references/brand.md). Touch backgrounds, dividers, decorative shapes and
tinted icons too; rebuild gradients with brand stops; re-check text contrast
wherever you changed a background. A kit smaller than the template's palette
still covers it — reuse primary/secondary for the matching slots and pick the
closest neutral for the rest. Only a *complete absence* of a brand kit
justifies keeping the template's scheme.

**3 — Fonts.** Brand heading font for headings, brand body font for body,
keeping the template's sizes and weight choices. No brand fonts → keep the
template's.

**4 — Copy.** Replace every piece of text with content specific to the user —
company name, headlines ("Your Solution" → "Acme's AI-Powered Analytics
Platform"), body copy rewritten in substance rather than name-swapped, CTAs
made specific ("Visit acme.com"), page names retitled ("Cover" → "Acme Corp
— Series A"). Use the user's real numbers when given; otherwise plausible
industry-appropriate placeholders, clearly marked if uncertain. Match the
template's tone, and keep the new copy close to the original's length so
nothing overflows.

**5a — Logos.** Cascade, stopping at the first success: the kit's own logo
files → a logo file the user supplies (ask for it, or upload it with `moda
file upload logo.png` → a `file_…` ref) → a generated mark (`moda media
generate-image`) as the last resort. Keep the template's logo sizing and
placement.

**5b — Hero images, photos and backgrounds.** Cascade per node: a kit image
that semantically matches the position → `moda file search QUERY` for the
team's own uploads, `--source stock` for stock photography (a fitting asset
is cheaper and more on-brand than generating) → `moda media generate-image`
with a prompt combining the brand's aesthetic and tone, the image's semantic
role ("hero photo for a fintech product announcement"), and dimensions
matching the original node. **An empty kit image list is the trigger for the
next step in the cascade, not for skipping the swap.**

**5c — Icons and decorative shapes.** Keep generic structural icons
(checkmarks, arrows); replace topic-specific ones (`moda file search QUERY
--kind icon`). Decorative shapes are color, not imagery — step 2 already
handled them.

**6 — Review.** Every page, not just the first. Confirm you actually issued
the color updates (search back through your own calls — if you never touched
a fill or a background, step 2 didn't happen), that no image node still holds
its original template URL, that no placeholder text survives ("Your Company",
"Lorem ipsum"), that logos aren't stretched, and that no swapped background
broke contrast.

Common mistakes:

- **Keeping the template's colors** because variables aren't defined. Swap
  the raw hex.
- **Keeping the template's hero images** because the kit's image list is
  empty. That is the trigger for `moda file search`, then
  `moda media generate-image`.
- **Repositioning nodes** to "fix" layout. Change content and styling; never
  move or resize a node unless you are correcting a clear bug.
- **Over-generating** — only photo, hero and background nodes go through the
  image cascade, so the template's mix of shapes and icons survives.

## Contributing one back

The template library only stays useful if it grows, and the work most worth
reusing is often the work you just built. When the user calls something
recurring — "we do this every quarter", "make this our standard deck" — flag
it, and it joins `moda template list` for the whole team:

```
moda canvas template cvs_…            # a reusable team template
moda canvas template cvs_… --clear    # un-flag it again
```

- **This is a team-visible curation decision, not a local one.** Every
  colleague sees it in their template list from then on. Offer it when the user
  signals reuse; never flag a one-off, and never flag unasked.
- **Template a COPY when the original should stay an ordinary canvas**: `moda
  canvas duplicate CANVAS_REF --name "QBR template"`, then flag the copy.
  Flagging in place is right when the canvas was BUILT to be the template.
- Tell the user you did it. On a canvas that is not a theme, `--clear` is an
  exact reverse.
- **Check the canvas is team-visible.** `moda template list` hides canvases the
  viewer cannot see, so flagging a private canvas produces a template only you
  can find. `moda drive visibility CANVAS_REF team` shares it; otherwise say
  plainly that you could not.

### `theme` is a different thing — don't reach for it

`moda canvas template CANVAS_REF theme` does not make a second flavour of
template. A theme is a slides-only layout source applied automatically through
a brand kit, and it deliberately **does not appear in `moda template list`** —
so flagging one and then telling the user "it's in your templates now" is
wrong. Use it only when the user is specifically talking about layouts a brand
kit applies for them; `template` is the right answer for everything else.

**Moving a canvas off `theme` is not reversible** — and that means changing it
to `template` just as much as clearing it. Either one clears every deck's link
to that theme and every brand kit that auto-applied it, and re-flagging restores
none of those links. **Check before you write:** `moda canvas show CANVAS_REF`
reports `template_type`, so on a canvas you did not flag yourself, read it first
and only then decide — "make this our standard template" on the team's theme is
the request that quietly breaks every deck using it.

## Honest gaps

- The team may not have templates yet: an empty list is a normal answer, and
  the reply is one line, not an offer to go build a template library.
- The server may report this surface as unavailable (a 404) on an account
  where it is not enabled yet. Treat that exactly like "no templates" and
  move on — do not retry it, and do not mention it to the user.
- Some organizations restrict template management to admins. There the flag
  call is refused with a 403 — tell the user an admin has to make this one a
  template, in one line, and move on. Nothing else about the canvas is
  affected, and reads are unaffected.
