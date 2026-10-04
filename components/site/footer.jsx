'use client'

import Link from 'next/link'
import { usePublicProducts, usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

// Short descriptors for the footer list; the list itself comes from the catalog.
const FOOTER_LABELS = {
  deploydoctor: 'DeployDoctor Vercel checks',
  cycletag: 'StayTag reorder labels',
  viesproof: 'Vatidence VAT checks',
  'curl-to-buy': 'Nytto Checkout file sales',
  failclosed: 'Failclosed inventory sync',
  'csv-rescue': 'CSV Rescue file cleanup',
}

export default function SiteFooter({ accent = '#00f5ff' }) {
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
              Swedish software company. Each product lives under its own name and its own site.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {s.affiliateDisclosure}
            </p>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.26em]" style={{ color: accent }}>
              Company
            </div>
            <ul className="mt-4 space-y-1.5 text-sm" style={muted}>
              <li><Link href="/" className={linkCls}>Home</Link></li>
              <li><Link href="/products" className={linkCls}>Products</Link></li>
              <li><Link href="/partners" className={linkCls}>Partners</Link></li>
              <li><Link href="/contact" className={linkCls}>Contact</Link></li>
              <li><Link href="/privacy" className={linkCls}>Privacy policy</Link></li>
              <li><Link href="/terms" className={linkCls}>Terms</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.26em]" style={{ color: accent }}>
              Products
            </div>
            <ul className="mt-4 space-y-1.5 text-sm" style={muted}>
              {listedProducts.map((p) => {
                const label = FOOTER_LABELS[p.slug] || p.name
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
              <li><Link href="/products" className={linkCls}>All products</Link></li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-2 pt-6 text-xs md:flex-row md:items-center md:justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
        >
          <span>© {new Date().getFullYear()} Nytto Labs. All rights reserved.</span>
          <span>
            No analytics cookies. Payments via Stripe.{' '}
            <Link href="/privacy" className="transition-colors duration-200 hover:text-white">
              Privacy →
            </Link>
          </span>
          <span>
            {FOOTER_IDENTITY_LINE}
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
