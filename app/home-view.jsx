'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import {
  PUBLIC_HELLO_EMAIL,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PRIVACY_EMAIL,
  PUBLIC_BILLING_EMAIL,
} from '@/lib/relay/catalog'
import SiteFooter from '@/components/site/footer'

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
const TICKER_LOOP = TICKER_ROWS.concat(TICKER_ROWS)

const STEPS = [
  { n: '01', title: 'Intent appears', body: 'A scan, a VAT lookup, an API call — a moment where someone needs a next step.' },
  { n: '02', title: 'Relay resolves', body: 'Deterministic match against approved partners and allowlisted destination templates.' },
  { n: '03', title: 'Attribution recorded', body: 'A safe redirect through /go carries a click id; conversions arrive on a signed webhook.' },
  { n: '04', title: 'Or nothing happens', body: 'No approved answer means no redirect. Fail-closed beats a bad recommendation.' },
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

function hostOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// Fades a section in on first scroll intersection, mirroring the design's
// IntersectionObserver reveal system (with a fallback timer for browsers
// without IO support). Index staggers the delay the same way the original
// (i % 5) * 0.06s formula does.
function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (typeof IntersectionObserver !== 'function') {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(node)
    const fallback = setTimeout(() => setVisible(true), 2200)
    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`nl-reveal ${visible ? 'nl-revealed' : ''} ${className}`}
      style={{ transitionDelay: `${(index % 5) * 0.06}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' }
const serifItalic = { fontFamily: 'var(--font-serif), Georgia, serif', fontStyle: 'italic', fontWeight: 400 }

export default function HomeView() {
  const [narrow, setNarrow] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [room, setRoom] = useState(null)
  const barRef = useRef(null)
  const allProducts = usePublicProducts()

  useEffect(() => {
    const onResize = () => {
      const next = window.innerWidth < 860
      setNarrow(next)
      if (!next) setMenuOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const bar = barRef.current
    const scroller = document.scrollingElement || document.documentElement
    const onScroll = () => {
      if (!bar) return
      const max = scroller.scrollHeight - window.innerHeight
      bar.style.width = `${max > 0 ? Math.min(100, (scroller.scrollTop / max) * 100) : 0}%`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const products = useMemo(
    () =>
      (allProducts || [])
        .filter((p) => p.status === 'live')
        .map((p) => ({
          name: p.name,
          category: p.category,
          status: 'Live',
          dot: '#00ff9d',
          market: p.primaryMarket,
          host: hostOf(p.url),
          url: p.url,
          desc: p.description,
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

  const closeRoom = () => setRoom(null)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div
      style={{
        position: 'relative',
        background: '#03030c',
        color: '#fff',
        fontFamily: "'Instrument Sans', var(--font-sans), system-ui, sans-serif",
        overflowX: 'clip',
        minHeight: '100%',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(#000 0%, #000 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(#000 0%, #000 55%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -320,
          left: '50%',
          width: 1100,
          height: 900,
          marginLeft: -550,
          pointerEvents: 'none',
          background: 'radial-gradient(closest-side, rgba(0,245,255,0.14), transparent 72%)',
          filter: 'blur(20px)',
          animation: 'nl-drift 16s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 620,
          right: -240,
          width: 720,
          height: 720,
          pointerEvents: 'none',
          background: 'radial-gradient(closest-side, rgba(255,43,209,0.09), transparent 70%)',
          filter: 'blur(10px)',
          animation: 'nl-drift 22s ease-in-out infinite reverse',
        }}
      />

      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 70, height: 2, background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          ref={barRef}
          style={{
            width: '0%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,245,255,0.3), #00f5ff)',
            boxShadow: '0 0 12px rgba(0,245,255,0.7)',
            transition: 'width 0.12s linear',
          }}
        />
      </div>

      <header style={{ position: 'sticky', top: 0, zIndex: 60, padding: '18px 20px 6px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            maxWidth: 1100,
            margin: '0 auto',
            height: 56,
            padding: '0 22px',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 999,
            background: 'rgba(3,3,12,0.72)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
            animation: 'nl-fade 0.8s ease both',
          }}
        >
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, color: '#fff' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                flex: 'none',
                borderRadius: 6,
                background: '#00f5ff',
                boxShadow: '0 0 14px rgba(0,245,255,0.6)',
              }}
            >
              <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#03030c', animation: 'nl-pulse 2.6s ease-in-out infinite' }} />
            </span>
            <span style={{ ...mono, fontSize: 11, letterSpacing: '0.3em', whiteSpace: 'nowrap' }}>NYTTO LABS</span>
          </a>

          {!narrow && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="nl-nav-link"
                  style={{ ...mono, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.55)' }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`mailto:${PUBLIC_HELLO_EMAIL}`}
                className="nl-nav-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 36,
                  padding: '0 16px',
                  border: '1px solid rgba(0,245,255,0.35)',
                  borderRadius: 999,
                  ...mono,
                  fontSize: 10,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: '#00f5ff',
                }}
              >
                Get in touch
              </a>
            </nav>
          )}

          {narrow && (
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                flex: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 999,
                background: 'transparent',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {narrow && menuOpen && (
          <div
            style={{
              display: 'grid',
              gap: 2,
              maxWidth: 1100,
              margin: '8px auto 0',
              padding: '10px 18px 14px',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 20,
              background: 'rgba(3,3,12,0.92)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 46,
                  ...mono,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`mailto:${PUBLIC_HELLO_EMAIL}`}
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 46,
                marginTop: 8,
                borderRadius: 999,
                background: '#00f5ff',
                color: '#03030c',
                ...mono,
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Get in touch
            </a>
          </div>
        )}
      </header>

      <main id="top" style={{ position: 'relative', zIndex: 10, maxWidth: 1140, margin: '0 auto', padding: '0 20px 96px' }}>
        <section style={{ padding: '84px 0 64px' }}>
          <div style={{ maxWidth: '46rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 14px',
                border: '1px solid rgba(0,245,255,0.22)',
                borderRadius: 999,
                background: 'rgba(0,245,255,0.05)',
                animation: 'nl-fade 1s ease 0.1s both',
              }}
            >
              <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#00f5ff', animation: 'nl-pulse 1.8s ease-in-out infinite' }} />
              <span style={{ ...mono, fontSize: 9, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.6)' }}>
                SWEDISH SOFTWARE COMPANY · F-TAX APPROVED
              </span>
            </div>

            <h1
              style={{
                margin: '26px 0 0',
                fontSize: 'clamp(2.6rem, 6.4vw, 4.6rem)',
                lineHeight: 0.96,
                letterSpacing: '-0.035em',
                fontWeight: 700,
                textWrap: 'balance',
              }}
            >
              <span style={{ display: 'block', animation: 'nl-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}>
                Focused software.
              </span>
              <span
                style={{
                  display: 'block',
                  ...serifItalic,
                  letterSpacing: '-0.01em',
                  color: '#00f5ff',
                  animation: 'nl-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both',
                }}
              >
                Invisible infrastructure.
              </span>
            </h1>

            <p
              style={{
                margin: '24px 0 0',
                maxWidth: '34rem',
                fontSize: 17,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.5)',
                textWrap: 'pretty',
                animation: 'nl-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s both',
              }}
            >
              We build small products that finish a job — VAT proof, reorder labels, API spend limits — and one routing
              layer underneath them that turns real intent into the right next action.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34, animation: 'nl-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}>
              <a
                href="#products"
                className="nl-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  minHeight: 48,
                  padding: '0 24px',
                  borderRadius: 10,
                  background: '#00f5ff',
                  color: '#03030c',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                What you can buy today <span style={mono}>→</span>
              </a>
              <a
                href="#relay"
                className="nl-cta-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 48,
                  padding: '0 22px',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 10,
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                How Relay works
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, marginTop: 44, animation: 'nl-fade 1.2s ease 0.9s both' }}>
              {facts.map((fact) => (
                <div key={fact.label} style={{ minWidth: 108 }}>
                  <div style={{ ...serifItalic, fontStyle: 'normal', fontSize: 30, lineHeight: 1, color: '#fff' }}>{fact.value}</div>
                  <div style={{ marginTop: 8, ...mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)', animation: 'nl-fade 1.2s ease 0.7s both' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)' }}>
                THREE DOORS · PICK ONE AND WALK THROUGH
              </span>
              {room && (
                <button
                  type="button"
                  onClick={closeRoom}
                  className="nl-back-link"
                  style={{ border: 0, background: 'transparent', padding: 0, ...mono, fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                >
                  ← BACK TO LOBBY
                </button>
              )}
            </div>

            {!room && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                  gap: 28,
                  marginTop: 36,
                  justifyItems: 'center',
                }}
              >
                <Orb
                  onClick={() => setRoom('partners')}
                  color="255,43,209"
                  hex="#ff2bd1"
                  spinDeg={0}
                  spinDur="11s"
                  floatDur="8s"
                  floatDelay="0s"
                  rippleDelay="0s"
                  label="PARTNERS"
                  desc="Integrations & referrals"
                />
                <Orb
                  onClick={() => setRoom('products')}
                  color="0,255,157"
                  hex="#00ff9d"
                  spinDeg={140}
                  spinDur="9s"
                  floatDur="7s"
                  floatDelay="0.5s"
                  rippleDelay="1.2s"
                  label="PRODUCTS"
                  desc="Things you can buy today"
                />
                <Orb
                  onClick={() => setRoom('contact')}
                  color="255,138,30"
                  hex="#ff8a1e"
                  spinDeg={260}
                  spinDur="13s"
                  floatDur="9s"
                  floatDelay="1s"
                  rippleDelay="2.4s"
                  label="CONTACT"
                  desc="A real inbox, no funnel"
                />
              </div>
            )}

            {room === 'partners' && (
              <RoomPanel color="255,43,209" hex="#ff2bd1" eyebrow="PARTNERS ROOM">
                <h2 style={roomHeadingStyle}>If your product touches ours, there is probably a reason to talk.</h2>
                <p style={roomBodyStyle}>
                  Integrations, referrals and co-built tools. You keep checkout and fulfilment; we route high-intent
                  users to approved destinations only.
                </p>
                <div style={roomActionsStyle}>
                  <a href="#partners" onClick={closeRoom} style={{ ...roomPrimaryBtn, background: '#ff2bd1' }}>
                    Open Partners →
                  </a>
                  <button type="button" onClick={closeRoom} style={roomGhostBtn}>
                    ← Back to lobby
                  </button>
                </div>
              </RoomPanel>
            )}

            {room === 'products' && (
              <RoomPanel color="0,255,157" hex="#00ff9d" eyebrow="PRODUCT SHOWCASE">
                <h2 style={roomHeadingStyle}>Three things you can pay for today.</h2>
                <p style={roomBodyStyle}>{showcaseLede}</p>
                <div style={roomActionsStyle}>
                  <a href="#products" onClick={closeRoom} style={{ ...roomPrimaryBtn, background: '#00ff9d' }}>
                    What you can buy →
                  </a>
                  <button type="button" onClick={closeRoom} style={roomGhostBtn}>
                    ← Back to lobby
                  </button>
                </div>
              </RoomPanel>
            )}

            {room === 'contact' && (
              <RoomPanel color="255,138,30" hex="#ff8a1e" eyebrow="CONTACT ROOM">
                <h2 style={roomHeadingStyle}>A real inbox, read by the people who write the code.</h2>
                <p style={roomBodyStyle}>
                  No ticket queue, no sales funnel. hello@ for general and partnerships; support@, privacy@ and billing@
                  for the rest.
                </p>
                <div style={roomActionsStyle}>
                  <a href={`mailto:${PUBLIC_HELLO_EMAIL}`} style={{ ...roomPrimaryBtn, background: '#ff8a1e' }}>
                    Write to hello@ →
                  </a>
                  <button type="button" onClick={closeRoom} style={roomGhostBtn}>
                    ← Back to lobby
                  </button>
                </div>
              </RoomPanel>
            )}
          </div>
        </section>

        <Reveal
          as="section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 0',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(90deg, #03030c 0%, transparent 12%, transparent 88%, #03030c 100%)',
              zIndex: 2,
            }}
          />
          <div style={{ display: 'flex', width: 'max-content', gap: 48, animation: 'nl-marquee 34s linear infinite' }}>
            {TICKER_LOOP.map((row, i) => (
              <span
                key={`${row.tag}-${i}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 12, ...mono, fontSize: 10, letterSpacing: '0.16em', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.32)' }}
              >
                <span style={{ color: '#00f5ff' }}>{row.tag}</span>
                {row.text}
              </span>
            ))}
          </div>
        </Reveal>

        <section id="products" style={{ padding: '88px 0 0' }}>
          <Reveal style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
            <div>
              <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>01 · PORTFOLIO</div>
              <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', lineHeight: 1.04, letterSpacing: '-0.03em', fontWeight: 700 }}>
                Each product lives under
                <br />
                its own name.
              </h2>
            </div>
            <p style={{ maxWidth: '24rem', margin: 0, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.42)' }}>{productLede}</p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16, marginTop: 40 }}>
            {products.map((p, i) => (
              <Reveal
                key={p.name}
                as="a"
                index={i + 1}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="nl-product-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  padding: 24,
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.016)',
                  color: '#fff',
                  transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ ...mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.34)' }}>
                    {p.category}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '4px 10px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 999,
                      ...mono,
                      fontSize: 8,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.55)',
                    }}
                  >
                    <span style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: p.dot }} />
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.name}</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.46)', textWrap: 'pretty' }}>{p.desc}</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: 'auto',
                    paddingTop: 6,
                    ...mono,
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <span>{p.market}</span>
                  <span style={{ color: '#00f5ff' }}>{p.host} →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal
          as="section"
          id="relay"
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginTop: 96,
            padding: 44,
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            background: 'linear-gradient(140deg, rgba(0,245,255,0.05), rgba(255,43,209,0.035) 60%, rgba(3,3,12,0) 100%)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.07), transparent)',
              animation: 'nl-sweep 9s ease-in-out infinite',
            }}
          />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 34 }}>
            <div>
              <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>02 · RELAY</div>
              <h2 style={{ margin: '14px 0 16px', fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontWeight: 700 }}>
                Intent in.
                <br />
                <span style={serifItalic}>Useful next action out.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.46)', textWrap: 'pretty' }}>
                Products create or detect commercial intent. Relay resolves it deterministically against an allowlist
                of approved partner destinations, records attribution, and fails closed when no good answer exists.
              </p>
            </div>

            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                background: 'linear-gradient(180deg, rgba(10,10,26,0.92), rgba(3,3,12,0.92))',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '34%',
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, rgba(0,245,255,0.09), transparent)',
                  animation: 'nl-scan 7s linear infinite',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: '#00f5ff', animation: 'nl-pulse 1.6s ease-in-out infinite' }} />
                <span style={{ ...mono, fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.45)' }}>RESOLVER · EXAMPLE PAYLOAD</span>
              </div>
              <div style={{ display: 'grid', gap: 12, padding: '18px 16px 20px', ...mono, fontSize: 11, lineHeight: 1.7 }}>
                <div style={{ color: 'rgba(255,255,255,0.3)' }}>POST /api/resolve</div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderLeft: '2px solid rgba(0,245,255,0.5)',
                    background: 'rgba(0,245,255,0.04)',
                    color: 'rgba(255,255,255,0.62)',
                    wordBreak: 'break-word',
                  }}
                >
                  {'{ "app": '}
                  <span style={{ color: '#00f5ff' }}>&quot;cycletag&quot;</span>
                  {', "action": '}
                  <span style={{ color: '#00f5ff' }}>&quot;reorder&quot;</span>
                  {', "country": '}
                  <span style={{ color: '#00f5ff' }}>&quot;SE&quot;</span>
                  {' }'}
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, height: 18, color: 'rgba(255,255,255,0.25)' }}>
                  <span style={{ position: 'relative', flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: -2,
                        left: 0,
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: '#00f5ff',
                        boxShadow: '0 0 10px rgba(0,245,255,0.9)',
                        animation: 'nl-travel 2.4s cubic-bezier(0.45,0,0.55,1) infinite',
                      }}
                    />
                  </span>
                  <span style={{ fontSize: 9, letterSpacing: '0.2em' }}>MATCH · ALLOWLIST</span>
                </div>
                <div style={{ padding: '10px 12px', borderLeft: '2px solid rgba(0,255,157,0.5)', background: 'rgba(0,255,157,0.04)', color: 'rgba(255,255,255,0.62)', wordBreak: 'break-word' }}>
                  <span style={{ color: '#00ff9d' }}>200 OK</span> · {'{ "click_id": "c_8f3a…", "fallback": false }'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.28)' }}>
                  ${' '}
                  <span style={{ animation: 'nl-blink 1.1s steps(1,end) infinite' }}>▌</span>
                </div>
              </div>
            </div>

            {STEPS.map((s) => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <span style={{ ...mono, fontSize: 9, letterSpacing: '0.22em', color: '#00f5ff' }}>{s.n}</span>
                <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{s.title}</span>
                <span style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.42)' }}>{s.body}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" style={{ marginTop: 96 }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>03 · SCOPE</div>
          <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontWeight: 700 }}>
            What we deliberately don&rsquo;t do.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12, marginTop: 28 }}>
            {NOTS.map((n) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 18px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.012)',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                <span style={{ ...mono, fontSize: 13, color: 'rgba(255,43,209,0.8)' }}>✕</span>
                {n}
              </div>
            ))}
          </div>
          <p style={{ margin: '22px 0 0', maxWidth: '46rem', fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.34)' }}>
            Partners keep checkout, payment, VAT, delivery, returns and product support. We keep the software honest.
          </p>
        </Reveal>

        <Reveal
          as="section"
          id="partners"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16, marginTop: 96 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 34, border: '1px solid rgba(0,245,255,0.22)', borderRadius: 18, background: 'rgba(0,245,255,0.045)' }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>PARTNERS</div>
            <h3 style={{ margin: 0, fontSize: 26, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 700 }}>
              If your product touches ours, there is probably a reason to talk.
            </h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)' }}>
              You keep checkout and fulfilment. We connect high-intent users to a relevant next action, on approved
              domains only.
            </p>
            <a
              href={`mailto:${PUBLIC_HELLO_EMAIL}`}
              className="nl-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                alignSelf: 'flex-start',
                minHeight: 46,
                marginTop: 6,
                padding: '0 22px',
                borderRadius: 10,
                background: '#00f5ff',
                color: '#03030c',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Open a partner thread <span style={mono}>→</span>
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 34, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, background: 'rgba(255,255,255,0.016)' }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>CONTACT</div>
            <h3 style={{ margin: 0, fontSize: 26, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 700 }}>
              A real inbox, read by the people who write the code.
            </h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)' }}>No ticket queue, no sales funnel.</p>
            <div style={{ display: 'grid', gap: 8, marginTop: 4, ...mono, fontSize: 12 }}>
              {INBOXES.map((i) => (
                <div key={i.email} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <a href={`mailto:${i.email}`} className="nl-inbox-link" style={{ color: '#fff', letterSpacing: '-0.01em' }}>
                    {i.email}
                  </a>
                  <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{i.use}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter accent="#00f5ff" />

      <style jsx>{`
        .nl-nav-link:hover {
          color: #fff;
        }
        .nl-nav-cta:hover {
          background: rgba(0, 245, 255, 0.12);
          color: #00f5ff;
        }
        .nl-cta-primary:hover {
          background: #7ffbff;
        }
        .nl-cta-secondary:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
        }
        .nl-back-link:hover {
          color: #fff;
        }
        .nl-product-card:hover {
          border-color: rgba(0, 245, 255, 0.38) !important;
          background: rgba(0, 245, 255, 0.045) !important;
          transform: translateY(-4px);
        }
        .nl-inbox-link:hover {
          color: #00f5ff;
        }
      `}</style>
    </div>
  )
}

const roomHeadingStyle = {
  margin: '16px 0 0',
  maxWidth: '30rem',
  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  fontWeight: 700,
}
const roomBodyStyle = { margin: '16px 0 0', maxWidth: '34rem', fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)' }
const roomActionsStyle = { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }
const roomPrimaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  minHeight: 46,
  padding: '0 22px',
  borderRadius: 10,
  color: '#03030c',
  fontSize: 14,
  fontWeight: 700,
}
const roomGhostBtn = {
  minHeight: 46,
  padding: '0 20px',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 10,
  background: 'transparent',
  color: 'rgba(255,255,255,0.6)',
  fontSize: 14,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
}

function Orb({ onClick, color, hex, spinDeg, spinDur, floatDur, floatDelay, rippleDelay, label, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nl-orb"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 250,
        aspectRatio: '1',
        border: 0,
        padding: 0,
        background: 'transparent',
        cursor: 'pointer',
        animation: `nl-float ${floatDur} ease-in-out ${floatDelay} infinite`,
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from ${spinDeg}deg, transparent 0deg, rgba(${color},0.75) 90deg, transparent 220deg)`,
          animation: `nl-spin ${spinDur} linear infinite`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 3,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 42%, rgba(${color},0.22), rgba(3,3,12,0.96) 68%)`,
          boxShadow: `inset 0 0 60px rgba(${color},0.25), 0 0 70px rgba(${color},0.16)`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px solid rgba(${color},0.45)`,
          animation: `nl-ripple 4.5s ease-out ${rippleDelay} infinite`,
        }}
      />
      <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 10, letterSpacing: '0.3em', color: hex }}>{label}</span>
        <span style={{ maxWidth: '72%', fontSize: 14, lineHeight: 1.35, color: 'rgba(255,255,255,0.68)' }}>{desc}</span>
        <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.3)' }}>ENTER →</span>
      </span>
      <style jsx>{`
        .nl-orb:hover {
          transform: scale(1.06);
        }
      `}</style>
    </button>
  )
}

function RoomPanel({ color, hex, eyebrow, children }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: 36,
        padding: 40,
        border: `1px solid rgba(${color},0.34)`,
        borderRadius: 20,
        background: `radial-gradient(120% 140% at 12% 0%, rgba(${color},0.14), rgba(3,3,12,0.9) 62%)`,
        boxShadow: `0 0 70px rgba(${color},0.14)`,
        animation: 'nl-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 9, letterSpacing: '0.34em', color: hex }}>{eyebrow}</div>
      {children}
    </div>
  )
}
