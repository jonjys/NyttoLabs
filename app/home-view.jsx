'use client'

import { useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import {
  PUBLIC_HELLO_EMAIL,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PRIVACY_EMAIL,
  PUBLIC_BILLING_EMAIL,
} from '@/lib/relay/catalog'
import SiteFooter from '@/components/site/footer'
import { Aurora, CursorHalo, Intro, ScrollRail, SmoothScroll } from '@/components/home/effects'
import {
  Header,
  Hero,
  Lobby,
  PartnersContact,
  Products,
  RelayStory,
  Scope,
  Statement,
  Ticker,
  Wordmark,
} from '@/components/home/sections'

const NAV_LINKS = [
  { href: '#products', label: 'Products' },
  { href: '#relay', label: 'Relay' },
  { href: '#partners', label: 'Partners' },
]

const FACTS_BASE = [
  { value: '1', label: 'Routing layer' },
  { value: 'SE', label: 'Built in Sweden' },
]

const TICKER_ROWS = [
  { tag: 'RESOLVE ', text: 'cycletag · reorder · SE → partner allowlist' },
  { tag: 'VERIFY ', text: 'vatidence · VIES consultation number stored' },
  { tag: 'DELIVER ', text: 'curl-to-buy · file sold, link expires in 24h' },
  { tag: 'FAIL-CLOSED ', text: 'no approved destination → no redirect' },
]

const STEPS = [
  { n: '01', title: 'Intent appears', body: 'A scan, a VAT lookup, an API call — a moment where someone needs a next step.' },
  { n: '02', title: 'Relay resolves', body: 'Deterministic match against approved partners and allowlisted destination templates.' },
  { n: '03', title: 'Attribution recorded', body: 'A safe redirect through /go carries a click id; conversions arrive on a signed webhook.' },
  { n: '04', title: 'Or nothing happens', body: 'No approved answer means no redirect. Fail-closed beats a bad recommendation.' },
]

// What the resolver terminal types out as the Relay section scrolls by.
const TERMINAL_LINES = [
  { parts: [{ t: 'POST /api/resolve' }] },
  {
    accent: '0,245,255',
    parts: [
      { t: '{ "app": ' },
      { t: '"cycletag"', c: '#00f5ff' },
      { t: ', "action": ' },
      { t: '"reorder"', c: '#00f5ff' },
      { t: ', "country": ' },
      { t: '"SE"', c: '#00f5ff' },
      { t: ' }' },
    ],
  },
  { kind: 'wire', label: 'MATCH · ALLOWLIST' },
  {
    accent: '0,255,157',
    parts: [{ t: '200 OK', c: '#00ff9d' }, { t: ' · { "click_id": "c_8f3a…", "fallback": false }' }],
  },
  { kind: 'wire', label: 'NO MATCH', fail: true },
  {
    accent: '255,43,209',
    parts: [{ t: 'FAIL-CLOSED', c: '#ff2bd1' }, { t: ' · no approved destination → no redirect' }],
  },
]

const NOTS = [
  'No inventory',
  'No packaging',
  'No third-party checkout',
  'No shipping or returns',
  'No dropshipping',
  'No warehouse',
  'No fake partners or prices',
  'No analytics cookies',
]

const INBOXES = [
  { email: PUBLIC_HELLO_EMAIL, use: 'General + partners' },
  { email: PUBLIC_SUPPORT_EMAIL, use: 'Product support' },
  { email: PUBLIC_PRIVACY_EMAIL, use: 'Data requests' },
  { email: PUBLIC_BILLING_EMAIL, use: 'Invoices' },
]

const PRODUCT_IMAGES = {
  CycleTag: '/images/cycletag.jpg',
  Vatidence: '/images/vatidence.jpg',
  'Curl-to-Buy': '/images/curl-to-buy.jpg',
}

const DOORS = [
  { key: 'partners', color: '255,43,209', hex: '#ff2bd1', spinDeg: 0, spinDur: '11s', floatDur: '8s', rippleDelay: '0s', label: 'PARTNERS', desc: 'Integrations & referrals' },
  { key: 'products', color: '0,255,157', hex: '#00ff9d', spinDeg: 140, spinDur: '9s', floatDur: '7s', rippleDelay: '1.2s', label: 'PRODUCTS', desc: 'Things you can buy today' },
  { key: 'contact', color: '255,138,30', hex: '#ff8a1e', spinDeg: 260, spinDur: '13s', floatDur: '9s', rippleDelay: '2.4s', label: 'CONTACT', desc: 'A real inbox, no funnel' },
]

const STATEMENT =
  'Partners keep checkout, payment, VAT, delivery, returns and product support. We keep the software honest.'

function hostOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export default function HomeView() {
  const [ready, setReady] = useState(false)
  const allProducts = usePublicProducts()

  const products = useMemo(
    () =>
      (allProducts || [])
        .filter((p) => p.status === 'live')
        .map((p) => ({
          name: p.name,
          category: p.category,
          status: 'Live',
          dot: '#00ff9d',
          accent: '0,245,255',
          market: p.primaryMarket,
          host: hostOf(p.url),
          url: p.url,
          desc: p.description,
          image: PRODUCT_IMAGES[p.name],
        })),
    [allProducts],
  )

  const facts = useMemo(
    () => [{ value: String(products.length), label: 'Live products' }, ...FACTS_BASE],
    [products.length],
  )

  const productLede =
    'No bundles, no suite. Three live products you can open and pay for right now. Anything unfinished stays off this page.'
  const showcaseLede = 'CycleTag, Vatidence and Curl-to-Buy — all live, all priced, all with their own site.'

  const rooms = [
    {
      key: 'partners',
      color: '255,43,209',
      hex: '#ff2bd1',
      eyebrow: 'PARTNERS ROOM',
      title: 'If your product touches ours, there is probably a reason to talk.',
      body: 'Integrations, referrals and co-built tools. You keep checkout and fulfilment; we route high-intent users to approved destinations only.',
      href: '#partners',
      cta: 'Open Partners →',
    },
    {
      key: 'products',
      color: '0,255,157',
      hex: '#00ff9d',
      eyebrow: 'PRODUCT SHOWCASE',
      title: 'Three things you can pay for today.',
      body: showcaseLede,
      href: '#products',
      cta: 'What you can buy →',
    },
    {
      key: 'contact',
      color: '255,138,30',
      hex: '#ff8a1e',
      eyebrow: 'CONTACT ROOM',
      title: 'A real inbox, read by the people who write the code.',
      body: 'No ticket queue, no sales funnel. hello@ for general and partnerships; support@, privacy@ and billing@ for the rest.',
      href: `mailto:${PUBLIC_HELLO_EMAIL}`,
      cta: 'Write to hello@ →',
    },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <div className="nl-home">
        <Intro onDone={() => setReady(true)} />
        <SmoothScroll />
        <Aurora />
        <CursorHalo />
        <ScrollRail />
        <Header links={NAV_LINKS} email={PUBLIC_HELLO_EMAIL} ready={ready} />

        <main style={{ position: 'relative', zIndex: 10 }}>
          <Hero ready={ready} facts={facts} />
          <Lobby doors={DOORS} rooms={rooms} />
          <Ticker rows={TICKER_ROWS} />
          <Products products={products} lede={productLede} />
          <RelayStory steps={STEPS} lines={TERMINAL_LINES} />
          <Scope nots={NOTS} />
          <Statement text={STATEMENT} />
          <PartnersContact email={PUBLIC_HELLO_EMAIL} inboxes={INBOXES} />
          <Wordmark />
        </main>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <SiteFooter accent="#00f5ff" />
        </div>
      </div>
    </MotionConfig>
  )
}
