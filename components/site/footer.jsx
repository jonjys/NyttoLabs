'use client'

import Link from 'next/link'
import { usePublicProducts, usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'
import { PRODUCT_COPY_SV } from './product-copy'

// Short descriptors for the footer list; the list itself comes from the catalog.
const FOOTER_LABELS = {
  deploydoctor: 'DeployDoctor Vercel checks',
  cycletag: 'StayTag reorder labels',
  viesproof: 'Vatidence VAT checks',
  'curl-to-buy': 'Nytto Checkout file sales',
  failclosed: 'Failclosed inventory sync',
  'csv-rescue': 'CSV Rescue file cleanup',
}

const COPY = {
  en: {
    about: 'Swedish software company. Each product lives under its own name and its own site.',
    company: 'Company',
    products: 'Products',
    links: [['/', 'Home'], ['/products', 'Products'], ['/partners', 'Partners'], ['/contact', 'Contact'], ['/privacy', 'Privacy policy'], ['/terms', 'Terms']],
    all: 'All products',
    rights: 'All rights reserved.',
    cookies: 'No analytics cookies. Payments via Stripe.',
    privacy: 'Privacy →',
  },
  sv: {
    about: 'Svenskt mjukvaruföretag. Varje produkt har sitt eget namn och sin egen sajt.',
    company: 'Företaget',
    products: 'Produkter',
    links: [['/', 'Hem'], ['/products', 'Produkter'], ['/partners', 'Partner'], ['/contact', 'Kontakt'], ['/privacy', 'Integritetspolicy'], ['/terms', 'Villkor']],
    all: 'Alla produkter',
    rights: 'Alla rättigheter förbehållna.',
    cookies: 'Inga analyskakor. Betalning via Stripe.',
    privacy: 'Integritet →',
    identity: 'Nytto Labs drivs av Fredrik Kornelind (Sverige). Godkänd för F‑skatt.',
    disclosure: 'Vissa länkar i Nytto Labs produkter är partnerlänkar. Nytto Labs kan få ersättning när du väljer en partner, utan extra kostnad för dig om inget annat anges tydligt.',
  },
}

export default function SiteFooter({ accent = '#00f5ff' }) {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const s = usePublicSettings()
  // Same set and order as the home page: live products only.
  const all = (usePublicProducts() || []).filter(Boolean)
  const listedProducts = all.filter((p) => p.status === 'live')
  const helloEmail = s.helloEmail || PUBLIC_HELLO_EMAIL

  const linkCls = 'inline-flex min-h-8 items-center transition-colors duration-200 hover:text-white'
  const muted = { color: 'rgba(255,255,255,0.6)' }

  return (
    <footer
      className="relative mt-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.35)' }}
    >
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded"
                style={{ background: accent, boxShadow: `0 0 14px ${accent}99` }}
              >
                <span className="block h-2 w-2 rounded-full" style={{ background: '#03030c' }} />
              </span>
              <span className="font-mono text-xs tracking-[0.3em] text-white">NYTTO LABS</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed" style={muted}>
              {t.about}
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {locale === 'sv' ? t.disclosure : s.affiliateDisclosure}
            </p>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.26em]" style={{ color: accent }}>
              {t.company}
            </div>
            <ul className="mt-4 space-y-1.5 text-sm" style={muted}>
              {t.links.map(([href, label]) => (
                <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.26em]" style={{ color: accent }}>
              {t.products}
            </div>
            <ul className="mt-4 space-y-1.5 text-sm" style={muted}>
              {listedProducts.map((p) => {
                const label = (locale === 'sv' ? PRODUCT_COPY_SV[p.slug]?.footer : FOOTER_LABELS[p.slug]) || p.name
                return (
                  <li key={p.slug}>
                    {p.url ? (
                      <a href={p.url} className={linkCls}>{label}</a>
                    ) : (
                      <span className="inline-flex min-h-8 items-center">{label}</span>
                    )}
                  </li>
                )
              })}
              <li><Link href="/products" className={linkCls}>{t.all}</Link></li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-2 pt-6 text-xs md:flex-row md:items-center md:justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
        >
          <span>© {new Date().getFullYear()} Nytto Labs. {t.rights}</span>
          <span>
            {t.cookies}{' '}
            <Link href="/privacy" className="transition-colors duration-200 hover:text-white">
              {t.privacy}
            </Link>
          </span>
          <span>
            {locale === 'sv' ? t.identity : FOOTER_IDENTITY_LINE}
            {' · '}
            <a href={`mailto:${helloEmail}`} className="transition-colors duration-200 hover:text-white">
              {helloEmail}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
