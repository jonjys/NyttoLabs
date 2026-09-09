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
    heroAlt: 'A QR reorder label stuck to a water filter.',
    cycleAlt: 'Printed CycleTag labels on filters and toner.',
    viesAlt: 'A VAT evidence sheet stamped valid.',
    cycleBody: 'QR reorder labels for filters, toner and the things you replace. Print, stick, scan. No app.',
    cyclePrice: '$5',
    cycleNote: '49 SEK at checkout · starter sheet',
    cyclePay: 'Buy a sheet',
    cycleBulk: 'Bulk $31',
    cycleFree: 'Free — make one tag',
    viesBody: 'EU VAT checks against VIES, with a sealed PDF + CSV for the books.',
    viesPrice: '$6',
    viesNote: '€4.90 at checkout · minimum per batch',
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
    heroAlt: 'En QR-återbeställningsetikett på ett vattenfilter.',
    cycleAlt: 'Utskrivna CycleTag-etiketter på filter och toner.',
    viesAlt: 'Ett momsbevis stämplat giltigt.',
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

function PayCard({ img, alt, name, price, note, body, actions }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-[#ece8de]">
        <img src={img} alt={alt} width={1200} height={750} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
          <p className="font-serif text-3xl leading-none tracking-tight">{price}</p>
        </div>
        <p className="mt-1 text-right text-xs text-[#6a6858]">{note}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-[#4a4a3e]">{body}</p>
        <div className="mt-6 flex flex-col gap-2">{actions}</div>
      </div>
    </article>
  )
}

const payBtn =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900'
const ghostBtn =
  'inline-flex min-h-11 items-center justify-center rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30'
const freeBtn =
  'inline-flex min-h-11 items-center justify-center gap-1 text-sm text-[#6a6858] hover:text-[#1b1b16]'

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

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 sm:pt-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#6a6858]">
            {t.kicker}
          </span>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl">
            {t.hero}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4a4a3e]">{t.lede}</p>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-black/10 bg-[#ece8de]">
          <img
            src="/images/hero.jpg"
            alt={t.heroAlt}
            width={1600}
            height={900}
            className="aspect-video w-full object-cover"
          />
        </figure>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <PayCard
            img="/images/cycletag.jpg"
            alt={t.cycleAlt}
            name="CycleTag"
            price={t.cyclePrice}
            note={t.cycleNote}
            body={t.cycleBody}
            actions={
              <>
                <a href="https://buy.stripe.com/aFafZgculf7o8uA7aZ8og0r" className={payBtn}>
                  {t.cyclePay} <ArrowRight className="h-4 w-4" />
                </a>
                <a href="https://buy.stripe.com/28E4gy65X4sK9yE52R8og0q" className={ghostBtn}>
                  {t.cycleBulk}
                </a>
                <a href="https://cycletag.eu/#create" className={freeBtn}>
                  {t.cycleFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
          <PayCard
            img="/images/viesproof.jpg"
            alt={t.viesAlt}
            name="VIESproof"
            price={t.viesPrice}
            note={t.viesNote}
            body={t.viesBody}
            actions={
              <>
                <a href="https://viesproof.eu/" className={payBtn}>
                  {t.viesPay} <ArrowRight className="h-4 w-4" />
                </a>
                <span className="hidden min-h-11 md:block" aria-hidden />
                <a href="https://viesproof.eu/" className={freeBtn}>
                  {t.viesFree} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </>
            }
          />
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
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl font-normal tracking-tight">{t.partnerTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">{t.partnerBody}</p>
          </div>
          <Link
            href="/partners"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] hover:bg-black"
          >
            {t.partnerCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
