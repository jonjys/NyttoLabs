'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'

const accent = ACCENT.products

// Stripe payment links are preserved verbatim from the previous homepage — do
// not edit these hrefs without checking the live links in the Nytto Labs
// Stripe account first.
const CYCLE_SHEET = 'https://buy.stripe.com/aFafZgculf7o8uA7aZ8og0r'
const CYCLE_BULK = 'https://cycletag.eu/bulk'
const CYCLE_FREE = 'https://cycletag.eu/#create'
const VATIDENCE_PAY = 'https://vatidence.nyttolabs.com/'
const CURL_PAY = 'https://pay.nyttolabs.com/'
const DEPLOYDOCTOR = 'https://deploydoctor.nyttolabs.com/'
const DEPLOYDOCTOR_PRICING = 'https://deploydoctor.nyttolabs.com/pricing'
// Failclosed's domain comes from the catalog (lib/relay/catalog.js). LiveProof
// has no public domain in the repo yet, so its card renders without a link.
const FAILCLOSED = 'https://failclosed.nyttolabs.com/'

const COPY = {
  en: {
    eyebrow: 'Products · Swedish software · F-tax',
    hero: 'Six live products.',
    lede: 'DeployDoctor, CycleTag, Vatidence, Curl-to-Buy, LiveProof and Failclosed. Focused products, live now — not a roadmap.',
    cycleBody: 'QR reorder labels for filters, toner and the things you replace.',
    cycleFeatures: ['Print, stick, scan', 'No app required', 'Any printer, any label'],
    cyclePrice: '$5',
    cycleNote: '49 SEK at checkout · starter sheet',
    cyclePay: 'Buy a sheet',
    cycleBulk: 'Bulk $31',
    cycleFree: 'Free — make one tag',
    viesBody: 'EU VAT checks against VIES, with proof for the books.',
    viesFeatures: ['Checked against VIES', 'Sealed PDF + CSV', 'Official consultation number'],
    viesPrice: '$6',
    viesNote: '€4.90 at checkout · minimum per batch',
    viesPay: 'Pay and verify',
    viesFree: 'Free — a single check',
    curlBody: 'Sell a digital file with no account on either side.',
    curlFeatures: ['No account, either side', 'Any file, up to 100 MB', 'Unlimited free links'],
    curlPrice: '5%',
    curlNote: 'fee · you keep 95%',
    curlPay: 'Post a file',
    curlFree: 'Free to create — 5% only when it sells',
    ddBody: 'Scan a public GitHub repo for the code issues most likely to break a Vercel deployment.',
    ddFeatures: ['Checks matched to your stack', 'No cloning, no code execution', 'Shareable report'],
    ddPrice: '$9',
    ddNote: 'per month · or $5 for a 7-day pass',
    ddPay: 'Scan a repository',
    ddPricing: 'See pricing',
    ddFree: 'Free — 3 scans a day',
    liveBody: 'Continuous uptime attestation with a signed, timestamped trail.',
    liveFeatures: ['Continuous uptime checks', 'Signed, timestamped trail'],
    failBody: 'Access control that defaults to denied the instant any part of the check is uncertain.',
    failFeatures: ['Denied by default', 'Any uncertain signal means deny'],
    failVisit: 'Visit Failclosed',
    partnerTitle: 'Work with Nytto Labs',
    partnerBody: 'Partnerships and general questions go to the same inbox. You keep checkout, payment and fulfilment.',
    partnerCta: 'Become a partner',
  },
  sv: {
    eyebrow: 'Produkter · Svensk mjukvara · F-skatt',
    hero: 'Sex produkter, live nu.',
    lede: 'DeployDoctor, CycleTag, Vatidence, Curl-to-Buy, LiveProof och Failclosed. Fokuserade produkter, live nu — ingen roadmap.',
    cycleBody: 'QR-etiketter för filter, toner och det du byter.',
    cycleFeatures: ['Skriv ut, klistra, skanna', 'Ingen app krävs', 'Vilken skrivare som helst'],
    cyclePrice: '49 kr',
    cycleNote: 'startark · engångsköp',
    cyclePay: 'Köp ett ark',
    cycleBulk: 'Bulk 299 kr',
    cycleFree: 'Gratis — gör en tagg',
    viesBody: 'EU-momskontroll mot VIES, med bevis till bokföringen.',
    viesFeatures: ['Kontrolleras mot VIES', 'Förseglad PDF + CSV', 'Officiellt konsultationsnummer'],
    viesPrice: '4,90 €',
    viesNote: 'minimum per batch · engångsköp',
    viesPay: 'Betala och verifiera',
    viesFree: 'Gratis — enstaka kontroll',
    curlBody: 'Sälj en digital fil utan konto på någon sida.',
    curlFeatures: ['Inget konto, någon sida', 'Valfri fil, upp till 100 MB', 'Obegränsat med gratis länkar'],
    curlPrice: '5%',
    curlNote: 'avgift · du behåller 95%',
    curlPay: 'Lägg upp en fil',
    curlFree: 'Gratis att skapa — 5% bara när den säljer',
    ddBody: 'Skanna ett publikt GitHub-repo efter kodfelen som oftast knäcker en Vercel-deploy.',
    ddFeatures: ['Kontroller anpassade efter din stack', 'Ingen kloning, ingen kodkörning', 'Delbar rapport'],
    ddPrice: '$9',
    ddNote: 'per månad · eller $5 för 7 dagar',
    ddPay: 'Skanna ett repo',
    ddPricing: 'Se priser',
    ddFree: 'Gratis — 3 skanningar per dag',
    liveBody: 'Kontinuerlig attestering av drifttid med ett signerat, tidsstämplat spår.',
    liveFeatures: ['Kontinuerliga drifttidskontroller', 'Signerat, tidsstämplat spår'],
    failBody: 'Åtkomstkontroll som nekar direkt så fort någon del av kontrollen är osäker.',
    failFeatures: ['Nekad som standard', 'Minsta osäkerhet ger nekad'],
    failVisit: 'Besök Failclosed',
    partnerTitle: 'Samarbeta med Nytto Labs',
    partnerBody: 'Partnerskap och allmänna frågor går till samma inkorg. Ni behåller kassa, betalning och leverans.',
    partnerCta: 'Bli partner',
  },
}

const cardStyle = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.025)',
}

function PayCard({ name, price, note, body, features, actions }) {
  return (
    <article
      className="flex h-full flex-col rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_var(--card-accent)]"
      style={{ ...cardStyle, '--card-accent': `${accent}55`, borderColor: 'var(--card-border, rgba(255,255,255,0.08))' }}
      onMouseEnter={(e) => e.currentTarget.style.setProperty('--card-border', `${accent}4d`)}
      onMouseLeave={(e) => e.currentTarget.style.setProperty('--card-border', 'rgba(255,255,255,0.08)')}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-white">{name}</h2>
        {price && <p className="text-2xl font-black leading-none tracking-tight" style={{ color: accent }}>{price}</p>}
      </div>
      {note && <p className="mt-1 font-mono text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>{note}</p>}
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>

      <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-1 flex-col justify-end gap-2.5">{actions}</div>
    </article>
  )
}

export default function ProductsView() {
  const [locale, setLocale] = useLocale()
  const t = COPY[locale]

  const payBtn =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02]'
  const ghostBtn =
    'inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-medium transition-colors hover:text-white'
  const freeBtn = 'inline-flex min-h-11 items-center justify-center gap-1 text-sm transition-colors hover:text-white'

  return (
    <PageShell accent={accent} wide eyebrow={t.eyebrow} title={t.hero} lead={t.lede}>
      <section className="mx-auto max-w-6xl px-5 pb-4 2xl:max-w-[1560px]">
        <div className="mb-6 flex justify-end">
          <div
            className="inline-flex overflow-hidden rounded-full text-xs font-medium"
            style={{ border: '1px solid rgba(255,255,255,0.14)' }}
          >
            {['en', 'sv'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className="min-h-9 px-4 uppercase tracking-wider transition-colors"
                style={
                  locale === l
                    ? { background: accent, color: '#03030c' }
                    : { color: 'rgba(255,255,255,0.5)' }
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PayCard
            name="DeployDoctor"
            price={t.ddPrice}
            note={t.ddNote}
            body={t.ddBody}
            features={t.ddFeatures}
            actions={
              <>
                <a href={DEPLOYDOCTOR} className={payBtn} style={{ background: accent, color: '#03030c' }}>
                  {t.ddPay} <ArrowRight className="h-4 w-4" />
                </a>
                <a href={DEPLOYDOCTOR_PRICING} className={ghostBtn} style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                  {t.ddPricing}
                </a>
                <a href={DEPLOYDOCTOR} className={freeBtn} style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t.ddFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
          <PayCard
            name="CycleTag"
            price={t.cyclePrice}
            note={t.cycleNote}
            body={t.cycleBody}
            features={t.cycleFeatures}
            actions={
              <>
                <a href={CYCLE_SHEET} className={payBtn} style={{ background: accent, color: '#03030c' }}>
                  {t.cyclePay} <ArrowRight className="h-4 w-4" />
                </a>
                <a href={CYCLE_BULK} className={ghostBtn} style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                  {t.cycleBulk}
                </a>
                <a href={CYCLE_FREE} className={freeBtn} style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t.cycleFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
          <PayCard
            name="Vatidence"
            price={t.viesPrice}
            note={t.viesNote}
            body={t.viesBody}
            features={t.viesFeatures}
            actions={
              <>
                <a href={VATIDENCE_PAY} className={payBtn} style={{ background: accent, color: '#03030c' }}>
                  {t.viesPay} <ArrowRight className="h-4 w-4" />
                </a>
                <span className="hidden min-h-11 md:block" aria-hidden />
                <a href={VATIDENCE_PAY} className={freeBtn} style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t.viesFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
          <PayCard
            name="Curl-to-Buy"
            price={t.curlPrice}
            note={t.curlNote}
            body={t.curlBody}
            features={t.curlFeatures}
            actions={
              <>
                <a href={CURL_PAY} className={payBtn} style={{ background: accent, color: '#03030c' }}>
                  {t.curlPay} <ArrowRight className="h-4 w-4" />
                </a>
                <span className="hidden min-h-11 md:block" aria-hidden />
                <a href={CURL_PAY} className={freeBtn} style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t.curlFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
          <PayCard
            name="LiveProof"
            body={t.liveBody}
            features={t.liveFeatures}
            actions={null}
          />
          <PayCard
            name="Failclosed"
            body={t.failBody}
            features={t.failFeatures}
            actions={
              <a href={FAILCLOSED} className={payBtn} style={{ background: accent, color: '#03030c' }}>
                {t.failVisit} <ArrowRight className="h-4 w-4" />
              </a>
            }
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 2xl:max-w-[1560px]">
        <div
          className="flex flex-col items-start justify-between gap-6 rounded-2xl p-8 backdrop-blur-sm md:flex-row md:items-center"
          style={cardStyle}
        >
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white">{t.partnerTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.partnerBody}</p>
          </div>
          <Link
            href="/partners"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.03]"
            style={{ background: accent, color: '#03030c' }}
          >
            {t.partnerCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
