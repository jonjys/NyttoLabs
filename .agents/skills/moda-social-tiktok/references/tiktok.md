# TikTok — 9:16 stills, safe areas, and cover craft

Everything on TikTok is 1080×1920. There is no second size.

The mistake to check for every time is the right icon rail: a headline centred
on the 1080 width sits partly under the icon column. Centre on the SAFE width
mapped below (x 120–840), never on the canvas.

<!-- moda:gen-tiktok-safe-area -->
## The safe-area map (the reason this file exists)

TikTok has UI that floats above the creative that can cause conflict with the content of the graphic. Listed below are reserved zones which should be avoided by content as described below. Safe areas are also described. The safe area has some padding between it and the reserved zones, so there is some wiggle room.

### Safe zone

TikTok's UI overlays large portions of the canvas. Anything that *must* be seen — text, logos, faces, CTAs, focal points — must live inside the safe zone or it will be hidden behind UI.

Canvas: 1080×1920 (9:16 vertical).

#### Normal post

Reserved zones (covered by TikTok UI — do not place essential content here):
- **Top** — y 0–190 (status bar + tabs)
- **Right** — x 900–1080, y 190–1780 (like / comment / share / profile rail)
- **Bottom** — y 1780–1920 (caption, CTA button, nav bar)

**Safe zone: x 120–840, y 252–1742** (720×1490).

#### Ad post

TikTok ads may have extra CTA UI at the bottom which needs to be accounted for. If a user didn't state it was an actual ad, assume it's a normal post.

Reserved zones (covered by TikTok UI — do not place essential content here):
- **Top** — y 0–190 (status bar + tabs)
- **Right** — x 900–1080, y 190–1400 (like / comment / share / profile rail)
- **Bottom** — y 1400–1920 (caption, CTA button, nav bar)

**Safe zone: x 120–840, y 252–1280** (720×1028).

### Design full-bleed, keep focal points safe

The safe zone is not a margin. The design should still bleed edge-to-edge — only the critical content needs to stay inside.

**Fine outside the safe zone:**
- Background colors, gradients, full-bleed photos
- Decorative patterns, textures, repeating motifs
- Non-essential parts of an image (edges of a subject, ambient background)
- Elements meant to bleed off the canvas

**Required inside the safe zone:**
- All text and copy
- All logos and brand marks
- The focal point of any photo or illustration (face, product, hero subject)
- CTAs, buttons, prices, key info

A full-bleed photo of a person is great — but the face must sit inside the safe zone, not behind the right-rail or under the caption area.

### Quality bar

- No essential element clipped by a reserved zone.
- The composition feels full-bleed, not a small island floating in the middle of the canvas.
- Hero text reads at a glance on a phone.
<!-- /moda:gen-tiktok-safe-area -->

## Covers

A cover frame does three jobs at three sizes, and the smallest one wins:

1. Full screen while the video loads — the composition.
2. A profile grid tile at roughly 1/6 scale — the title and the subject.
3. A search result thumbnail, cropped further.

So: ≤5 words of title, set large and high-contrast, placed in the upper-middle
of the safe zone; one clear subject; no thin type, no long sentences. Judge the
screenshot shrunk to tile size before delivering — a cover that only reads full
screen is a failed cover.

## Photo-mode posts

TikTok photo mode is a swipeable still set. It follows the carousel discipline
in the moda-social parent (one design system, prove page 1 first) with two
TikTok-specific rules:

- Every page is 1080×1920 and obeys the post safe zone — the UI does not go away
  between photos.
- The deliverable is a **zip of per-page pngs** (multi-page png export), one
  image per photo, in order.

## Typography at 1080×1920

Body ≈ 48px, floor 32px. Vertical video is read in motion, often one-handed, and
the platform compresses hard: below the floor, strokes disappear. Titles run
90–160px. Set type in the safe width and let backgrounds bleed.

## What this skill does NOT own

An actual TikTok **video** — the clip itself, a motion cover, anything delivered
as mp4 or gif — is moda-video: render format outranks platform. This lane owns
the still: the cover frame and photo-mode pages.

## Where the rest lives

Markup grammar: `references/markup.md`. Type ladder, imagery, shader directory
and the AI-slop list live in the design-quality reference fanned to the parent.
