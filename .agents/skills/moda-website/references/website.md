# Building hosted websites — `moda site` and the moda.page runtime

A Moda site publishes to a public `https://<slug>.moda.page` URL. The lane is
deterministic and unmetered. This is a design surface: design quality matters,
not just valid HTML.

**Static multi-page sites**: HTML documents in, served as routable pages
(`/`, `/pricing`, …). No server code, no logins, no databases — offer
supported embeds and links instead, and say plainly when something is out
of scope. Visual QA is real: `moda site screenshot` renders draft pages at
desktop/tablet/mobile widths.

## Verbs

```
moda site create --file page.html [--title "Name"]   # starts with the homepage
moda site list / show / pages SITE_ID                # pages → paths, names, VERSION
moda site set-content SITE_ID --file page.html [--path /route] [--expected-version N]
moda site add-page SITE_ID --path /pricing --file page.html [--name Pricing]
moda site delete-page SITE_ID --path /route          # the homepage (/) is protected
moda site screenshot SITE_ID [--path /a /b] [--viewport desktop|tablet|mobile] [--format jpg|png]
moda site publish SITE_ID [--slug prefix]            # one publish covers ALL pages
moda site unpublish SITE_ID / delete SITE_ID
```

- Site ids are plain UUIDs — take them from `create` / `list`; never invent
  or transform one.
- `create` stores the page but publishes nothing. The site has no URL until
  the first `publish`.
- Routes are /-rooted with `[A-Za-z0-9_-]` segments (`/pricing`,
  `/docs/faq`); `/_moda` is reserved.
- `set-content` replaces a page's complete HTML (never a diff): `--path`
  targets one route; omitting it writes the homepage/site-level content.
  Saves do NOT touch the live site — every page keeps serving the last
  publish until `moda site publish` runs again (`has_unpublished_changes`
  flags this). The edit loop is always save-then-republish. Pass
  `--expected-version N` (the `version` from `moda site pages`/`show`) for
  read-modify-write safety; 409 `website_version_conflict` → re-read,
  re-apply, republish. Adding a page that exists is 409
  `website_page_exists` (update it instead).
- `publish` returns the live URL — print it prominently. `--slug` is a
  first-publish hint only (the final slug gets a random suffix; the hint is
  ignored on republish). A `slug_taken` / `slug_invalid` error means pick a
  different hint, not retry the same one.
- `review_status: "pending_review"` on a publish means the site is published
  but held for review before it serves. Say so honestly: give the user the
  URL and tell them it goes live once approved — do not present it as
  already browsable, and do not loop waiting for approval.
- Publish-gate errors and what to do: `malicious_link` / `content_flagged`
  (422 — the content gate refused the page: fix or remove the flagged
  content, save, republish; never resubmit unchanged), `missing_homepage` /
  `artifact_too_large` (400 — the page is malformed or over the 20MB limit:
  shrink assets, re-host images in Moda), `free_publishing_disabled` (403 —
  the plan cannot publish: relay the hint, do not retry), quota codes
  (429 — publish has its own fair-use budget: wait, do not loop), and
  `website_already_published` (409 — fires only when two concurrent FIRST
  publishes race; another publish just won that race, so re-run publish and
  it succeeds onto the winner's row. Republishing a live site is always
  safe: same site, same slug, artifact rebuilt).
- A 403 `team_access_denied` on a site means your key's team lacks edit
  rights on this site — it is NOT an auth failure; do not re-run
  `moda auth login`.

## Authoring pages

Write each page with your own tools as one **self-contained document**: inline
`<style>` for CSS, minimal inline `<script>` for behavior. Do not add blanket
CSS resets or normalize rules (`* { margin:0 }` and friends) — the hosting
runtime provides a sane baseline; component-specific styles only. Mobile-first,
polished across desktop, tablet, and phone.

Landing pages, homepages, and marketing heroes have their own layout craft —
the one-tall-page rule, the dead patterns to refuse, the type/grid/color
levers, the section arc, and the four hero archetypes all live in
references/landing-page.md. Load it before composing one; this file only
covers how a page is authored, hosted, and published.

Typography: if a brand kit lists fonts, use them matched to role (heading font
for headings/display, body font for body/UI); never swap a brand font for a
"similar" one. Load non-brand fonts from Google Fonts with a `<link>`; system
fonts are fallbacks only. Avoid the overused defaults (Inter, Roboto, Open
Sans, Lato, Montserrat, Poppins, Raleway, Oswald, Nunito, Playfair Display)
unless the brand kit names them.

Team-uploaded custom fonts (OTF/TTF) DO render on the published site: the
publish step matches every `font-family` the pages reference against the
team's font catalog and self-hosts each match behind a same-origin
`@font-face` it injects into `<head>`. Reference the catalog's exact family
name and do not hand-write `@font-face` for those families — the injected
block loads last and overrides it. A family in neither the catalog nor
Google Fonts silently falls back to a system font.

## Client-side libraries (self-hosted; third-party CDNs are blocked)

Published sites block third-party CDNs (cdnjs, jsdelivr, unpkg, …) — a script
from one silently breaks. Vetted libraries are self-hosted on Moda's CDN; add
only what the page needs, from these exact URLs:

- GSAP (core + ScrollTrigger; call `gsap.registerPlugin(ScrollTrigger)`):
  `https://cdn.moda.app/runtime-libs/gsap-3.15/gsap.min.js` and
  `https://cdn.moda.app/runtime-libs/gsap-3.15/ScrollTrigger.min.js`
- Swiper (prefer over hand-rolled carousels):
  `https://cdn.moda.app/runtime-libs/swiper-12.2.0/swiper-bundle.min.css` and
  `https://cdn.moda.app/runtime-libs/swiper-12.2.0/swiper-bundle.min.js`
- Chart.js: `https://cdn.moda.app/runtime-libs/chartjs-4.5.1/chart.umd.min.js`
- Lenis (smooth scroll; needs a rAF loop calling `lenis.raf(time)`):
  `https://cdn.moda.app/runtime-libs/lenis-1.3.23/lenis.css` and
  `https://cdn.moda.app/runtime-libs/lenis-1.3.23/lenis.min.js`
- Three.js (ESM import map — `three` →
  `https://cdn.moda.app/runtime-libs/three-0.184.0/three.module.min.js`,
  `three/addons/` → `https://cdn.moda.app/runtime-libs/three-0.184.0/addons/`;
  ~600KB, real 3D only; import map before your module scripts).

## Embeds & third-party content (strict allowlist)

An embed from any origin not listed below is silently blocked on the
published site. There is no generic embed — never emit another third-party
origin, even a mainstream one.

- Maps: Google Maps. Scheduling: Calendly.
- Forms / lead capture: a native on-brand `<form>` wired to a no-backend
  delivery (Web3Forms / Formspree / Formsubmit), or a hosted Tally / Google
  Forms / Typeform / Jotform iframe — prefer the native form.
- Newsletter: Mailchimp / Kit / Beehiiv.
- Contact: WhatsApp / Viber / Telegram / `tel:` / `mailto:` deep-links.
- Video: YouTube (`youtube-nocookie.com`) or Vimeo iframes; Cloudflare
  Stream for the user's own hosted videos.
- Payments: Stripe (Checkout / Payment Links).
- Analytics: Google Analytics (GA4 gtag only, never Google Tag Manager).

Asked for anything not on the list: do not emit it — say it is not supported
yet and offer the closest supported option or a plain link. For service,
local, or conversion businesses, proactively offer a contact, lead-capture,
or booking path even when not asked. Never invent embed URLs, access keys,
form IDs, or contact details — ask the user.

Unsure which one an ask wants? `moda ask "the user wants people to book time
on their site — which supported embed do I use and what do I need from
them?"`.

### Maps — Google Maps, keyless

Google's keyless iframe endpoint renders from the address with no API key and
no billing:

`https://maps.google.com/maps?q={URL-encoded address}&z={zoom}&output=embed`

- `q` (required): the real address / place / `lat,lng` the user gave,
  URL-encoded (spaces `+`, commas `%2C`). Google geocodes it — never fabricate
  coordinates.
- `z`: zoom 0–21. `t`: `m` / `k` / `h` / `p` (map / satellite / hybrid /
  terrain). `output=embed` is required — it strips Google's page chrome.
- Directions: `saddr={from}&daddr={to}` (plus optional `dirflg=d|w|b|r`).

```html
<div style="width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:12px">
  <iframe style="width:100%;height:100%;border:0" loading="lazy" allowfullscreen
    referrerpolicy="no-referrer-when-downgrade" title="Map of our office"
    src="https://maps.google.com/maps?q=123+Lafayette+St%2C+New+York%2C+NY&z=15&output=embed"></iframe>
</div>
```

Sizing: drop any fixed `width`/`height` and let the iframe fill a container
with a set aspect ratio, as above.

**Never use the `?pb=` form.** `https://www.google.com/maps/embed?pb=…` — the
`pb` value is an **opaque** blob you cannot derive from an address, so a
guessed one silently pins the **wrong** place. The keyless `q=` form takes the
address directly, so it is correct by construction. The keyless endpoint is
unofficial and legacy (basic map only), but stable, and it is the right
default; richer modes (Street View, Place IDs, styled maps) need a keyed Maps
Embed API key, which you must ask the user for and never invent.

### Scheduling — Calendly

Calendly's official widget assets, in one of three types picked by how
prominent the scheduler should be. The embed needs the user's **own** link
(`https://calendly.com/{username}` or `.../{username}/{event-type}`) — you
cannot guess it. **Ask for it** before adding the embed; a fabricated link or
a bare `{username}` placeholder just errors. A clearly-labelled placeholder is
fine only if the user asked to scaffold now and fill it in later.

Use only these assets: the script, for all three types,
`https://assets.calendly.com/assets/external/widget.js`; the stylesheet, for
popup and badge only, `https://assets.calendly.com/assets/external/widget.css`.

**1. Inline** — the calendar sits in the page. Keep `min-width:320px` and a
tall height. Include the script once even with multiple widgets.

```html
<div class="calendly-inline-widget" data-url="https://calendly.com/{username}/{event-type}" style="min-width:320px;height:700px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

**2. Popup button** — opens in a modal. Style the `<button>` with the site's
own classes; the `onclick` wires it up.

```html
<!-- once, in <head> -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>

<button type="button" onclick="Calendly.initPopupWidget({ url: 'https://calendly.com/{username}/{event-type}' }); return false;">
  Schedule a demo
</button>
```

**3. Floating badge** — a persistent corner button. Align `color` to the
site's accent color.

```html
<!-- head assets as above -->
<script>
  window.addEventListener('load', function () {
    Calendly.initBadgeWidget({ url: 'https://calendly.com/{username}/{event-type}', text: 'Schedule time with me', color: '#0069ff', textColor: '#ffffff' });
  });
</script>
```

### Analytics — GA4 gtag

GA is an add-on, not a replacement: Moda already ships first-party **Views**
analytics, so keep that and pitch GA as the extra layer (audiences, events,
funnels). If the user only wants view counts, point them at Views instead.

**Ask for the Measurement ID — never fabricate one.** It is shaped
`G-XXXXXXXXXX`, account-specific, and cannot be derived; ask the user to paste
it from Admin → Data streams → their web stream. A wrong or invented ID
silently sends data nowhere, or to a stranger's property.

**GA4 gtag only — never Google Tag Manager.** Do not emit `gtm.js`,
`googletagmanager.com/gtm.js`, or the `<noscript>` GTM iframe, even if the
user pastes a GTM container snippet: GTM is a remote tag-loader whose
container can inject arbitrary third-party scripts after publish, defeating
the published-site allowlist. Offer GA4 gtag with their Measurement ID
instead.

The snippet goes in `<head>` of every page you want tracked. It auto-sends a
`page_view` per load, and Moda sites are multi-page with full page loads, so
per-page tags are correct. Replace **both** IDs.

```html
<!-- Google tag (gtag.js) — GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // Consent Mode v2 — deny by default; GA4 still sends cookieless aggregated pings.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500,
  });

  // Restore a returning visitor's prior "granted" choice BEFORE config, so their first
  // page_view is measured with consent. localStorage can throw in locked-down browsers.
  try {
    if (localStorage.getItem('ga-consent') === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  } catch (e) {}

  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Consent banner — don't skip it.** The snippet defaults to denied, so pair it
with a minimal banner near the end of `<body>`, styled to match the site, that
flips `analytics_storage` on accept and remembers the choice. Three details
the banner has to get right: exit cleanly if any of its elements were
customized away, so a missing node cannot halt other scripts; wrap every
`localStorage` read and write in `try`/`catch`, because it throws under
Safari's "Block all cookies" and in sandboxed contexts (consent then still
works for the session, it just does not persist); and send a
`gtag('event', 'page_view')` on accept, because the load-time one was
cookieless and GA4 will not resend it — without it a first-time visitor who
accepts on a one-page visit is only ever measured cookielessly.

This is a reasonable baseline, **not legal advice** — obligations vary by
jurisdiction and the site owner is responsible for compliance. If the user
asks you to drop the banner, leave it out and say it is then on them.

Verifying: after publishing with a real ID, GA4 → Reports → Realtime should
show a live user within ~30s of loading the page. If not, re-check the ID and
that the snippet is in `<head>` on the **published** page, not just the draft.
The allowlisted hosts are GA4-only — do not add other Google hosts.

### Lead capture — a native form with a no-backend delivery

Moda has no backend, so a form must hand submissions to a **no-backend
delivery** — otherwise it renders but collects nothing, the #1 complaint here
("add a form **that works**").

**Build a native, on-brand form, not an iframe.** Generate the form in the
page with the site's own styling and wire its delivery to a form-catcher
service. Do not default to an embedded third-party form — it ignores the
site's design. A hosted embed is a fallback only when the user explicitly
wants a form builder.

Never fabricate an access key, form ID, recipient email, or phone number — a
guessed one silently fails or sends to nobody. If a required value is missing,
**ask the user**. A clearly-labelled placeholder is fine only if the user
asked to scaffold now and fill it in later.

**Email is the default.** If the user has no provider yet, recommend
**Web3Forms** — lowest friction: they enter their email at `web3forms.com` and
get a free access key by email, no account or dashboard. The form POSTs to
Web3Forms, which emails them each submission.

```html
<form id="lead-form"><!-- the site's own field/spacing classes -->
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
  <!-- lead attribution: tells the owner this lead came from the site -->
  <input type="hidden" name="source" value="website" />
  <input type="hidden" name="subject" value="New lead from your website" />

  <input type="text"  name="name"  required placeholder="Name" />
  <input type="email" name="email" required placeholder="Email" />
  <input type="tel"   name="phone" placeholder="Phone (optional)" />
  <textarea name="message" placeholder="How can we help?"></textarea>

  <!-- honeypot: real users never fill this; bots do. Keep it visually hidden. -->
  <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" />

  <button type="submit">Get a quote</button>
</form>
<div id="lead-form-success" hidden>Thanks — we got your message and will reply shortly.</div>

<script>
  const leadForm = document.getElementById('lead-form');
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(leadForm) });
      const json = await res.json().catch(() => ({}));
      if (json.success) {
        leadForm.hidden = true;
        document.getElementById('lead-form-success').hidden = false;
      } else {
        // surface an inline error; do not lose the user's input
      }
    } catch (err) {
      // network failure — surface an inline error; do not lose the user's input
    }
  });
</script>
```

Other email destinations, by need:

- **Formspree** — when the user wants a dashboard plus submission history. No
  JS needed: `<form action="https://formspree.io/f/{FORM_ID}" method="POST">`.
  Its honeypot field is `name="_gotcha"`, hidden. Ask for their form ID.
- **Formsubmit** — the zero-signup fallback:
  `<form action="https://formsubmit.co/{EMAIL}" method="POST">`; the first
  submission triggers a one-time activation email. It exposes the address in
  the page source — use the hashed endpoint `formsubmit.co/{hash}` to hide it.
  Its honeypot field is `name="_honey"`.
- **WhatsApp / messenger** — there is no silent server notification without a
  backend. The no-backend pattern is a native form whose submit handler opens
  `wa.me/{owner-number}?text=…` pre-filled from the fields; see the deeplinks
  recipe below for the exact code.

Always include: a visible **success/thank-you state** — a state of the same
page, not a separate route — and, where the provider supports it, an
autoresponder confirmation to the visitor (Web3Forms hidden fields, Formspree
settings), a recurring ask; a **honeypot** on every public form; and a
**hidden attribution field** (`source`, or a promo code) so the owner can tell
site leads from other sources.

**Hosted-embed fallback, only on request.** If the user wants a real form
*builder* (branching, file uploads, payments inside the form) or already has
one, embed it as a plain fixed-height `<iframe>` (tall, ~700px). Do **not**
add the provider's resize `<script>` — the published-site allowlist permits
these form iframes but not their loader scripts, so a script-based embed
breaks on publish. Tally (`https://tally.so/r/{formId}` or
`/embed/{formId}`) is the recommended hosted option — best free tier, cleanest
design. Google Forms embeds as
`https://docs.google.com/forms/d/e/{id}/viewform?embedded=true`. Typeform and
Jotform embed their form URL directly, and are only for users who already have
one — do not propose them by default. Give every embedded iframe a `title` and
`loading="lazy"`.

### Newsletter — Mailchimp / Kit / Beehiiv

Distinct from lead capture, where a one-off inquiry is routed to email or a
messenger: here the contact joins a marketing list the user will email later.
Generate the form yourself and POST it to the provider's endpoint rather than
dropping in the provider's off-brand widget — Beehiiv is the exception,
because its no-backend path is an iframe.

Audience and list IDs, form IDs, the Mailchimp data-center, and publication
IDs are account-specific and **cannot be derived**. Ask which provider the
user is on and ask them to paste their embed/signup code, or to give you the
action URL plus IDs. A fabricated ID, action URL, or data-center silently
subscribes nobody.

**Mailchimp** — a native form posting to the audience's `list-manage.com`
endpoint. The `u` (account), `id` (audience), and data-center subdomain
(`us21`, etc.) all come from the user's embed code. Merge fields are
**uppercase** (`EMAIL`, `FNAME`, `LNAME`).

```html
<form action="https://YOURDC.list-manage.com/subscribe/post?u=U_ID&id=AUDIENCE_ID" method="post" target="_blank" novalidate>
  <input type="email" name="EMAIL" required placeholder="Email" />
  <input type="text"  name="FNAME" placeholder="First name (optional)" />

  <!-- Mailchimp bot honeypot: name is account-specific (b_{u}_{id}); MUST stay empty -->
  <div aria-hidden="true" style="position:absolute;left:-5000px">
    <input type="text" name="b_U_ID_AUDIENCE_ID" tabindex="-1" value="" />
  </div>

  <button type="submit">Subscribe</button>
</form>
```

That form redirects to Mailchimp's hosted confirmation in a new tab
(`target="_blank"`), and on Mailchimp that redirect is the whole story: it
allows no cross-origin `fetch`, and its JSONP endpoint
(`…/subscribe/post-json?...&c=?`) is blocked on a published site — the
`*.list-manage.com` allowance in Moda's CSP is `form-action` only, never
`script-src`, so the injected JSONP `<script>` never loads. Do not reach for
it. If the user needs an on-page success state rather than a redirect, say so
plainly and offer Kit (native JSON over AJAX, below) or Beehiiv's iframe
instead.

**Kit (ConvertKit)** — a native POST to the form's subscriptions endpoint,
shaped `https://app.kit.com/forms/{FORM_ID}/subscriptions` (legacy
`app.convertkit.com`); use the exact action URL from the user's embed. It
returns **JSON**, so a normal AJAX submit with an on-page success state works.
Send the `FormData` directly: as form data Kit parses `fields[first_name]`
into a nested field, and JSON-serializing it breaks that — bracket keys do not
nest in JSON.

```html
<form id="kit-form" action="https://app.kit.com/forms/FORM_ID/subscriptions" method="post">
  <input type="email" name="email_address" required placeholder="Email" />
  <input type="text"  name="fields[first_name]" placeholder="First name (optional)" />
  <button type="submit">Subscribe</button>
</form>
<div id="kit-success" hidden>You're in — check your inbox to confirm.</div>
<script>
  const kitForm = document.getElementById('kit-form');
  kitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(kitForm.action, {
      method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(kitForm),
    });
    const json = await res.json().catch(() => ({}));
    if (json.status === 'success') {
      kitForm.hidden = true;
      document.getElementById('kit-success').hidden = false;
    }
    // otherwise surface an inline error and keep the user's input
  });
</script>
```

**Beehiiv** — its no-backend path is the iframe embed, because the subscribe
API needs a server-side key. Use the embed URL from the user's Beehiiv
dashboard; give the iframe a `title` and `loading="lazy"`. The styling is
Beehiiv's, not the site's — if on-brand matters, prefer Mailchimp or Kit's
native form.

```html
<iframe src="https://embeds.beehiiv.com/PUBLICATION_ID" title="Subscribe"
  style="width:100%;height:120px;border:0" loading="lazy"></iframe>
```

Always include a visible success state, and the provider's honeypot/anti-bot
field wherever it has one. Reuse the lead-capture field styling and validation
patterns so the two forms look like one site.

### Contact deeplinks — `mailto:` / `tel:` / `sms:` and click-to-chat

Deep-links are plain `https:` / `tel:` / `mailto:` / `sms:` (and app-scheme)
URLs that open the right app. No backend needed, and they work on a published
site and in standalone export.

Build from the user's **own** phone number, handle, or email; never invent
one. Use full international format with country code, no spaces or dashes. The
`+` handling differs by target: WhatsApp (`wa.me`) takes **digits only, no
`+`** (`15551234567`); Viber takes the `+` **URL-encoded as `%2B`**
(`%2B15551234567`), the format that works reliably across mobile and desktop.

```html
<a href="https://wa.me/15551234567?text=Hi%2C%20I%27d%20like%20a%20quote" target="_blank" rel="noopener">Chat on WhatsApp</a>
<a href="tel:+15551234567">Call now</a>
<a href="mailto:hello@example.com?subject=Quote%20request&body=Hi%20there%2C">Email us</a>
<a href="sms:+15551234567?body=Hi%2C%20I%27d%20like%20a%20quote">Text us</a>
<a href="viber://chat?number=%2B15551234567">Message on Viber</a>
<a href="https://t.me/yourusername" target="_blank" rel="noopener">Message on Telegram</a>
```

Parameter grammar, per scheme:

- `mailto:` — one or more comma-separated addresses, then `?subject=` and
  `&body=` (also `cc=`, `bcc=`); every value URL-encoded, and a newline in a
  body is `%0A`.
- `tel:` — the number only. No extension parameter is portable, so put an
  extension in the visible label rather than the href.
- `sms:` — the number, then `?body=` (`&body=` when it follows another
  parameter); multiple recipients are comma-separated. Body support is
  patchy on older Android, so keep the message short and never make it
  load-bearing.
- `wa.me` — `?text=` pre-fills the message, URL-encoded. Use `wa.me`, not the
  legacy `api.whatsapp.com`.

`viber://` and other app-scheme links only work where the app is installed —
always provide a phone or email fallback alongside. Use real, official
messenger icons (`moda file search --kind icon`, or the provider's brand SVG);
never generate a brand or messenger logo, which comes out wrong.

A persistent corner button is the same anchor pinned with
`position:fixed;bottom:1.25rem;right:1.25rem;z-index:50`, given an
`aria-label`, and carrying the official icon plus a short label.

**Form → WhatsApp** is the bridge from lead capture: build a `wa.me` message
from the form fields on submit. This opens the **visitor's** WhatsApp,
pre-addressed to the owner's number — visitor-initiated, not a silent server
notification. Say so plainly; do not imply push delivery.

```html
<script>
  const OWNER_WHATSAPP = '15551234567'; // owner's number, intl digits only — ASK the user
  document.getElementById('wa-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Read fields via FormData — NOT e.target.name, which is the form's own
    // `name` property (HTMLFormElement.name), not the input named "name".
    const data = new FormData(e.target);
    const text = `New inquiry\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nMessage: ${data.get('message')}`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
</script>
```

### Email HTML is a different format

A marketing email is not a web page and is not a site route — it is a
self-contained file you hand the user, so never publish one as a page and
never route it through `moda site`. The craft (600px table layout, inline
CSS, bulletproof buttons, images-off) is references/email-html.md.

## Images & assets

Published sites block external image origins — never hotlink another site's
images. Use images that live in Moda: brand-kit assets, the user's uploads
(`moda file upload`, `moda file upload --from-url`), or generation
(`moda media generate-image`, metered). When recreating an existing site
from a URL, reuse its real copy/colors/fonts but re-host its images in Moda.

## Verify loop

`moda site screenshot SITE_ID --path /route --viewport mobile` renders the
DRAFT (saved) content — up to 3 pages per call, desktop/tablet/mobile, files
downloaded locally for your own vision. Check hierarchy, spacing, contrast,
and responsive behavior at desktop AND mobile before publishing; a
`truncated` capture was cut at the pixel budget — re-capture before judging
it. 503 `render_capacity` is transient
(retry after a moment); 422 `website_render_too_heavy` is deterministic —
lighten the page. Fix, `set-content`, screenshot again, republish.
