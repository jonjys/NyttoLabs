# Brand kits — deterministic on-brand authoring

A brand kit is Moda's canonical record of a brand: palette, font families, logo assets, and usage guidance.

On-brand work is **two things, and you owe both**:

1. **Author with the kit's tokens** — client-side by design: you read the kit, then write its colors and fonts into your markup. There is no server verb that restyles a design for you.
2. **Bind the kit to the canvas** — `--brand` on `moda canvas create`, or `moda canvas brand CANVAS_REF BRAND_REF` afterwards. This records which brand the canvas BELONGS to. It changes no pixels.

Skipping (2) is the quiet failure: the deck looks perfectly on-brand, and then the user opens it in Moda and the brand-kit dropdown in the toolbar is empty, Moda's own agent inherits no brand context for their next edit, and nothing in the workspace knows the canvas is theirs. Bind it, and **tell the user which kit you used** — they cannot see your tool calls.

## Verbs

```
moda brand list [--query TEXT]           # kits in the workspace (name, id, default marker); --query filters by kit title or company name
moda canvas create --brand BRAND_REF …   # create a canvas already bound to a kit
moda canvas brand CANVAS_REF BRAND_REF   # bind an existing canvas (--clear to unbind)
moda brand show BRAND_REF --json         # model-safe summary: palette, fonts, logo refs
moda brand use BRAND_REF [--local]       # persist as YOUR default kit locally (config or repo context)
moda brand update BRAND_REF --default    # make it the TEAM's default kit, server-side, for everyone
moda brand pull BRAND_REF --output brand.json   # the full kit document
moda brand create --url https://acme.com # extraction from a website — deterministic, free
moda brand create --name "Acme" --color '#0F172A:Primary' --font 'Sora:title'   # manual build — no website needed
moda brand update BRAND_REF --tagline "…" --color '#0F172A:Primary'  # fix fields in place (colors/fonts REPLACE)
moda brand images BRAND_REF              # attached images with their bki_ ids
moda brand add-image BRAND_REF --file FILE_REF [--role logo|reference|asset]   # attach an upload
moda brand remove-image BRAND_REF BKI_ID # detach by bki_ id
```

`moda brand show --json` returns colors, fonts, and per-asset **two handles**: a durable `file_` reference and a signed, short-lived preview `url`. The `file_` ref is the only thing that ever goes into markup or media inputs — refs resolve server-side; never retype a URL or a hex you think you remember. The signed `url` is use-and-discard: download it to LOOK at the asset with your own vision, then discard it.

## Applying a kit (the deterministic lane)

- **Binding:** first, so it cannot be forgotten last. `moda canvas create --name "…" --brand BRAND_REF`; on a canvas that already exists, `moda canvas brand CANVAS_REF BRAND_REF`. A template-sourced create (`--template`) keeps the SOURCE canvas's kit and refuses `--brand` — rebind the copy afterwards if the user wants a different brand.
  **That rebind is metadata only, and the restyle is a separate, mandatory job**: when the user's kit differs from the template's original brand, rebranding is implicit even though the prompt describes only the content — a finished canvas still carrying the template's colors and hero images is a failed run. Work the recipe in "Instantiating under a different brand" in the templates reference.
- **Colors:** the kit owns them — copy the exact hex from `moda brand show`, never re-type one from memory. In MARKUP that hex is what you write: `$name` and `var()` do not resolve there. To make a kit color reusable so a later brand change is one update, bind it on the EDIT lane — `create('variable', …)` in edit code, then apply it as a variable-reference color value: type `variable`, with the key `variableId` set to the id from the read's `variables[…]` entry. `variableId` is the ONLY key that resolves — a bound fill DISPLAYS `variableName` in the read, but echoing that key back, or a bare `id`, is accepted without complaint and paints BLACK.
- **Fonts:** the kit's families are the font menu. There is no list-fonts verb — the kit (plus families already used on the canvas) defines what is safely available. Kit-listed fonts are loaded and safe to use as named; substitute only a font the kit explicitly marks unavailable (`supported: false`), preferring the families named in that entry's `suggestions` — those are already filtered against the platform + team catalog, so they render as named. An unavailable entry also keeps its `label`: that role still needs a face, so assign one deliberately rather than leaving the design without it. When `suggestions` is empty, pick a supported kit family of the same role kind (a display role takes a display face, not the body face).
- **Voice:** the kit's `tagline`, `brand_values`, `brand_tone_of_voice`, and usage rules (all in `moda brand show --json`) govern copy. Read them before writing any headline or body text on a branded artifact — a visually on-brand deck with off-brand copy is still off-brand.
- **Logos:** place by file reference from the kit (`<image src="ref" fit="contain"/>`), never re-hosted or retyped URLs. Check contrast against the background; kits often carry light/dark logo variants — pick the one that contrasts.
- **Imagery:** kit assets outrank stock or generated imagery. Route per the order in references/design-quality.md.

## Adherence — how much latitude the kit gives you

**Brand kit adherence** (only when a kit is active; default Balanced) — **Strict** = brand colors/fonts/assets only. **Balanced** = brand defaults plus limited complementary accents. **Loose** = brand-inspired; new colors, fonts and imagery are fine if the brand stays recognizable.

Take the mode from what the user says ("stay exactly on brand" is Strict; "brand-ish, make it pop" is Loose) rather than asking a separate question for it, and state which mode you worked in at hand-over. It is the difference between a timid deck that reuses three kit colors on every page and a run that quietly drifts off-brand with no stated license.

With NO kit active there is no adherence dial at all — you invent the whole system rather than borrowing one, and "unbranded" never means plain. The skills that design from scratch carry a no-brand design reference for exactly that.

## Look at the brand, not just the tokens (mandatory for net-new design)

Hex codes and font names don't tell you what the brand LOOKS like. Before the
concept step of any net-new design that uses a kit — deck cover, one-pager,
social — and before placing any logo:

1. `moda brand pull BRAND_REF --output brand.json` and pull each logo group's
   signed preview `url` (e.g. `jq '.brand_kit.logos'`).
2. Download 2–3 of them (`curl -o /tmp/brand-logo-1.png "<url>"`) and VIEW the
   files with your own vision. Note: mark vs wordmark, light/dark variants,
   the logo's real colors, and the style of any brand imagery.
3. Author with what you SAW: pick the variant that contrasts with your
   background, and match imagery style to the kit's. Place assets by `file_`
   ref only — the preview URLs never go into markup.

Once per session per kit is enough. Skipping this is how wrong-logo-variant
and off-brand-imagery output happens.

Budget rule: `moda brand show --json` is the token read; use `pull` only when you need the preview URLs, extract the fields you need (`jq`), and never read the whole `brand.json` into context.

## Auditing a canvas against a kit ("check")

The auditable brand check no competitor offers — pure read verbs:

1. `moda brand show BRAND_REF --json` — the reference tokens.
2. `moda canvas read CANVAS_REF` — every node's fills, strokes, fonts, and the read's top-level
`variables[…]` list.
3. Compare and report pass/fail per element:
   - Every fill/stroke color is a kit palette value (the literal hex), a real variable binding (a `type: variable` block whose `variableName` is in the read's `variables[…]`, resolving to a kit value), neutral (white/black/gray scale) — or, under Balanced/Loose, within the latitude the adherence mode above licenses (Balanced: one complementary accent; Loose: recognizability is the standard). Under Strict, exact kit values only. A BARE `$name` or `var()` string sitting in a fill is a FAIL, not a binding: markup never resolved it, so that node is painting the renderer's fallback — repair that one with the kit's hex. Never "repair" a real binding into a literal; that de-binds the canvas.
   - Every text node's family is a kit family (or a family the kit lists as an approved alternative). Under Loose a departure is a finding only if it costs recognizability; under Strict/Balanced, kit families only.
   - Logo present where expected, at legible size, correct variant for its background, undistorted (contain fit, aspect preserved).
   - No off-kit accent colors introduced "for pop" — flag each with node id and the nearest kit color. Judge this against the adherence mode above: under Strict every off-kit value is a finding; under Balanced a single complementary accent is licensed and only an off-kit color doing a KIT color's job (a heading, a surface, the primary call to action) is; under Loose the finding is loss of recognizability, not the extra hue.
4. Fix what the user asked you to fix via the smallest-change routing (references/design-quality.md); report the rest.

## Creating and escalating

Two creation paths, both **deterministic and unmetered** (ignore any legacy metered labels in the response envelope while the server sheds them):

- **URL extraction — the fast path.** `moda brand create --url …` runs Moda's server-side extraction (colors, fonts, logos from a live site). Prefer it whenever the brand has a website: it captures more than the user would dictate.
- **Manual build — for brands without a website** (or when the user already holds the ground truth: a style guide, a logo file, exact hexes). `moda brand create --name "Acme" --color '#0F172A:Primary' --color '#F97316:Accent' --font 'Sora:title:600' --logo FILE_REF`. Upload logos first (`moda file upload logo.png` → `file_` ref). For a rich palette, a kit file beats a wall of flags: write `kit.json` (`{"name", "colors": [{"color","label"}], "fonts": [{"family","label","weight"}], "logo_file_ids": []}`) and run `moda brand create --from-file kit.json`. Exactly one path per create — never both `--url` and the manual TOKEN flags (`--color`/`--font`/`--logo`), which would assert two sources of truth for the same fields. `--name` is the exception and is welcome alongside `--url`: `moda brand create --url https://acme.com --name "Acme Design"` extracts the brand and titles the kit with the name the user gave you. It titles the KIT only — the brand's own `company_name` stays as extracted, because naming a kit is not asserting what the company is called.

### Fixing a kit in place (the update verbs)

Extraction is good, not perfect — a slightly-off primary, a missed accent, a wrong font role. **Fix the kit, don't work around it**: authoring around a wrong kit value re-breaks every future branded artifact.

- Fields: `moda brand update BRAND_REF --tagline "…" --values 'transparent,fast' --tone 'direct,friendly' --company-name "…" --description "…" --title "…"`.
- Team default: `moda brand update BRAND_REF --default` promotes the kit for the whole team, clearing whichever kit held it — it rides the same call as the field flags, so correcting and promoting is one write. Do not confuse it with `moda brand use`, which records a preference for this CLI only and changes nothing for teammates.
- Palette/fonts: `--color` / `--font` flags **replace the entire list** — read `moda brand show --json` first, then pass the full corrected set (e.g. extracted primary is off: re-send every color with the fixed hex). Partial flags silently drop the rest.
- Images: `moda brand images BRAND_REF` lists attachments with `bki_` ids; `add-image --file FILE_REF --role logo|reference|asset` attaches an upload; `remove-image BRAND_REF BKI_ID` detaches. Roles: logo = brand marks, reference = style hints for the agent, asset = placeable imagery. **To rename an attachment, re-run `add-image` for the same file with the SAME `--role` it is already attached under (the `role` in `moda brand images`) and the new `--label`** — it renames in place, keeping the attachment's `bki_` id, notes and position. The role is not optional in that recipe: dedupe and rename are per BUCKET (`logo` is one bucket; `reference` and `asset` share the other), so re-running with the wrong role renames nothing and instead attaches a SECOND copy of the file in the other bucket — and since `--role` defaults to `logo`, renaming a reference without passing its role turns it into a brand mark the design agent will place. `remove-image` is for detaching, never for renaming: detach-then-re-attach mints a new id and drops the notes and position.
- Confirm destructive edits with the user before running them (removing images, replacing a palette) — kit changes affect every future branded artifact, not just this session.
- **Read the guide prose before branded work.** A kit's GUIDES are the written brand rules Moda's own agent honors — voice, imagery doctrine, usage law beyond colors/fonts/logos. `moda brand guides KIT_REF` lists them (id, title, description); `moda brand guide KIT_REF GUIDE_ID` returns the full markdown. Read the relevant guide(s) before any branded deliverable and follow them with the same force as the kit's fields; where guides are silent, ask the user rather than inventing brand law.
- Full brand-**guide** generation — a new identity, multiple creative directions, logo concepts — is creative work for the Moda app: hand the user the app link and let them run it there. Do not try to hand-author a brand identity out of markup primitives.

## Auditing: is the canvas even bound?

`moda canvas read CANVAS_REF` reports the canvas's brand kit alongside its content. An unbound canvas in a workspace that has kits is a finding in its own right — report it with the rest of the audit below, and offer to bind it.

## Honest gaps

- No list-fonts verb exists: font discovery = the kit + the canvas's existing families. A font-substitution event surfaces as a structured warning on the mutation result (e.g. `font_substituted`) — read it and either accept the substitute or switch to a kit family.
- Binding is metadata, not a restyle: `moda canvas brand` will not recolor an off-brand design. Fix the design through the edit lane; the binding just records whose brand it is.
- Kit edits the update verbs don't reach — image group naming/reordering, gradients, light/dark color modes, guide prose editing — happen in the Moda app's brand-kit editor. Fields, palette, fonts, and image attach/detach are covered by `moda brand update` / `add-image` / `remove-image` above.
