'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { SITE_NAV_CTA } from '@/components/site/nav-links'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import SiteFooter from '@/components/site/footer'
import { API_ENDPOINTS, HELLO_EMAIL, HELLO_HREF, PRODUCT_ANCHORS, PRODUCT_CTA_LABELS, STEPS, showcaseProducts } from '@/components/landing/data'
import type { PublicProduct } from '@/components/landing/types'
import IntentField from './intent-field'
import RelaySim from './relay-sim'
import s from './landing-v2.module.css'

// Pricing / free-tier copy is marketing copy, not catalog data — kept here, keyed by catalog slug.
const PRICING: Record<string, { price: string; note: string; free: string }> = {
  deploydoctor: { price: '$9', note: 'per month · or $5 for a 7-day pass', free: '3 scans a day' },
  cycletag: { price: '$5', note: '49 SEK at checkout · starter sheet', free: 'make one tag' },
  viesproof: { price: '$6', note: '€4.90 at checkout · minimum per batch', free: 'a single check' },
  'curl-to-buy': { price: '5%', note: 'fee · you keep 95%', free: 'to create · 5% only when it sells' },
  failclosed: { price: 'Sync', note: 'starts in watch-only mode', free: 'watch-only until you say otherwise' },
  'csv-rescue': { price: '29 SEK', note: 'per prepared file · no subscription', free: 'preview before you pay' },
}
const SAT_COLORS: Record<string, string> = { deploydoctor: '#00f5ff', cycletag: '#00ff9d', viesproof: '#00f5ff', 'curl-to-buy': '#ff2bd1', failclosed: '#ff8a1e', 'csv-rescue': '#00ff9d' }
const SAT_POS = [['50%', '4%'], ['92%', '28%'], ['92%', '72%'], ['50%', '96%'], ['8%', '72%'], ['8%', '28%']]
const NAV = [{ href: '#products', label: 'Products' }, { href: '#relay', label: 'Relay' }, { href: '#partners', label: 'Partners' }, { href: '#contact', label: 'Contact' }]
const TICKER = [
  ['SCAN', 'deploydoctor · github.com/example/shop → 3 issues, 0 blockers'],
  ['RESOLVE', 'staytag · reorder · SE → partner allowlist'],
  ['VERIFY', 'vatidence · VIES consultation number stored'],
  ['DELIVER', 'nytto checkout · file sold, link expires in 24h'],
  ['SYNC', 'failclosed · warehouse 40 · shop 12 → repaired'],
  ['FIX', 'csv rescue · utf-8 · leading zeros kept'],
  ['FAIL-CLOSED', 'no approved destination → no redirect'],
]
const NOTS = ['No inventory', 'No packaging', 'No third-party checkout', 'No shipping or returns', 'No dropshipping', 'No warehouse', 'No fake partners or prices', 'No analytics cookies']
const ROOMS = {
  products: { c: '#00ff9d', tag: 'PRODUCT SHOWCASE', title: 'Six things you can open and pay for today.', body: 'DeployDoctor, StayTag, Vatidence, Nytto Checkout, Failclosed and CSV Rescue — live now, not a roadmap. Each on its own site, each with a free way in.', cta: 'Find your tool →', href: '#products' },
  partners: { c: '#ff2bd1', tag: 'PARTNERS ROOM', title: 'If your product touches ours, there is probably a reason to talk.', body: 'Integrations, referrals and co-built tools. You keep checkout and fulfilment; we route high-intent users to approved destinations only.', cta: 'Open Partners →', href: '#partners' },
  contact: { c: '#ff8a1e', tag: 'CONTACT ROOM', title: 'A real inbox, read by the people who write the code.', body: 'No ticket queue, no sales funnel. General questions and partnerships go to the same inbox.', cta: 'Write to hello@ →', href: HELLO_HREF },
} as const
type Room = keyof typeof ROOMS

function hostOf(url: string) { try { return new URL(url).hostname } catch { return url } }
function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
function orbVars(c: string, from: string, spin: string, dur: string, delay: string): CSSProperties {
  return { '--c': c, '--c75': alpha(c, 0.75), '--c45': alpha(c, 0.45), '--c25': alpha(c, 0.25), '--c22': alpha(c, 0.22), '--c16': alpha(c, 0.16), '--from': from, '--spin': spin, '--dur': dur, '--delay': delay } as CSSProperties
}
function roomVars(c: string): CSSProperties {
  return { '--c': c, '--c34': alpha(c, 0.34), '--c26': alpha(c, 0.26), '--c12': alpha(c, 0.12), '--c10': alpha(c, 0.1) } as CSSProperties
}

export default function LandingV2() {
  const all = usePublicProducts() as ReadonlyArray<PublicProduct | null>
  const products = useMemo(() => showcaseProducts(all), [all])
  const [room, setRoom] = useState<Room | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(`.${s.reveal}`) ?? [])
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(s.revealed); io.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    nodes.forEach((n) => io.observe(n))
    const t = window.setTimeout(() => nodes.forEach((n) => n.classList.add(s.revealed)), 2200)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [products.length])

  const anchorOf = (p: PublicProduct) => PRODUCT_ANCHORS[p.slug] ?? p.slug
  const current = room ? ROOMS[room] : null

  return (
    <div ref={rootRef} className={s.root}>
      <IntentField className={s.canvas} />
      <div className={s.bgGrid} aria-hidden="true" />
      <div className={s.glowA} aria-hidden="true" />
      <div className={s.glowB} aria-hidden="true" />
      <div className={s.progress} aria-hidden="true"><div ref={barRef} className={s.progressBar} /></div>

      <header className={s.header}>
        <div className={s.headerBar}>
          <a href="#top" className={s.brand}><span className={s.brandMark}><span className={s.brandDot} /></span><span className={`${s.brandText} ${s.mono}`}>NYTTO LABS</span></a>
          <nav className={s.nav} aria-label="Sections">
            {NAV.map((l) => <a key={l.href} href={l.href} className={`${s.navLink} ${s.mono}`}>{l.label}</a>)}
            <Link href={SITE_NAV_CTA.href} className={`${s.navCta} ${s.mono}`}>{SITE_NAV_CTA.label}</Link>
          </nav>
          <button type="button" className={s.menuBtn} onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}>{menuOpen ? '✕' : '☰'}</button>
        </div>
        {menuOpen && (
          <div className={s.menu}>
            {NAV.map((l) => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className={`${s.menuLink} ${s.mono}`}>{l.label}</a>)}
            <Link href={SITE_NAV_CTA.href} className={`${s.menuCta} ${s.mono}`}>{SITE_NAV_CTA.label}</Link>
          </div>
        )}
      </header>

      <main id="top" className={s.main}>
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <span className={`${s.pill} ${s.mono}`}><span className={s.pillDot} aria-hidden="true" />SWEDISH SOFTWARE COMPANY · F-TAX APPROVED</span>
              <h1 id="hero-title" className={s.h1}>
                <span className={s.h1Line}>Check VAT. Catch deploy errors.</span>
                <span className={s.h1Alt}>Sell digital files.</span>
              </h1>
              <p className={s.lede}>Practical tools for EU VAT checks, Vercel deployment checks and digital file sales. Plus QR reorder labels, inventory sync and CSV cleanup. Choose the tool for the job and open it directly.</p>
              <div className={s.ctaRow}>
                <a href="#products" className={s.btnPrimary}>Find your tool <span className={s.mono}>→</span></a>
                <Link href="/products" className={s.btnGhost}>Compare products &amp; pricing</Link>
              </div>
              <div className={s.facts}>
                {[[String(products.length), 'Live products'], ['1', 'Routing layer'], ['SE', 'Built in Sweden']].map(([v, l]) => (
                  <div key={l} className={s.fact}><div className={s.factValue}>{v}</div><div className={`${s.factLabel} ${s.mono}`}>{l}</div></div>
                ))}
              </div>
            </div>

            <div className={s.orbit} aria-hidden="true">
              <div className={s.ringOuter} /><div className={s.ringInner} />
              <div className={s.orbitA}><span /></div><div className={s.orbitB}><span /></div>
              <div className={s.core}><span className={`${s.coreTag} ${s.mono}`}>RELAY</span><span className={`${s.coreWord} ${s.serif}`}>routing</span></div>
              {products.slice(0, 6).map((p, i) => (
                <a key={p.slug} href={`#${anchorOf(p)}`} className={`${s.sat} ${s.mono}`} style={{ left: SAT_POS[i][0], top: SAT_POS[i][1], '--c': SAT_COLORS[p.slug] ?? '#00f5ff' } as CSSProperties}>
                  <span className={s.satDot} />{p.name.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div className={`${s.hint} ${s.mono}`} aria-hidden="true">↳ MOVE YOUR CURSOR — EVERY PARTICLE IS AN INTENT BEING ROUTED</div>

          <div className={s.lobby}>
            <div className={s.lobbyHead}>
              <span className={`${s.lobbyLabel} ${s.mono}`}>THREE DOORS · PICK ONE AND WALK THROUGH</span>
              {room && <button type="button" onClick={() => setRoom(null)} className={`${s.backLink} ${s.mono}`}>← BACK TO LOBBY</button>}
            </div>
            {!room ? (
              <div className={s.orbs}>
                {([
                  ['products', 'PRODUCTS', 'Six tools, all live', orbVars('#00ff9d', '140deg', '9s', '7s', '0s')],
                  ['partners', 'PARTNERS', 'Integrations & referrals', orbVars('#ff2bd1', '0deg', '11s', '8s', '0.5s')],
                  ['contact', 'CONTACT', 'A real inbox, no funnel', orbVars('#ff8a1e', '260deg', '13s', '9s', '1s')],
                ] as [Room, string, string, CSSProperties][]).map(([key, tag, sub, vars]) => (
                  <button key={key} type="button" onClick={() => setRoom(key)} className={s.orb} style={vars}>
                    <span className={s.orbRing} aria-hidden="true" /><span className={s.orbBody} aria-hidden="true" /><span className={s.orbRipple} aria-hidden="true" />
                    <span className={s.orbText}>
                      <span className={`${s.orbTag} ${s.mono}`}>{tag}</span>
                      <span className={s.orbSub}>{sub}</span>
                      <span className={`${s.orbEnter} ${s.mono}`}>ENTER →</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : current && (
              <div className={s.room} style={roomVars(current.c)}>
                <div className={`${s.roomTag} ${s.mono}`}>{current.tag}</div>
                <h2 className={s.roomTitle}>{current.title}</h2>
                <p className={s.roomBody}>{current.body}</p>
                <div className={s.roomBtns}>
                  <a href={current.href} onClick={() => room !== 'contact' && setRoom(null)} className={s.roomPrimary}>{current.cta}</a>
                  <button type="button" onClick={() => setRoom(null)} className={s.roomBack}>← Back to lobby</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={`${s.ticker} ${s.reveal}`} aria-hidden="true">
          <div className={s.tickerFade} />
          <div className={s.tickerRow}>
            {[...TICKER, ...TICKER].map(([tag, text], i) => <span key={i} className={`${s.tickerItem} ${s.mono}`}><b>{tag}</b>{text}</span>)}
          </div>
        </section>

        <section id="products" className={s.section} aria-labelledby="products-title">
          <div className={`${s.sectionHead} ${s.reveal}`}>
            <div>
              <div className={`${s.eyebrow} ${s.mono}`}>01 · PORTFOLIO</div>
              <h2 id="products-title" className={s.h2}>Pick a tool.<br /><i>Finish the job.</i></h2>
            </div>
            <p className={s.sectionLede}>Six live products, each under its own name and its own site. Every one has a free way in. <Link href="/products">Compare pricing →</Link></p>
          </div>
          <div className={s.grid}>
            {products.map((p) => {
              const pr = PRICING[p.slug]
              return (
                <a key={p.slug} id={anchorOf(p)} href={p.url} target="_blank" rel="noreferrer" className={`${s.card} ${s.reveal}`}>
                  <div className={s.cardTop}>
                    <span className={`${s.cardCat} ${s.mono}`}>{p.category}</span>
                    <span className={`${s.status} ${s.mono}`}><span className={s.statusDot} />Live</span>
                  </div>
                  <div className={s.cardName}><strong>{p.name}</strong>{pr && <span className={s.price}>{pr.price}</span>}</div>
                  {pr && <div className={`${s.priceNote} ${s.mono}`}>{pr.note}</div>}
                  <p className={s.cardDesc}>{p.description}</p>
                  {pr && <div className={`${s.free} ${s.mono}`}><b>free</b> {pr.free}</div>}
                  <div className={`${s.cardFoot} ${s.mono}`}>
                    <span>{p.primaryMarket} · {hostOf(p.url)}</span><b>{PRODUCT_CTA_LABELS[p.slug] ?? `Open ${p.name}`} →</b>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        <section id="relay" className={`${s.relay} ${s.reveal}`} aria-labelledby="relay-title">
          <div className={s.relaySweep} aria-hidden="true" />
          <div className={s.relayGrid}>
            <RelaySim apps={products.map((p) => ({ name: p.name, slug: p.slug }))} />
            {STEPS.map((st) => (
              <div key={st.n} className={s.step}>
                <span className={`${s.stepN} ${s.mono}`}>{st.n}</span><span className={s.stepTitle}>{st.title}</span><span className={s.stepBody}>{st.body}</span>
              </div>
            ))}
          </div>
          <div className={s.endpoints}>
            {API_ENDPOINTS.map((e) => <span key={e.id} className={`${s.endpoint} ${s.mono}`}><b>{e.method}</b>{e.path}</span>)}
            <span className={`${s.endpointNote} ${s.mono}`}>DETERMINISTIC · FAIL-CLOSED</span>
          </div>
        </section>

        <section className={`${s.scope} ${s.reveal}`}>
          <div className={`${s.eyebrow} ${s.mono}`}>03 · SCOPE</div>
          <h2 className={s.h2Small}>What we deliberately don&apos;t do.</h2>
          <div className={s.nots}>{NOTS.map((n) => <div key={n} className={s.not}><b className={s.mono}>✕</b>{n}</div>)}</div>
          <p className={s.scopeNote}>Partners keep checkout, payment, VAT, delivery, returns and product support. We keep the software honest.</p>
        </section>

        <section id="partners" className={`${s.duo} ${s.reveal}`} aria-labelledby="partners-title">
          <div className={s.duoCard} style={roomVars('#ff2bd1')}>
            <div className={`${s.duoTag} ${s.mono}`}>PARTNERS</div>
            <h3 id="partners-title" className={s.h3}>If your product touches ours, there is probably a reason to talk.</h3>
            <p className={s.duoBody}>You keep checkout and fulfilment. We connect high-intent users to a relevant next action, on approved domains only.</p>
            <a href={HELLO_HREF} className={`${s.roomPrimary} ${s.duoBtn}`}>Open a partner thread <span className={s.mono}>→</span></a>
          </div>
          <div id="contact" className={s.duoCard} style={roomVars('#ff8a1e')}>
            <div className={`${s.duoTag} ${s.mono}`}>CONTACT</div>
            <h3 className={s.h3}>General questions and partnerships.</h3>
            <p className={s.duoBody}>No ticket queue, no sales funnel. One inbox, read by the people who write the code.</p>
            <div className={`${s.inboxes} ${s.mono}`}>
              <div className={s.inbox}><a href={HELLO_HREF}>{HELLO_EMAIL}</a><span className={s.inboxUse}>General + partners</span></div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter accent="#00f5ff" />
    </div>
  )
}
