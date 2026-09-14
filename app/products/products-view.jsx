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

const COPY = {
  en: {
    eyebrow: 'Products · Swedish software · F-tax',
    hero: 'Three things you can pay for today.',
    lede: 'CycleTag, Vatidence and Curl-to-Buy. Focused products, live now — not a roadmap.',
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
    partnerTitle: 'Work with Nytto Labs',
    partnerBody: 'Partnerships and general questions go to the same inbox. You keep checkout, payment and fulfilment.',
    partnerCta: 'Become a partner',
  },
  sv: {
    eyebrow: 'Produkter · Svensk mjukvara · F-skatt',
    hero: 'Tre saker du kan betala för idag.',
    lede: 'CycleTag, Vatidence och Curl-to-Buy. Fokuserade produkter, live nu — ingen roadmap.',
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
        <p className="text-2xl font-black leading-none tracking-tight" style={{ color: accent }}>{price}</p>
      </div>
      <p className="mt-1 font-mono text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>{note}</p>
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

        <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
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
