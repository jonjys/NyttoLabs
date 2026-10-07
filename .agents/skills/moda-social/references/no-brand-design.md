# Visual identity without a brand kit

There is no kit: the workspace has none, the user declined one, or they said
"no brand". Read that as *nobody has told you what the brand is yet* — never as
neutral, plain, or safe. "Unbranded" is the routing word, not the design brief.

When no brand kit is provided, you MUST NOT fall back to generic,
corporate-looking design. Instead, **invent a distinctive visual identity**
tailored to the specific request. Treat these requests as a chance to show a
high visual ceiling: polished, memorable, and clearly designed rather than
merely assembled.

## Your process

Before creating anything, spend a moment thinking about:

1. **What is the subject/topic?** — Historical figure, startup, personal brand,
   educational content, event, etc.
2. **What mood and tone should the design evoke?** — Bold and energetic?
   Refined and authoritative? Playful and approachable?
3. **What visual world does this topic belong to?** — What colors, textures,
   imagery, and typography would a specialist designer choose?
4. **If this is a slide deck, what layout system should govern it?** — Default
   to an editorial / magazine system unless the brief clearly calls for product
   UI mockups, dense financial tables, or strict technical diagrams.

Then form a quick creative thesis about the most visually interesting version
of the request that still feels appropriate, and carry that direction through
every element. Name that direction in the delivery note ("1930s
expedition-journal type over cold cartographic blues"), so a revision request
has something to aim at and the user can see a decision was made.

## Key principles

**Color palette**: Choose colors that are specific and evocative, not safe
defaults. Avoid generic blue/gray corporate palettes. Draw color inspiration
from the subject matter, but default to a palette with clear roles and clear
contrast, not just a pile of tasteful related tones.

**Create contrast through two color worlds, not just light/dark**: When a topic
strongly suggests one obvious palette family (sepia, parchment, bronze,
burgundy, forest, navy, jewel tones, dusty earth tones), do not let the whole
design live inside that family. Use one family for atmosphere and a second,
distinct but compatible family for structure or emphasis. In practice, warm
topic-native palettes usually need a cool counter-family, and cool topic-native
palettes usually need a warm counter-family. Good systems often sound like
"paper + ink + cobalt", "bone + oxblood + deep teal", "stone + midnight blue +
vermilion", or "terracotta + blue-gray + cream" rather than "five adjacent
shades of sepia."

**Palette construction pattern for no-brand-kit work**: Decide on color roles
before filling the canvas. A strong palette usually has: (1) an atmosphere
family that gives the piece its subject-specific mood, (2) a structure family
that carries backgrounds, text blocks, surfaces, rules, or data with strong
readability, and (3) one concentrated accent family for emphasis. Let the
topic-native colors dominate only one of those roles, not all of them.

**Palette anatomy**: 1–2 primaries, 2–3 secondaries, 1–2 high-contrast accents,
a **tinted** neutral scale (warm gray, blue-gray — not plain gray), light and
dark grounds, and a **shade ramp for each hero color**. Derive the colors from
the strategy — a NASA-manual concept gets muted ochres, off-whites and
technical blues, not trendy colors. Check contrast on both grounds. Write the
hex values down before you author: markup takes literal hex (`$name` and
`var()` do not resolve there), so the same strings should reappear on every
page of the artifact.

**Reject one-family palettes**: If 3 or more major roles (background,
surfaces/cards, borders/rules, headings, accents, decorative motifs) all come
from the same color family or temperature world, discard that palette and
rebuild it. "Brown + gold + beige + burgundy" is still one family. "Navy +
slate + steel + muted blue" is still one family.

**Counter-family requirement for topic-heavy briefs**: When the subject
naturally suggests a strong palette family, pair it with a structurally
distinct counter-family for surfaces, typography, dividers, or emphasis.
Neutral anchors alone do NOT satisfy this requirement if the overall impression
still reads as one color world. The second family should usually shift
temperature as well as hue family, not merely become lighter or darker. It must
appear in meaningful roles such as surfaces, headings, dividers, charts, or
CTAs, not only in one tiny accent detail.

**Contrast before palette harmony**: Before committing, sanity-check the actual
pairings that matter: headline on background, body text on surfaces, CTA
against its surrounding area, and key charts or icons against the canvas. If
those pairings do not read instantly, increase contrast. If the whole palette
could be described in one noun phrase like "all sepia" or "all jewel tones,"
add a counter-family and rebuild.

**Typography**: Three roles — display/wordmark (the most expressive choice and a
genuine differentiator), title/heading, and body (readable at small sizes).
With no kit there is no exemption from the overused-face ban in
references/design-quality.md: its carve-out is for kits that name those
families, and you have none. Dig deeper into the Google Fonts catalog for
distinctive choices. Compute the size ladder from the canvas exactly as
references/design-quality.md prescribes, and honor its floor.

**Minimal is not the same as conservative**: If the user asks for something
minimal, interpret that as refined, intentional, and high-taste, not plain or
timid. Clean work can still have dramatic scale, sharp composition, beautiful
type, elegant contrast, and standout visuals.

**Imagery**: Use `moda media generate-image` to create custom visuals whenever
imagery would materially improve the work (model choice:
references/omni-and-media.md). Stock-photo-style imagery kills distinctiveness.
Generated imagery that matches the topic's visual world is far more compelling.
Custom imagery, diagrams, mockups, charts, and visual metaphors are often the
fastest way to make the design feel premium. If a real company is mentioned,
fetch its official mark by domain — `moda media fetch-logo acme.com` — or ask
the user for the file (`moda file upload`) and look in team assets (`moda file
search`); never generate an imitation of a real mark, and never place one you
have not seen.

**Default to at least one image-driven moment in slide decks**: Include at
least one meaningful generated image, most often on the cover or in the first
few slides, unless the user explicitly wants a text-only treatment or the
format is clearly print-first. Do not default to text-only covers when a
tasteful visual would elevate the work. Print-first formats (PDFs, one-pagers)
are the exception: don't force a hero image — crisp icons, simple system
diagrams, badges, mini charts, and callout boxes usually carry them better.

**Reach for charts**: When the content involves metrics, comparisons, trends,
or projected change, show them rather than describing them — the chart grammar
and palette rules are in references/charts.md.

**Editorial / magazine is the default slide system**: For no-brand slide decks,
start from an editorial / magazine layout system unless the brief clearly calls
for product UI mockups, dense financial tables, or strict technical diagrams.
Use asymmetric columns, oversized headlines, kickers, sidebars, captions, pull
quotes, strong section dividers, full-bleed imagery, cropped image windows, and
varied text density across slides. The deck should feel authored and paced like
a designed publication, not a sequence of evenly spaced title-and-card layouts.

**Sparse prompts still deserve visuals**: If the prompt is underspecified, do
not use that as a reason to avoid imagery. Infer a tasteful visual direction
from the topic and create a fitting hero image, background image, or editorial
visual motif.

**Layout and composition**: Use bold, confident layouts. Oversized typography,
full-bleed images, asymmetric compositions, and generous whitespace all create
visual interest. Avoid cookie-cutter centered layouts with small text.

**Visual enrichment**: Do not let content-heavy requests collapse into walls of
text or repetitive card grids. Break up information with diagrams, process
visuals, mini charts, before/after moments, annotated mockups, editorial
framing, or other forms that help the content feel alive.

**Motifs and details**: Consider recurring visual elements that tie the design
together: geometric patterns, illustrated accents, consistent icon styles,
borders, textural backgrounds, custom dividers, or subtle visual systems that
make the work feel authored. The vetted decorative paths and the shader
directory in references/design-quality.md are the cheapest way to get one.

**Aspirational interpretation is allowed**: In exploratory or trial-use
scenarios, it is OK to make tasteful creative leaps. If the user has not
supplied a strong brand, you should still present something that feels like a
plausible, premium brand world rather than waiting for perfect inputs.

**Use topic-native visual inference**: When the subject is historical, civic,
legal, educational, cultural, or geographic, infer visuals from recognizable
symbols, places, artifacts, maps, documents, flags, architecture, landscapes,
or editorial illustrations tied to the topic. A sparse prompt should still
produce something visually grounded.

**Verify against the thesis**: `moda canvas screenshot` the pages and look at
them with the thesis in hand. Could someone guess the subject from the design
alone, with the words removed? Does more than one color family carry real
structural weight, or did the palette collapse back into one world during
authoring? A "no" to either is a palette or cover rebuild, not a nudge.

## Examples

Two directions, one topic-native and one modern-product. Both show the same
move: let the topic set the atmosphere, then bring in a second family so the
system has structure and snap.

**"Make a slide deck about Alexander the Great"** — a topic with a strong
built-in palette

- Colors: imperial purple and bronze can shape the atmosphere, but bring in
  stone/near-black for structure and a cool counterpoint such as cobalt for
  maps, dividers, or data moments; keep antique gold for accents and
  highlights. Bad: parchment + brown + bronze + burgundy everywhere. Better:
  parchment + near-black + cobalt with small brass accents; or bone + oxblood +
  deep teal with bronze used sparingly. The subject should still feel
  historical without reading as one continuous sepia wash.
- Typography: a strong serif or classical display font for headings (e.g.,
  Instrument Serif, Cormorant Garamond); clean sans-serif for body (e.g.,
  Source Sans 3)
- Imagery: use `moda media generate-image` extensively — battle scenes, ancient
  maps, Macedonian landscapes, classical sculpture aesthetics
- Structure: timelines for conquests and historical progression; full-bleed
  generated imagery as slide backgrounds
- Motifs: Greek key borders, laurel wreath accents, stone/marble textures

**"Make a slide deck about Acme.io, our new startup that does AI-powered
logistics"** — a topic with no built-in palette

- Colors: derive from the product's domain — e.g., electric blue + neon green +
  dark navy for a tech/logistics feel, or warm orange + slate for an
  approachable-yet-technical vibe
- Typography: modern tech-forward fonts; geometric sans-serifs work well for
  startups (e.g., Switzer, Plus Jakarta Sans, Urbanist)
- Imagery: generate custom illustrations showing the product concept — supply
  chains, AI networks, logistics flows. Not generic tech stock imagery, and not
  the handshake/office-building genre
- Layout: clean and modern with generous whitespace; use data visualizations,
  charts, and diagrams to explain the product
- Motifs: network/connection graphics, subtle grid patterns, node-and-edge
  visuals that echo logistics networks

## What to avoid

- **Generic corporate blue**: Unless the content is actually about a corporate
  brand that uses blue
- **Safe, forgettable palettes**: Gray + one muted accent color = boring
- **Analogous-but-muddy palettes**: Beige + tan + brown + gold + burgundy can
  feel tasteful but often lack enough separation unless anchored by a true
  light or dark
- **One-family palette collapse**: If every major surface, border, accent, and
  decoration comes from the same warm or cool family, the work loses snap even
  when each individual color is attractive
- **Using neutrals as an escape hatch**: Ivory, black, stone, cream, charcoal,
  or espresso do not automatically fix a monochrome palette if all expressive
  color still comes from one family
- **Counter-families that are too timid**: If the "second family" is only a
  tiny accent or is too close in temperature to the first, the deck will still
  read as monochromatic
- **All-midtone systems**: If every color is muted and medium-value, hierarchy
  collapses
- **Template-looking output**: If it looks like it came from a default
  presentation theme, you've failed
- **Overused Google Fonts**: Avoid the fonts everyone defaults to — they
  instantly make a design feel generic. Do not use: Inter, Roboto, Open Sans,
  Lato, Montserrat, Poppins, Raleway, Oswald, Nunito, Fraunces, or Playfair
  Display. Dig deeper into the Google Fonts catalog for distinctive choices.
- **Skipping visual enrichment in image-forward formats**: When there's no
  brand imagery to work with, generated visuals often become your primary tool
  for creating visual interest. Use them liberally where the format supports it.
- **Using accent colors as base colors everywhere**: Topic-native hues should
  usually punctuate the system, not cover every surface

## When you're torn

Identity invention is taste-sensitive. If you're unsure between two visual
worlds, or the thesis isn't landing after a verify pass, ask Moda's design
expert before shipping something safe: `moda ask "<your question, with the
canvas link>"` — it's free, answers in seconds, and knows these rules.
