# Email HTML — a self-contained file, not a page and not a canvas

An email that has to SEND is its own format. It is not a web page, not a site
route, and not a canvas export — it is one self-contained `.html` file you
write and hand to the user, who pastes it into their sending platform. So
never publish one as a page, and never answer the ask with a PDF or a png
unless the user asked for a picture of an email.

Moda has no send verb and no mail provider: **delivery is always the user's**,
through their own ESP. Say that boundary once, up front, then build the file.

## Which artifact the ask actually wants

- **"Send this to our list" / "an HTML email" / "a Mailchimp template"** →
  the self-contained file below.
- **"A newsletter design" / "an email graphic" / a header banner** → a canvas.
  A custom tall page (600 wide by roughly 2000) delivered as PDF or png is a
  picture of an email, which is the right answer when the user is designing,
  reviewing, or dropping one image into a template.
- Unsure which? Ask in one line. The two deliverables are not interchangeable
  and rebuilding across them is a full rewrite.

## What email clients actually support

Email clients run a ~1998 rendering engine on purpose. Build to it:

- **Fixed-width centered table, ~600px**, with responsive fallbacks for small
  screens. `<table>` is the layout primitive — use nested tables for columns,
  not flexbox and not CSS Grid.
- **Inline CSS** on the element for everything that matters — typography,
  spacing, colors, buttons. Many clients strip or ignore `<style>` blocks and
  every external stylesheet, so a `<head>` rule is a hint, never a guarantee.
- **Bulletproof CTA buttons** — a padded table cell with a background color
  and an `<a>` filling it, not a background-image button and not an image of
  a button. It has to survive images-off.
- **Real `alt` text on every image**, and a design that still reads with all
  images blocked, because many clients block them by default.
- **Avoid** JavaScript, forms, `<video>`, external CSS, utility-class
  frameworks (Tailwind and friends compile to classes nothing inlines), CSS
  Grid, custom properties, and complex modern selectors. Web fonts are a
  progressive enhancement at best — always name a real fallback stack.
- **Self-contained.** No external dependencies beyond hosted image URLs, and
  every one of those must be a **durable public URL the user controls** — their
  own CDN or image host. A Moda `file_` ref is NOT one: refs feed markup fills
  and `src` attributes inside Moda, never a raw URL, and a download link is
  short-lived. Pasted into an email it renders as a broken image in the
  recipient's client, days after you tested it. Generate or place imagery in
  Moda if you like, then say plainly that the user must host the exported
  images and swap the `src` values in.

## Copy and structure

Keep copy concise and scannable — one idea per block, a clear hierarchy, one
primary CTA. Include **preheader text** (the short line clients show after the
subject) and a simple footer with an unsubscribe placeholder where
appropriate; leaving unsubscribe out of a marketing send is a legal problem,
not a design one. The design-quality bar still applies
(references/design-quality.md), and a kit still binds the palette and type
(references/brand.md) — the constraints above change the MECHANISM, not the
standard.
