# The metered lanes — media generation and web research

These are the metered lanes — `moda media *` and `moda web *` — and they are the QUALITY levers on this surface. Generated imagery, footage, and research are how good work gets made: reach for them wherever they serve the deliverable, never ask permission first, and report the usage receipt after each call as information (`usage.class: "metered"` on the response). Cost is a topic only when the USER raises it.

The one fact worth carrying: a metered call can fail the billing precheck — exit 6, the quota lane (`insufficient_credits` and friends) — which means the TEAM is out of credits or has hit a plan cap, not that you did something wrong. Say so plainly, surface the hint verbatim, and stop — never retry it, and never quietly drop the quality lever and deliver the lesser thing instead.

## `moda media` — raw media operations (metered unless marked FREE)

```
moda media generate-image --prompt "..." --model M [--aspect-ratio R] [--resolution T]
                          [--num-images N] [--model-params JSON] [--output PATH]
moda media edit-image --prompt "..." --model M --source FILE_REF|URL|PATH [same knobs]
moda media generate-video --prompt "..." --model M [--duration S] [--aspect-ratio R]
                          [--resolution T] [--generate-audio] [--seed N]
                          [--image REF] [--end-image REF] [--reference REFS...] [--output PATH]
moda media generate-audio --mode text_to_speech|text_to_music|text_to_sfx --prompt "..."
                          --model M [--voice V] [--duration S] [--num-samples N]
                          [--model-params JSON] [--output PATH]
moda media remove-background FILE_REF|URL|PATH
moda media fetch-logo DOMAIN... [-o PATH]                                        # FREE
moda media upscale FILE_REF|URL|PATH [--scale 2|4]
moda media upscale-video FILE_REF|URL|PATH [--resolution 720p|1080p|1440p|2160p]
moda media outpaint FILE_REF|PATH --aspect-ratio R | --expand-top/-bottom/-left/-right PX [--mode high|fast]
moda media reframe-video FILE_REF|URL|PATH --aspect-ratio 16:9|5:4|1:1|4:5|9:16 [--resolution 720p|1080p]
moda media video-frames FILE_REF|PATH [--count N | --timestamps MS...] [-o DIR]   # FREE
```

**`moda media models` is the capability source**: each model's supported aspect ratios, resolution tiers, durations, and extra `--model-params` come from it — read it before passing per-model knobs; never hardcode capabilities from memory.

`moda media fetch-logo` gets a real company's OWN logo files by domain — up to 3 variants (wordmark, icon, light/dark) per domain, up to 10 domains per call, each saved as a durable `file_` ref. Use it whenever a deliverable names a real company: never generate a logo, and never retype one as text. It is a DOMAIN lookup, not a company-name search — a wrong domain returns THAT company's real logo rather than an error, so check the brand name echoed back on each result. It is FREE — no credits, at any batch size — so reach for it by default rather than rationing it. Domains are independent: one with no brand data reports its own error while the rest still return logos. Read each logo's `warning` — a wordmark served as live SVG text rasterizes without fonts and lands blank on canvas, so set that wordmark as a text node instead. For the CALLER's own brand, `moda brand show` already holds the kit's logos; this verb is for third parties.

`moda media outpaint` EXTENDS an image past its own borders — the new margins painted as a continuation of the frame. Give it a target `--aspect-ratio` **or** per-side pixels, never both (passing both is refused). It takes no prompt: it continues what is already in frame and cannot be steered with words — to change what is IN the image, use `edit-image`. Two limits, and the second is the one that bites: 2048px on any one side, and an expanded canvas within 4MP (4 x 1024 x 1024 pixels) — past either the call is refused naming the size, never shrunk to fit, and a source already at or past 4MP has to be downscaled before it can be extended at all. The price counts the source AND the rendered canvas together, rounded up to the megapixel, so a bigger source costs more even for a small expansion and the source must be one Moda has measured: a `file_` ref or a local path, not a bare URL.

Results return durable refs that feed markup `image(...)` fills and `src` attributes directly — never a raw URL.

### Choosing an image model

`--model` is **required — there is no "auto"**. The authoritative model list, with each model's aspect ratios, resolutions, and controls, comes from the CLI itself (`moda media models`) — defer to it; never hardcode capabilities from memory. Strengths in one line each, to route the choice:

<!-- generated: image-model roster. Authored in backend/app/services/media/image/ (label + roster_line, falling back to description); regenerate with: uv run python -m scripts.render_model_roster -->
- **NanoBanana 2 Lite** — Fastest, lowest-cost baseline; the default when nothing else is demanded.
- **NanoBanana 2.1** — The balanced Gemini tier — better than Lite for everyday work, well short of Pro's price.
- **NanoBanana Pro** — The Gemini premium tier for the most complex, high-fidelity briefs, and the dearest of the three.
- **GPT Image 2.0** — Strong in-image text rendering.
- **Ideogram V4** — Crisp posters, logos and accurate in-image text. Billed by megapixel rather than per call, so cost tracks output size.
- **FLUX.2 Pro** — The FLUX.2 workhorse: general-purpose quality with multi-reference editing, at the family's lowest price.
- **FLUX.2 Flex** — The only image model with sampler control: guidance scale and inference steps.
- **FLUX.2 Max** — The FLUX.2 family's top tier for realism and precision, and its dearest at ordinary sizes.
- **Seedream V5 Lite** — The Seedream workhorse: full-size output at the family's lowest price.
- **Seedream V5 Pro** — More detail per pixel than Lite, but a smaller maximum size; pick Lite for large canvases.
- **Recraft V3** — Style-rich design generation and single-image editing; vector styles cost 2x.
- **Seedream 4.5** — The previous Seedream generation, kept for its own look rather than its size.
- **Recraft V4.1** — Design-first raster artwork for production — the entry Recraft V4.1 tier.
- **Recraft V4.1 Pro** — Recraft V4.1 for hero imagery, campaigns and print, at six times the entry tier's price.
- **Recraft V4.1 Utility** — A faster, lighter Recraft V4.1 for high-volume work, at the entry tier's price.
- **Recraft V4.1 Utility Pro** — Pro-grade Recraft output on the faster Utility runtime, at Pro's price.
- **Recraft V4.1 Vector** — Editable SVG output — logos, icons, and illustration systems.
- **Recraft V4.1 Pro Vector** — Large-format editable SVG for detailed professional illustration — Recraft's top vector tier, and its dearest route.
- **Grok Imagine** — Cheap generation and multi-image editing — the entry Grok tier.
- **Grok Imagine 2.0** — The current Grok generation, priced on both quality and resolution.
- **Grok Imagine Pro** — The quality tier of Grok v1 — the same surface, dearer output.
- **Kling Image V3** — Kling's image line at one flat rate, with single-image editing.
- **Kling Image O3** — The 4K Kling line, with a multi-image edit list; 4K costs double.
- **Ideogram 4.5** — Ideogram's newest model: strong typography, and edits that follow a source image. Flat per image at any size, priced by quality.
<!-- /generated: image-model roster -->

### Image rules

- Your `prompt` goes to the model VERBATIM — nothing is added or rewritten. Write the complete instruction: subject, style, composition, and (for edits) exactly what to preserve.
- Aspect ratio / resolution / model params are per-model enums — copy values exactly from the model's capability line; an unlisted ratio fails the call rather than snapping.
- There is no separate edit tool: to edit an image generatively, pass it as a source image and describe the complete edit. Source images are modified/preserved content; reference images guide style, palette, or composition.
- Each result returns an image ref — the canonical handle. Place it in markup (`<image src="…"/>`), pass it to later verbs, and never invent, alter, or reconstruct a ref.
- Inspect the returned image with your own vision before claiming visual details the prompt doesn't guarantee. If it misses, retry with a refined prompt or a different model — nothing falls back silently.

### Audio rules

- Reach for `generate-audio` when the deliverable wants a voiceover, narration, background music, a jingle, a sound effect, or an ambience. Music or an effect may come unprompted when a video or slideshow obviously needs one; narration only when the user asked for it or said yes when you offered it — never announce a voiceover on your own.
- `--mode` is **required and stated, not derived**: every mode takes only text, so there is nothing to infer from the inputs. `text_to_speech` speaks your prompt VERBATIM — write the script and nothing else, no prose stage directions ("read this warmly" gets read aloud). The one exception is Eleven v3, which reads sparse inline audio tags such as `[warmly]` as direction; other models may speak them. `text_to_music` and `text_to_sfx` take a description (genre, instrumentation, mood, tempo, texture).
- `--model` is required (no "auto"), and `moda media models` prints the audio cards: which modes each model serves, its duration envelope, prompt-character ceiling, take limit, preset voices, and billing basis. Most models take `--voice` as one of the presets on the card; where a card lists no presets but marks the mode free-form, `--voice` takes any provider voice name or cloned-voice id instead. For narration always pass one, cast for the brand and audience: the model's default is a generic pick, not a casting choice.
- **Duration and `--num-samples` are the cost.** Music bills per second PER TAKE, and where a card shows a billing floor each shorter take bills at that floor — four 5s takes against a 10s floor cost the same as 40s, not 20s. Ask for the shortest length that serves the deliverable and leave `--num-samples` alone unless the user wants alternatives to choose between. Speech usually bills per character of the prompt — except on a model whose card says it bills per second of the audio produced, where a slower `--speed` costs more for the same script. Read the card's billing basis rather than assuming.
- `--duration` applies to music and sfx only; it snaps into the model's range and the adjustment is reported. Speech has no duration axis — the clip is as long as the script takes to read, and a duration passed there is dropped and reported.
- The call is **synchronous** and speech returns in seconds, but music and sfx can be asked for at up to 600s of output and take longer. A render that outruns the wait comes back as a retryable error: **re-run the same command** to collect it if it finished anyway (that adopts the existing job and can never pay twice). Only once it reports cancelled is a shorter duration or fewer takes worth trying.
- Results are durable file refs like every other media verb — but audio has **no canvas or timeline slot**. It is a file to hand the user (`-o` downloads it), and `moda media generate-video --reference-audio` is the only verb that consumes one. Never imply it has been placed in a design.

### Video rules

- Same verbatim-prompt and required-model rules. Video models (e.g. Veo 3.1 / Veo 3.1 Fast / Veo 3.1 Lite, Seedance 2.0/2.5, Gemini Omni Flash, Kling 3, Wan 2.7 — the registry is the roster, not this list) differ in modes (text / start-image / reference-to-video), durations, resolutions, and native audio. `moda media models` prints the per-model capability cards; the per-model envelope is enforced server-side — knobs snap (read `applied`/`adjustments`), and an unsupported mode fails typed, naming the models that can do it. The moda-video skill owns model routing and the video workflows.
- **Always pass an explicit duration** — omitting it lets the server reserve the model's LONGEST clip, which is rarely the clip you meant to make.
- Requested duration/resolution/shape SNAP to the nearest supported value; the result reports what was `applied` and each `adjustment` — read them before describing the output. Snapping can round upward.
- Never ask a video model to render precise text, prices, or CTA/legal copy. Keep on-screen text minimal, design exact text into the start frame, go vector-native, or composite over the clip on an animation canvas and export mp4/gif (the moda-video skill owns all three moves).
- There is no video-to-video editing, and reference VIDEO input exists only on the models whose cards declare it. A canvas DOES take video via `<video src="file_…"/>` markup, but its static exports render blank (see gotchas.md).
- **Look at what you generated.** `moda media video-frames FILE_REF -o frames/` samples still frames out of a clip and writes them where you can see them — FREE, uncharged, nothing added to the library. A `file_` ref is not an image: this is the only way to know a render matches the brief, so run it before describing or delivering a generated clip. `--count N` (1–8) surveys evenly, `--timestamps MS...` inspects named moments (one or the other, never both), and it reads team files only — a local path uploads itself first, a remote URL does not. An empty frame list means Moda could not DECODE the file, not that the video is bad; a `frames_partial` warning means you saw only part of the clip. The moda-video skill owns the full loop.
- **Several drafts at once — the best-of-N pattern.** `moda media generate-video --no-wait` submits the render and returns a `task_id` immediately instead of holding the call open for minutes, so N drafts can run in parallel instead of one after another. Collect each with `moda task status TASK_REF --wait`, frame-check them, pick the direction that worked, and render only that one at final length/resolution on the model the ask deserves. Nothing is charged until a poll collects a finished video — an abandoned task costs nothing — and a background render takes durable inputs only (`file_` refs or local paths, never an http(s) URL), because collection re-resolves them minutes later. A failed or canceled render still exits 0: read the `status`.

## Imagery is a default quality lever

Generated imagery is a DEFAULT quality lever, not a last resort. Covers, heroes, section breaks, and full-bleed closers get generated imagery wherever it elevates the design — styled to the brand's palette and mood. Reuse brand-kit assets and the user's own uploads (`moda file search` / `moda file upload`, `--from-url`) when they are the actual subject matter; `moda file search QUERY --source stock` adds stock photography (place the `stock_unsplash_…` id verbatim; credit the result's `attribution` wherever the photo appears); markup `<image icon="query"/>` covers functional UI icons; an icon/vector-only system is a deliberate style choice, never a cost fallback.
