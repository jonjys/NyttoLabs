'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, QrCode, BadgeCheck } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'

export default function HomeView() {
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
            Nytto Labs · Sverige
          </span>
          <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            Två verktyg. Redo direkt.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4a4a3e]">
            CycleTag och VIESproof är i skarp drift. Välj ditt verktyg nedan — inget konto krävs för att komma igång.
          </p>
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
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">
              QR-återbeställningsetiketter. Skanna för att hitta rätt reservdel igen — ingen app, inget konto.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                Köp ark – 49 kr <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://cycletag.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30"
              >
                Bulk – 299 kr
              </a>
            </div>
            <a href="https://cycletag.eu/" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:text-emerald-900">
              Gratis – skapa en tagg utan kostnad <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex flex-col rounded-2xl border border-black/10 bg-white p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">VIESproof</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">
              EU-momskontroll mot VIES, med exporterbart bevis för bokföringen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://viesproof.eu/"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                Betala från 4,90 € <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <a href="https://viesproof.eu/" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:text-emerald-900">
              Gratis – enstaka kontroll <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {otherProducts.length > 0 && (
          <p className="mt-8 text-sm text-[#6a6858]">
            Fler verktyg från Nytto Labs?{' '}
            <Link href="/products" className="font-medium text-emerald-800 hover:text-emerald-900">
              Se alla produkter →
            </Link>
          </p>
        )}
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold">Samarbeta med Nytto Labs</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">
              Partnerskap och allmänna frågor går till samma inkorg. Ni behåller kassa, betalning och leverans — vi
              sköter relevant, tydligt märkt vidarekoppling där en produkt behöver det.
            </p>
          </div>
          <Link
            href="/partners"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] hover:bg-black"
          >
            Bli partner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
