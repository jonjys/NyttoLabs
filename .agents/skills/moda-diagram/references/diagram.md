# Diagrams and 2×2 matrices

Two intents, one deterministic toolkit: shapes with embedded text,
`<connector>` for anchored links, `<path>` for custom marks, containers for
lanes, and `moda export --format png|pdf` (png
`--pixel-ratio 2` for docs and chat; pdf when it's headed into a document).

Neither intent is a data chart (that is `<chart>` — load moda-chart) or a
screen (load moda-mockup).

## Diagrams and flowcharts

A diagram's job is to make structure legible at a glance. Clarity beats
exhaustiveness: few primitives, short labels, consistent sizing and spacing,
flow top-to-bottom or left-to-right unless asked otherwise. Detail that
doesn't fit a box belongs in a caption outside the flow.

- Draw links with `<connector>`, never hand-placed lines — connectors stay
  anchored when a node moves, including across later incremental edits.
  Full grammar in references/markup.md; the load-bearing rules: `from`/`to`
  take `@Target:top|bottom|left|right`, and the target resolves in three
  passes — a name from the SAME markup call, a direct node id, or a UNIQUE
  node name already in the scene (take ids and names from `moda canvas
  read`, and prefer ids when names repeat). Both endpoints must sit on the
  same page, and within one call the target element must appear BEFORE the
  connector that references it. `routing="straight|elbowed|curved"`
  (`elbowed` takes `corner-radius`); labels via `text` + `text-position`;
  a connector may sit inside a `<group>`, `<row>` or `<column>` — it is
  out-of-flow there (takes no layout slot) and travels with the container.
- Color carries meaning: neutral for ordinary steps, green for success, red
  for failure, the accent for emphasis only — never on every node.
- Node text is the type anchor; connector labels and captions step down.
- Swimlanes / architecture / multi-section: build real lanes with containers
  and alignment (`group="true"` when a container must be a connector
  target), and keep routing simple enough to avoid crossings.

```xml
<content font-family="DM Sans">
  <rectangle name="Validate" x="160" y="160" width="180" height="56" fill="#ffffff" stroke="#d4d4d8"
             corner-radius="12" text="Validate input" font-size="16" font-weight="600" color="#3f3f46" />
  <rectangle name="Error" x="280" y="300" width="160" height="56" fill="#fef2f2" stroke="#f87171"
             corner-radius="12" text="Error" font-size="16" font-weight="600" color="#dc2626" />
  <connector from="@Validate:bottom" to="@Error:top" routing="elbowed" arrow-end="triangle"
             stroke="#f87171" dash="dashed" text="Invalid" text-position="0.5" font-size="14" color="#dc2626" />
</content>
```

## 2×2 matrices (competitive landscape, quadrant chart)

Build with shapes and text — **not `<chart>`** (it doesn't support this
format). Inside-out:

1. **Axes**: two centered lines forming a cross, 2–3px neutral gray
   (`#cbd5e1`), the matrix filling ~70–80% of the canvas.
2. **Four pole labels** at the axis ends (~28px on a 960×540 slide, muted) —
   and only those four; no ticks, no grid. Desirable poles go **top** and
   **right**. No axes given? Propose a pair that fits the space ("Legacy →
   AI-First" vs "Point Solution → Platform"; "Manual → Automated" vs "SMB →
   Enterprise").
3. **Competitor plots**: 3–6 competitors (more clutters), spread across the
   OTHER three quadrants realistically — never in the winning quadrant. A
   plot is a small filled circle (20–28px, muted) with a name label under
   it; when the user supplies logo files or URLs, upload them
   (`moda file upload` / `--from-url`) and place 40–60px image fills
   instead, one consistent treatment for all. Pick ONE logo theme for the
   whole matrix from the ground it sits on — a light or white background
   takes dark logos so they're visible, a dark background takes light ones —
   and prefer a brand's compact icon variant over its full wordmark lockup,
   which stops resolving at 40–60px. Real logos look far more professional
   than generated icons or plain text, so fetch the competitors' official
   marks by domain (`moda media fetch-logo acme.com rival.com` — up to 10
   domains per call, FREE, each logo a durable `file_` ref; take the icon
   variant) and pull the logo assets a brand kit already carries
   (`moda brand show BRAND_REF --json`) for the user's own brand, rather than
   settling for muted circles; the circle fallback is for the brands the
   domain lookup cannot resolve.
4. **The user's company** in the **upper-right**: larger (56–72px or a 32–40px
   accent circle), name in the accent color, clearly separated.
5. Optional title above, 24–32px bold. Group the matrix elements so they
   move as one unit.

## Verify and deliver

Screenshot and LOOK: no connector crossing a
node, no label collisions, consistent gaps. Deliver png (`--pixel-ratio 2`)
for chat/docs, pdf for print/documents, and the canvas link — diagrams get
edited later more than any other format.
