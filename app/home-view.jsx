'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    kicker: 'Swedish software · F-tax',
    hero: 'Two things you can pay for today.',
    lede: 'Nytto Labs builds small tools for reordering and VAT evidence. CycleTag and VIESproof take payment. The rest of the lab is on Products.',
    cycleBody: 'QR reorder labels for filters, toner and the things you replace. Print, stick, scan. No app.',
    cyclePrice: '49 SEK',
    cycleNote: 'starter sheet · one-time',
    cyclePay: 'Buy a sheet',
    cycleBulk: 'Bulk 299 SEK',
    cycleFree: 'Free — make one tag',
    viesBody: 'EU VAT checks against VIES, with a sealed PDF + CSV for the books.',
    viesPrice: '€4.90',
    viesNote: 'minimum per batch · one-time',
    viesPay: 'Pay and verify',
    viesFree: 'Free — a single check',
    more: 'Seven more tools live in the lab. They are not for sale yet.',
    all: 'See the lab →',
    partnerTitle: 'Work with Nytto Labs',
    partnerBody:
      'Partnerships and general questions go to the same inbox. You keep checkout, payment and fulfilment.',
    partnerCta: 'Become a partner',
  },
  sv: {
    kicker: 'Svensk mjukvara · F-skatt',
    hero: 'Två saker du kan betala för idag.',
    lede: 'Nytto Labs bygger små verktyg för återbeställning och momsbevis. CycleTag och VIESproof tar betalt. Resten av labbet ligger under Produkter.',
    cycleBody: 'QR-etiketter för filter, toner och det du byter. Skriv ut, klistra, skanna. Ingen app.',
    cyclePrice: '49 kr',
    cycleNote: 'startark · engångsköp',
    cyclePay: 'Köp ett ark',
    cycleBulk: 'Bulk 299 kr',
    cycleFree: 'Gratis — gör en tagg',
    viesBody: 'EU-momskontroll mot VIES, med förseglad PDF + CSV till bokföringen.',
    viesPrice: '4,90 €',
    viesNote: 'minimum per batch · engångsköp',
    viesPay: 'Betala och verifiera',
    viesFree: 'Gratis — enstaka kontroll',
    more: 'Sju verktyg till ligger i labbet. De är inte till salu än.',
    all: 'Se labbet →',
    partnerTitle: 'Samarbeta med Nytto Labs',
    partnerBody:
      'Partnerskap och allmänna frågor går till samma inkorg. Ni behåller kassa, betalning och leverans.',
    partnerCta: 'Bli partner',
  },
}

const QR = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
]

function TagMock() {
  return (
    <div className="rounded-xl border border-dashed border-black/20 bg-[#f7f5f0] p-3">
      <div className="flex items-center gap-3">
        <div
          className="grid shrink-0 gap-px bg-[#1b1b16] p-1"
          style={{ gridTemplateColumns: `repeat(${QR.length}, 3px)` }}
          aria-hidden
        >
          {QR.flat().map((bit, i) => (
            <span key={i} className={`size-[3px] ${bit ? 'bg-[#1b1b16]' : 'bg-[#f7f5f0]'}`} />
          ))}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">CycleTag · live</p>
          <p className="mt-1 font-serif text-lg leading-tight">Filter 10 µm</p>
          <p className="text-xs text-[#6a6858]">Scan. Reorder. Repeat.</p>
        </div>
      </div>
    </div>
  )
}

function ViesMock() {
  return (
    <div className="rounded-xl border border-black/10 bg-[#f7f5f0] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">VIES consultation</p>
      <p className="mt-2 font-mono text-xs tracking-wide text-[#1b1b16]">SE556012345601</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-[#6a6858]">PDF + CSV · SHA-256</p>
        <span className="rounded-sm bg-emerald-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Valid</span>
      </div>
    </div>
  )
}

export default function HomeView() {
  const [locale] = useLocale()
  const t = COPY[locale]
  const products = usePublicProducts()
  const otherProducts = groupPublicProductsByStatus(products)
    .flatMap((group) => group.list)
    .filter((p) => p.slug !== 'cycletag' && p.slug !== 'viesproof')

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-5 pt-16 pb-10 sm:pt-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#6a6858]">
            {t.kicker}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            {t.hero}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4a4a3e]">{t.lede}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 sm:p-7">
            <TagMock />
            <div className="mt-5 flex items-end justify-between gap-3">
              <h2 className="text-xl font-semibold">CycleTag</h2>
              <p className="font-serif text-3xl leading-none tracking-tight">{t.cyclePrice}</p>
            </div>
            <p className="mt-1 text-right text-xs text-[#6a6858]">{t.cycleNote}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.cycleBody}</p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                {t.cyclePay} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30"
              >
                {t.cycleBulk}
              </a>
              <a href="https://cycletag.eu/" className="inline-flex min-h-11 items-center justify-center gap-1 text-sm text-[#6a6858] hover:text-[#1b1b16]">
                {t.cycleFree} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 sm:p-7">
            <ViesMock />
            <div className="mt-5 flex items-end justify-between gap-3">
              <h2 className="text-xl font-semibold">VIESproof</h2>
              <p className="font-serif text-3xl leading-none tracking-tight">{t.viesPrice}</p>
            </div>
            <p className="mt-1 text-right text-xs text-[#6a6858]">{t.viesNote}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.viesBody}</p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="https://viesproof.eu/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                {t.viesPay} <ArrowRight className="h-4 w-4" />
              </a>
              <a href="https://viesproof.eu/" className="inline-flex min-h-11 items-center justify-center gap-1 text-sm text-[#6a6858] hover:text-[#1b1b16]">
                {t.viesFree} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {otherProducts.length > 0 && (
          <p className="mt-8 text-sm text-[#6a6858]">
            {t.more}{' '}
            <Link href="/products" className="font-medium text-emerald-800 hover:text-emerald-900">
              {t.all}
            </Link>
          </p>
        )}
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold">{t.partnerTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.partnerBody}</p>
          </div>
          <Link
            href="/partners"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] hover:bg-black"
          >
            {t.partnerCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
