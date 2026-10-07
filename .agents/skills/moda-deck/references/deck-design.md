# Deck design — making slides good

Every slide is designed from scratch with `moda canvas markup` — there are no templates on this surface, so every slide is yours to compose. Plan **6–12 slides unless the user names a count** (put the agreed count in your plan before creating pages).

## Start with a concept, not a layout

Before writing any markup, decide what makes THIS brand look like itself, and say it in a sentence or two. Pull from the company name (a name is often a literal metaphor — "Nexus" → a node network, "Apex" → angular peaks), the industry's native visual language (data → curves and dot grids, security → shields and locks, biotech → cellular forms), and the brand's personality.

Then commit the cover to that concept: an oversized type-driven composition, an asymmetric editorial split, a full-bleed generated image, a geometric motif built from shapes, a custom pattern. The cover should be distinctive enough that someone could guess the brand from the layout alone. Every content slide then inherits that system — same margins, type hierarchy, palette, and motif language — so the deck reads as one artifact.

**The single most common failure is defaulting to a gradient background, a couple of decorative circles, and a centered or left-aligned title** — for the cover, for every brand, and then again on every slide. If you find yourself reaching for it, stop and think harder about what this brand actually looks like.

## Making it good

- **A bespoke visual beats a bullet list.** The bar is a deck a consultant would charge for: KPI rows, timelines with connectors, comparison tables, annotated diagrams, split image/copy layouts. When content can be shown as structure, show it as structure (`<chart>`, `<table>`, `<connector>` — see references/charts.md and markup.md).
- **Copy budget: ≤10 words per bullet, ≤3 bullets per card.** A slide is read in five seconds, not studied. When copy overflows its box, cut the copy — never shrink type below the typography floor (references/design-quality.md).
- **Restyling a deck you were GIVEN overrides this whole section.** When the slides came from a file the user asked you to beautify, that deck is the deliverable, not raw material. Keep its sentences whole rather than cutting them to the copy budget; keep a slide's content on that slide rather than spreading it across new ones; keep the deck's slide COUNT — the 6–12 plan above is for a deck you are authoring, not one you were handed, and merging their slides says less than they said just as surely as cutting their words does; and use the deck's own images before adding a visual element, divider or accent of your own. The budget and the vary-every-slide bar exist to stop you writing too much and repeating yourself — neither is a reason to say less than the customer already said, or to replace their screenshots and diagrams with decoration.
- **Vary the slides.** Different layout per slide, and a mix of background treatments across the deck — solid, gradient, shader, pattern, full-bleed image. Every content slide earns at least one real visual element.
- **Carry one visual system across the deck.** Whatever the cover establishes — motif, accent color, shape language, margins — echo it in the dividers and accents on content slides.
- Use the brand kit's colors and fonts throughout, and place the logo on the cover and closing slides.

Failure modes to stay out of:

- A gradient background with decorative circles and a centered title — on the cover, and then again on every slide.
- The same layout repeated with only the words swapped.
- Slides that are visually complete but say nothing: all chrome, no argument.

**A themed or template-derived deck inverts all of this** — there, every slide visibly belonging to the same theme is the success condition and variety for its own sake is the failure: see "Working inside a theme or an instantiated template" in the templates reference before filling one.

If the user's instructions contradict any of the above, follow the user.
