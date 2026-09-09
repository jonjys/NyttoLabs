'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, QrCode, BadgeCheck } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    kicker: 'Nytto Labs · Sweden',
    hero: 'Two things you can pay for today.',
    lede: 'CycleTag and VIESproof take payment. The rest of the lab is on Products — no account to start.',
    cycleBody: 'QR reorder labels. Scan to find the right refill again — no app, no account.',
    cyclePay: 'Buy a sheet – 49 SEK',
    cycleBulk: 'Bulk – 299 SEK',
    cycleFree: 'Free – make a tag at no cost',
    viesBody: 'EU VAT checks against VIES, with exportable evidence for the books.',
    viesPay: 'Pay from €4.90',
    viesFree: 'Free – a single check',
    more: 'More tools from Nytto Labs?',
    all: 'See all products →',
    partnerTitle: 'Work with Nytto Labs',
    partnerBody:
      'Partnerships and general questions go to the same inbox. You keep checkout, payment and fulfilment — we handle relevant, labelled routing where a product needs it.',
    partnerCta: 'Become a partner',
  },
  sv: {
    kicker: 'Nytto Labs · Sverige',
    hero: 'Två saker du kan betala för idag.',
    lede: 'CycleTag och VIESproof tar betalt. Resten av labbet ligger under Produkter — inget konto för att börja.',
    cycleBody: 'QR-återbeställningsetiketter. Skanna för att hitta rätt reservdel igen — ingen app, inget konto.',
    cyclePay: 'Köp ark – 49 kr',
    cycleBulk: 'Bulk – 299 kr',
    cycleFree: 'Gratis – skapa en tagg utan kostnad',
    viesBody: 'EU-momskontroll mot VIES, med exporterbart bevis för bokföringen.',
    viesPay: 'Betala från 4,90 €',
    viesFree: 'Gratis – enstaka kontroll',
    more: 'Fler verktyg från Nytto Labs?',
    all: 'Se alla produkter →',
    partnerTitle: 'Samarbeta med Nytto Labs',
    partnerBody:
      'Partnerskap och allmänna frågor går till samma inkorg. Ni behåller kassa, betalning och leverans — vi sköter relevant, tydligt märkt vidarekoppling där en produkt behöver det.',
    partnerCta: 'Bli partner',
  },
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
          <div className="flex flex-col rounded-2xl border border-black/10 bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <QrCode className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">CycleTag</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.cycleBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                {t.cyclePay} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30"
              >
                {t.cycleBulk}
              </a>
            </div>
            <a href="https://cycletag.eu/" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:text-emerald-900">
              {t.cycleFree} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex flex-col rounded-2xl border border-black/10 bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">VIESproof</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.viesBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://viesproof.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                {t.viesPay} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <a href="https://viesproof.eu/" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:text-emerald-900">
              {t.viesFree} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
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
