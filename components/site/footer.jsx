'use client'

import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { TOOLS, toolCopy } from '@/lib/tools'
import { useLocale } from '@/hooks/use-locale'
import Logo from './logo'

const COPY = {
  en: {
    about: 'Small tools that finish the job. Each one lives under its own name, on its own site.',
    company: 'Company',
    tools: 'Tools',
    links: [['/products', 'Price list'], ['/fix', 'Custom work'], ['/partners', 'Partners'], ['/contact', 'Contact'], ['/privacy', 'Privacy policy'], ['/terms', 'Terms']],
    rights: 'All rights reserved.',
    cookies: 'No analytics cookies. Payments via Stripe.',
  },
  sv: {
    about: 'Små verktyg som gör klart jobbet. Vart och ett har sitt eget namn och sin egen sajt.',
    company: 'Företaget',
    tools: 'Verktyg',
    links: [['/products', 'Prislista'], ['/fix', 'Uppdrag'], ['/partners', 'Partner'], ['/contact', 'Kontakt'], ['/privacy', 'Integritetspolicy'], ['/terms', 'Villkor']],
    rights: 'Alla rättigheter förbehållna.',
    cookies: 'Inga analyskakor. Betalning via Stripe.',
    identity: 'Nytto Labs drivs av Fredrik Kornelind (Sverige). Godkänd för F‑skatt.',
    disclosure: 'Vissa länkar i Nytto Labs produkter är partnerlänkar. Nytto Labs kan få ersättning när du väljer en partner, utan extra kostnad för dig om inget annat anges tydligt.',
  },
}

export default function SiteFooter() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const s = usePublicSettings()
  const linkCls = 'inline-flex min-h-8 items-center text-ink-2 transition-colors hover:text-ink'

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">{t.about}</p>
            <a href={`mailto:${PUBLIC_HELLO_EMAIL}`} className="nl-link mt-4 inline-flex min-h-8 items-center font-medium text-ink">
              {PUBLIC_HELLO_EMAIL}
            </a>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-faded">
              {locale === 'sv' ? t.disclosure : s.affiliateDisclosure}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="nl-label">{t.company}</p>
            <ul className="mt-4 space-y-0.5 text-[15px]">
              {t.links.map(([href, label]) => (
                <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="nl-label">{t.tools}</p>
            <ul className="mt-4 space-y-0.5 text-[15px]">
              {TOOLS.map((tool) => (
                <li key={tool.name}>
                  <a href={tool.url} className={`${linkCls} gap-2`}>
                    <span className="font-medium text-ink">{tool.name}</span>
                    <span className="text-faded">{toolCopy(tool, locale).category}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs leading-relaxed text-faded md:flex-row md:flex-wrap md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Nytto Labs. {t.rights}</span>
          <span>{locale === 'sv' ? t.identity : FOOTER_IDENTITY_LINE}</span>
          <span>
            {t.cookies}{' '}
            <Link href="/privacy" className="nl-link text-ink-2">{locale === 'sv' ? 'Integritet' : 'Privacy'}</Link>
          </span>
        </div>
      </div>

      {/* The wordmark, set large and cut off by the page edge. */}
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-semibold leading-[0.8] tracking-[-0.06em]"
        style={{ fontSize: 'clamp(4.5rem, 18.5vw, 16.5rem)', marginBottom: '-0.14em', color: 'var(--nl-canvas-2)' }}
      >
        Nytto Labs
      </p>
    </footer>
  )
}
