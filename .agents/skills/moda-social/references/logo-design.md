# Logo design — exploration, presentation, refinement

A new logo, wordmark, brand mark, icon, or favicon is canvas work and lives in
moda-social. This reference owns everything BEFORE the delivered set: how many
concepts to explore, the three techniques that produce them, how they are
presented for comparison, and what a refinement request means. The delivery
mechanics — the 1024x1024 canvas, the authored-vector rule, the primary
lockup / stacked form / 1:1 icon set, the pdf + png exports — stay in the
moda-social body and pick up where this file stops.

Kit files and full identity engagements are moda-brand's work, not this.

## Explore 15–20 concepts, then present them together

Explore **15–20 concepts** across all three techniques below — roughly 3–5
vector-path marks, 3–5 built from geometric shapes, and 5–8 generated — then
present them together so the user can compare and pick.

**Never animate a logo**, on the first pass or during refinement. An explicit
"animate our logo" ask is a different deliverable and routes to
moda-video-motion by name; it never turns the exploration pass into a motion
pass.

## 1. Vector paths

`<path d="…">` in a `moda canvas markup` apply gives precise control for
custom marks. Combine several paths for a complex mark, use `fill="none"` with
`stroke` for outline styles, and offset or scale the whole path with `x` / `y`
/ `width` / `height`.

```xml
<path d="M 0 20 Q 50 0 100 20" stroke="#333" stroke-width="2" fill="none" />
<path d="M 10 80 L 10 20 Q 10 10 20 10 L 50 10 Q 60 10 60 20 L 60 45 Q 60 55 50 55 L 30 55 L 30 80 Z" fill="#1e40af" />
```

The general corpus rule — decorative paths only, from the vetted library in
references/design-quality.md, never hand-drawn glyph or logo path data — is
about tracing *detail*: free-hand path data at icon or illustration density
reliably produces broken-looking clip-art. A logo mark authored here is the
deliberate exception, and it stays on the safe side of that rule by being
geometric construction on a coarse grid — a handful of straight runs, arcs,
and quadratic curves you can name — not a traced glyph or a drawn scene.

## 2. Geometric shapes

`<rectangle>` (`corner-radius="full"` for pills and circles), `<ellipse>`,
`<polygon>` (`sides`), `<star>` (`points`). Layer them with `<layers>` for
depth and mix filled with stroked shapes. The best of these use 2–4 shapes,
not more.

```xml
<ellipse cx="50" cy="50" r="50" fill="#6366f1" />
<ellipse cx="50" cy="50" r="35" fill="#ffffff" />
<rectangle x="0" y="0" width="40" height="80" fill="#f59e0b" corner-radius="8" />
```

## 3. Generated

`moda media generate-image` covers 5–8 concepts, and the variety across them
is the point — vary the STYLE concept to concept rather than re-rolling one
prompt. This surface has no style-preset knob, so the style variation is
carried by the model you pick plus the words in the prompt. Read
references/omni-and-media.md for the roster before choosing, and treat
`moda media models` as the capability source for aspect ratios, resolutions,
and any `--model-params` — never hardcode a model's knobs from memory.

Which model carries which kind of concept:

- **Ideogram V4** — crisp posters, logos, and accurate in-image text; the
  closest fit for clean vector-style and geometric marks. Billed by megapixel,
  so cost tracks output size.
- **Recraft V4.1 Vector** / **Recraft V4.1 Pro Vector** — editable SVG output
  for logos, icons, and illustration systems; the vector-native route when a
  concept should survive as curves.
- **Recraft V3** — style-rich design generation; its vector styles cost 2x.
- **NanoBanana Pro**, **FLUX.2 Max**, or **Seedream V5 Pro** — the
  illustrative logomarks, mascots, and painterly concepts the design-first
  models will not produce.

Spread these style directions across the 5–8, naming the direction in the
prompt: flat vector, iconic, geo-minimalist, minimal illustration, art deco,
bauhaus, monochrome, doodle, halftone print.

Every generated prompt goes to the model VERBATIM — nothing is added or
rewritten — so write the whole instruction yourself. Say "clean logo design on
a white background", say "simple, minimal, vector-style", and name the brand
colors yourself. Describe subject, style and mood; avoid photorealism,
excessive detail, and text in the mark.

Recreate the strongest generated concepts as vectors when they earn it.

## Presentation

All concepts on a **single page**, 3–4 rows of 4–5, logos at a consistent
80–120px on a neutral background.

```xml
<content>
  <column gap="32" padding="40">
    <row gap="32">
      <column gap="8" align="center">
        <!-- mark -->
        <text text="A" font-size="12" color="#666" />
      </column>
      <!-- ...four more -->
    </row>
    <!-- ...three more rows -->
  </column>
</content>
```

Label concepts by letter or by what they are ("Abstract Mark", "Badge") —
**never by technique**; the user shouldn't know which came from which
pipeline. A grid that reads "Vector 1 / Generated 3" tells the user how the
sausage was made instead of what they are choosing between.

Unsure which direction to develop? `moda ask "the user picked two logo
concepts off the grid — how do I develop them into a delivered set?"`.

## Refinement

On a refinement request, iterate on the referenced concept with 2–3 variations
in the same grid. Same page, same 80–120px scale, same neutral ground, same
letter/descriptor labels — the user is comparing against what they already
saw, so changing the presentation changes the question.

Refinement is still not animation.

## How many directions get delivered

After the exploration grid, develop **3 concepts** into the delivered set
unless the user names a different number — the same default social-craft.md
sets for a social one-off. Logo work is a taste-sensitive one-off too, and a
single direction handed back after a 15–20-concept grid throws away the
comparison the grid just bought.

## Hand-off

Once the user picks, the delivered set is moda-social's job: one square canvas
(1024x1024, `--category other`), the mark authored as vector shapes and type
so it stays editable and recolorable, a page each for the primary lockup, the
stacked/short form, and the 1:1 icon, exported pdf plus png at
`--pixel-ratio 4`. Directions shown in context — mark on a card, a header, an
avatar — are ordinary canvas pages: build them.
