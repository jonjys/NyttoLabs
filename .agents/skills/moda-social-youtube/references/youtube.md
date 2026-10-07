# YouTube — thumbnails and channel art

Two deliverables, two completely different constraints.

## Thumbnail — 1280×720, judged at ~320px

The brief is never "a 1280×720 image". The brief is "an image that works at 320
pixels wide, in a grid, next to eleven competitors". Everything below follows
from that.

- **≤4 words** of on-image text. Three is better. A full sentence is a failure
  mode, not a style choice.
- **Type ≥120px** at 1280 wide (that is ~30px at display size), heavy weight,
  high contrast against whatever sits behind it. No thin or light faces.
- **One subject, one focal point**, filling at least a third of the frame. A
  face works because it survives the shrink; a wide scene does not.
- **Contrast beats decoration**: a saturated field behind a cut-out subject reads
  at any size. Gradients that are subtle at full size turn to mud at 320px.
- Avoid the bottom-right corner: the duration pill sits there.
- YouTube also renders thumbnails at 168×94 in sidebars. If the piece survives
  320px it usually survives that; check the title, not the art.

**The 320px check is the verify step, not an optional nicety**: screenshot, shrink
it, and look. Fix what disappears.

## Channel banner — 2560×1440 with a 1546×423 core

The banner is cropped differently on every surface, and only one region survives
all of them:

| Surface | Visible region |
|---|---|
| Mobile | the centred 1546×423 core |
| Desktop | roughly 2560×423 — the core plus left/right extensions |
| TV | the full 2560×1440 |

So: **everything that carries meaning — channel name, tagline, upload cadence,
logo, handles — lives inside the centred 1546×423.** Background, texture, colour
fields and decorative elements extend outward to fill the full frame for the
desktop and TV crops. Nothing outside the core may be load-bearing.

Practical shape: author the core first as if it were the whole design, screenshot
it, prove it reads, and only then extend the field outward.

Also keep meaningful content ~20px inside the core's own edges — the crop is not
pixel-exact across devices.

## A series of thumbnails

The value is in the SYSTEM, not the image: one type treatment, one colour rule,
one subject-placement rule, and a slot that changes per episode. Save the winner
as a team template (moda-templates) and instantiate per video — that is the
difference between a thumbnail and a channel.

## What this file does not own

A YouTube **banner ad** is paid media: moda-social-ads. A video, an animated
intro, or a motion channel trailer is moda-video. Markup grammar lives in
`references/markup.md`.
