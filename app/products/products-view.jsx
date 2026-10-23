'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageShell from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { TOOLS, toolCopy, toolHost } from '@/lib/tools'

// The price list. Every row comes from lib/tools.js, so the prices here are
// the same as on the home page, in the currency each tool charges.
const COPY = {
  en: {
    eyebrow: 'Price list',
    hero: `${TOOLS.length} tools. One price list.`,
    lede: 'Compare what each tool does, its starting offer and its price. These are the prices you pay there, in the currency you are charged.',
    cols: ['Tool', 'Getting started', 'Price'],
    free: 'Getting started',
    price: 'Price',
    note: 'Prices as listed on each tool’s own site, October 2026.',
    customName: 'Custom work',
    customCategory: 'Sites, scripts and fixes',
    customJob: 'Something no tool here does yet. Describe the job and what done looks like.',
    customFree: 'Asking costs nothing',
    customPrice: 'A fixed quote per job',
    customCta: 'Send the job',
    subject: 'Fix this',
    partnerTitle: 'Selling something our users need?',
    partnerBody: 'You keep checkout, payment and delivery. We send relevant buyers your way and disclose every sponsored placement.',
    partnerCta: 'Become a partner',
  },
  sv: {
    eyebrow: 'Prislista',
    hero: `${TOOLS.length} verktyg. En prislista.`,
    lede: 'Jämför vad verktygen gör, vad du kan börja med och vad det kostar. Här är priserna du betalar där, i valutan du debiteras i.',
    cols: ['Verktyg', 'Kom igång', 'Pris'],
    free: 'Kom igång',
    price: 'Pris',
    note: 'Priser enligt respektive verktygs egen sajt, oktober 2026.',
    customName: 'Uppdrag',
    customCategory: 'Sajter, skript och lagningar',
    customJob: 'Något som inget verktyg här gör ännu. Beskriv jobbet och hur det ser ut när det är klart.',
    customFree: 'Att fråga kostar inget',
    customPrice: 'Fast offert per jobb',
    customCta: 'Skicka uppdraget',
    subject: 'Fixa det här',
    partnerTitle: 'Säljer ni något våra användare behöver?',
    partnerBody: 'Ni behåller kassa, betalning och leverans. Vi skickar relevanta köpare till er och redovisar varje sponsrad placering.',
    partnerCta: 'Bli partner',
  },
}

const ROW = 'grid gap-4 px-5 py-6 sm:px-7 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_12.5rem] md:items-center md:gap-6'

function Row({ serial, name, category, job, host, free, price, cta, href, labels }) {
  return (
    <article className={`${ROW} border-t border-line transition-colors first:border-t-0 hover:bg-[rgba(246,246,243,0.6)]`}>
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-faded">{serial}</span>
          <h2 className="text-[21px] font-semibold tracking-[-0.025em] text-ink">{name}</h2>
        </div>
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.13em] text-iris">{category}</p>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">{job}</p>
        {host && <p className="mt-2 font-mono text-[11.5px] text-faded">{host}</p>}
      </div>
      <div>
        <p className="nl-label md:hidden">{labels.free}</p>
        <p className="mt-1 text-[15px] leading-snug text-ink-2 md:mt-0">{free}</p>
      </div>
      <div>
        <p className="nl-label md:hidden">{labels.price}</p>
        <p className="mt-1 text-[15px] font-semibold leading-snug text-ink md:mt-0">{price}</p>
      </div>
      <div className="md:justify-self-end">
        <a href={href} className="nl-btn nl-btn-ghost nl-btn-sm whitespace-nowrap">
          {cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  )
}

export default function ProductsView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const mail = `mailto:${PUBLIC_HELLO_EMAIL}?subject=${encodeURIComponent(t.subject)}`

  return (
    <PageShell wide eyebrow={t.eyebrow} title={t.hero} lead={t.lede}>
      <section className="mx-auto max-w-6xl px-5">
        <div className="nl-card overflow-hidden">
          <div className={`${ROW} hidden border-b border-line bg-canvas py-3.5 md:grid`}>
            {t.cols.map((c) => (
              <p key={c} className="nl-label">{c}</p>
            ))}
            <span />
          </div>
          {TOOLS.map((tool, i) => {
            const c = toolCopy(tool, locale)
            return (
              <Row
                key={tool.name}
                serial={String(i + 1).padStart(2, '0')}
                name={tool.name}
                category={c.category}
                job={c.job}
                host={toolHost(tool)}
                free={c.free}
                price={c.price}
                cta={c.cta}
                href={tool.url}
                labels={t}
              />
            )
          })}
          <Row
            serial="—"
            name={t.customName}
            category={t.customCategory}
            job={t.customJob}
            host={PUBLIC_HELLO_EMAIL}
            free={t.customFree}
            price={t.customPrice}
            cta={t.customCta}
            href={mail}
            labels={t}
          />
        </div>
        <p className="mt-4 text-sm text-faded">{t.note}</p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="nl-card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">{t.partnerTitle}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t.partnerBody}</p>
          </div>
          <Link href="/partners" className="nl-btn shrink-0">
            {t.partnerCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
