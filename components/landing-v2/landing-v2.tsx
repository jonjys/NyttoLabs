'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { SITE_NAV_CTA, navLabel } from '@/components/site/nav-links'
import LocaleToggle from '@/components/site/locale-toggle'
import { productCopy } from '@/components/site/product-copy'
import { useLocale } from '@/hooks/use-locale'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import SiteFooter from '@/components/site/footer'
import { API_ENDPOINTS, HELLO_EMAIL, HELLO_HREF, PRODUCT_ANCHORS, STEPS, showcaseProducts } from '@/components/landing/data'
import type { PublicProduct } from '@/components/landing/types'
import IntentField from './intent-field'
import RelaySim from './relay-sim'
import Wordmark from './wordmark'
import s from './landing-v2.module.css'

// All visible copy, in English and Swedish. Pricing / free-tier lines are
// marketing copy, not catalog data — keyed by catalog slug.
const COPY = {
  en: {
    pricing: {
      deploydoctor: { price: '$9', note: 'per month · or $5 for a 7-day pass', free: '3 scans a day' },
      cycletag: { price: '49 SEK', note: 'starter sheet · one-time', free: 'make one tag' },
      viesproof: { price: '€4.90', note: 'minimum per batch · one-time', free: 'a single check' },
      'curl-to-buy': { price: '5%', note: 'fee · you keep 95%', free: 'to create · 5% only when it sells' },
      failclosed: { price: 'Sync', note: 'starts in watch-only mode', free: 'watch-only until you say otherwise' },
      'csv-rescue': { price: '29 SEK', note: 'per prepared file · no subscription', free: 'preview before you pay' },
    } as Record<string, { price: string; note: string; free: string }>,
    nav: [{ href: '#products', label: 'Products' }, { href: '#relay', label: 'Relay' }, { href: '#partners', label: 'Partners' }, { href: '#contact', label: 'Contact' }],
    navAria: 'Sections',
    menu: 'Menu',
    ticker: [
      ['SCAN', 'deploydoctor · github.com/example/shop → 3 issues, 0 blockers'],
      ['RESOLVE', 'staytag · reorder · SE → partner allowlist'],
      ['VERIFY', 'vatidence · VIES consultation number stored'],
      ['DELIVER', 'nytto checkout · file sold, link expires in 24h'],
      ['SYNC', 'failclosed · warehouse 40 · shop 12 → repaired'],
      ['FIX', 'csv rescue · utf-8 · leading zeros kept'],
      ['FAIL-CLOSED', 'no approved destination → no redirect'],
    ],
    nots: ['No inventory', 'No packaging', 'No third-party checkout', 'No shipping or returns', 'No dropshipping', 'No warehouse', 'No fake partners or prices', 'No analytics cookies'],
    rooms: {
      products: { tag: 'PRODUCT SHOWCASE', title: 'Six things you can open and pay for today.', body: 'DeployDoctor, StayTag, Vatidence, Nytto Checkout, Failclosed and CSV Rescue — live now, not a roadmap. Each on its own site, each with a free way in.', cta: 'Find your tool →' },
      partners: { tag: 'PARTNERS ROOM', title: 'If your product touches ours, there is probably a reason to talk.', body: 'Integrations, referrals and co-built tools. You keep checkout and fulfilment; we route high-intent users to approved destinations only.', cta: 'Open Partners →' },
      contact: { tag: 'CONTACT ROOM', title: 'A real inbox, read by the people who write the code.', body: 'No ticket queue, no sales funnel. General questions and partnerships go to the same inbox.', cta: 'Write to hello@ →' },
    },
    pill: 'SWEDISH SOFTWARE COMPANY · F-TAX APPROVED',
    h1a: 'Check VAT. Catch deploy errors.',
    h1b: 'Sell digital files.',
    lede: 'Practical tools for EU VAT checks, Vercel deployment checks and digital file sales. Plus QR reorder labels, inventory sync and CSV cleanup. Choose the tool for the job and open it directly.',
    findTool: 'Find your tool',
    compare: 'Compare products & pricing',
    facts: ['Live products', 'Routing layer', 'Built in Sweden'],
    core: 'routing',
    hint: '↳ MOVE YOUR CURSOR — EVERY PARTICLE IS AN INTENT BEING ROUTED',
    doors: 'THREE DOORS · PICK ONE AND WALK THROUGH',
    backCaps: '← BACK TO LOBBY',
    back: '← Back to lobby',
    orbs: { products: ['PRODUCTS', 'Six tools, all live'], partners: ['PARTNERS', 'Integrations & referrals'], contact: ['CONTACT', 'A real inbox, no funnel'] },
    enter: 'ENTER →',
    portfolio: '01 · PORTFOLIO',
    h2a: 'Pick a tool.',
    h2b: 'Finish the job.',
    sectionLede: 'Six live products, each under its own name and its own site. Every one has a free way in.',
    comparePricing: 'Compare pricing →',
    live: 'Live',
    free: 'free',
    cta: {
      deploydoctor: 'Scan a repository',
      cycletag: 'Create a reorder tag',
      viesproof: 'Check a VAT number',
      'curl-to-buy': 'Sell a digital file',
      failclosed: 'Explore inventory sync',
    } as Record<string, string>,
    open: (name: string) => `Open ${name}`,
    steps: STEPS,
    endpointNote: 'DETERMINISTIC · FAIL-CLOSED',
    scope: '03 · SCOPE',
    scopeTitle: 'What we deliberately don’t do.',
    scopeNote: 'Partners keep checkout, payment, VAT, delivery, returns and product support. We keep the software honest.',
    partnersTag: 'PARTNERS',
    partnersTitle: 'If your product touches ours, there is probably a reason to talk.',
    partnersBody: 'You keep checkout and fulfilment. We connect high-intent users to a relevant next action, on approved domains only.',
    partnersCta: 'Open a partner thread',
    contactTag: 'CONTACT',
    contactTitle: 'General questions and partnerships.',
    contactBody: 'No ticket queue, no sales funnel. One inbox, read by the people who write the code.',
    inboxUse: 'General + partners',
  },
  sv: {
    pricing: {
      deploydoctor: { price: '$9', note: 'per månad · eller $5 för 7 dagar', free: '3 skanningar per dag' },
      cycletag: { price: '49 kr', note: 'startark · engångsköp', free: 'gör en tagg' },
      viesproof: { price: '4,90 €', note: 'minimum per batch · engångsköp', free: 'en enstaka kontroll' },
      'curl-to-buy': { price: '5%', note: 'avgift · du behåller 95%', free: 'att skapa · 5% bara när den säljer' },
      failclosed: { price: 'Synk', note: 'startar i bevakningsläge', free: 'bevakningsläge tills du säger till' },
      'csv-rescue': { price: '29 kr', note: 'per fil · ingen prenumeration', free: 'förhandsgranska innan du betalar' },
    } as Record<string, { price: string; note: string; free: string }>,
    nav: [{ href: '#products', label: 'Produkter' }, { href: '#relay', label: 'Relay' }, { href: '#partners', label: 'Partner' }, { href: '#contact', label: 'Kontakt' }],
    navAria: 'Avsnitt',
    menu: 'Meny',
    ticker: [
      ['SKANNA', 'deploydoctor · github.com/example/shop → 3 fel, 0 stoppande'],
      ['MATCHA', 'staytag · återköp · SE → godkända partner'],
      ['VERIFIERA', 'vatidence · VIES-konsultationsnummer sparat'],
      ['LEVERERA', 'nytto checkout · fil såld, länken går ut om 24 h'],
      ['SYNKA', 'failclosed · lager 40 · butik 12 → reparerat'],
      ['RÄTTA', 'csv rescue · utf-8 · inledande nollor kvar'],
      ['FAIL-CLOSED', 'inget godkänt mål → ingen omdirigering'],
    ],
    nots: ['Inget lager', 'Ingen paketering', 'Ingen kassa åt andra', 'Ingen frakt eller retur', 'Ingen dropshipping', 'Inget varuhus', 'Inga påhittade partner eller priser', 'Inga analyskakor'],
    rooms: {
      products: { tag: 'PRODUKTER', title: 'Sex saker du kan öppna och betala för i dag.', body: 'DeployDoctor, StayTag, Vatidence, Nytto Checkout, Failclosed och CSV Rescue — live nu, ingen roadmap. Var och en på sin egen sajt, alla med en gratis väg in.', cta: 'Hitta ditt verktyg →' },
      partners: { tag: 'PARTNERRUMMET', title: 'Om din produkt berör vår finns det troligen anledning att prata.', body: 'Integrationer, hänvisningar och verktyg vi bygger ihop. Ni behåller kassa och leverans; vi skickar köpbenägna användare enbart till godkända mål.', cta: 'Öppna Partner →' },
      contact: { tag: 'KONTAKTRUMMET', title: 'En riktig inkorg, läst av dem som skriver koden.', body: 'Ingen ärendekö, ingen säljtratt. Allmänna frågor och partnerskap går till samma inkorg.', cta: 'Skriv till hello@ →' },
    },
    pill: 'SVENSKT MJUKVARUFÖRETAG · GODKÄND FÖR F‑SKATT',
    h1a: 'Kolla moms. Hitta deployfel.',
    h1b: 'Sälj digitala filer.',
    lede: 'Praktiska verktyg för momskontroller inom EU, kontroller av Vercel-deployer och försäljning av digitala filer. Plus QR-etiketter för återköp, lagersynk och CSV-städning. Välj verktyget för jobbet och öppna det direkt.',
    findTool: 'Hitta ditt verktyg',
    compare: 'Jämför produkter och priser',
    facts: ['Produkter live', 'Routinglager', 'Byggt i Sverige'],
    core: 'routing',
    hint: '↳ RÖR MUSPEKAREN — VARJE PARTIKEL ÄR ETT KÖPBEHOV SOM DIRIGERAS',
    doors: 'TRE DÖRRAR · VÄLJ EN OCH GÅ IN',
    backCaps: '← TILLBAKA TILL ENTRÉN',
    back: '← Tillbaka till entrén',
    orbs: { products: ['PRODUKTER', 'Sex verktyg, alla live'], partners: ['PARTNER', 'Integrationer och hänvisningar'], contact: ['KONTAKT', 'En riktig inkorg, ingen tratt'] },
    enter: 'GÅ IN →',
    portfolio: '01 · PORTFÖLJ',
    h2a: 'Välj ett verktyg.',
    h2b: 'Gör klart jobbet.',
    sectionLede: 'Sex produkter live, var och en under eget namn och på egen sajt. Alla har en gratis väg in.',
    comparePricing: 'Jämför priser →',
    live: 'Live',
    free: 'gratis',
    cta: {
      deploydoctor: 'Skanna ett repo',
      cycletag: 'Skapa en återköpstagg',
      viesproof: 'Kontrollera ett momsnummer',
      'curl-to-buy': 'Sälj en digital fil',
      failclosed: 'Utforska lagersynk',
    } as Record<string, string>,
    open: (name: string) => `Öppna ${name}`,
    steps: [
      { n: '01', title: 'Ett behov uppstår', body: 'En skanning, en momskontroll, ett API-anrop — ett ögonblick då någon behöver ett nästa steg.' },
      { n: '02', title: 'Relay matchar', body: 'Deterministisk matchning mot godkända partner och godkända målmallar.' },
      { n: '03', title: 'Hänvisningen registreras', body: 'En säker omdirigering via /go bär ett klick-id; konverteringar kommer in via en signerad webhook.' },
      { n: '04', title: 'Eller så händer ingenting', body: 'Inget godkänt svar betyder ingen omdirigering. Hellre inget än en dålig rekommendation.' },
    ],
    endpointNote: 'DETERMINISTISK · FAIL-CLOSED',
    scope: '03 · AVGRÄNSNING',
    scopeTitle: 'Det här gör vi medvetet inte.',
    scopeNote: 'Partner behåller kassa, betalning, moms, leverans, returer och produktsupport. Vi håller mjukvaran ärlig.',
    partnersTag: 'PARTNER',
    partnersTitle: 'Om din produkt berör vår finns det troligen anledning att prata.',
    partnersBody: 'Ni behåller kassa och leverans. Vi kopplar köpbenägna användare till ett relevant nästa steg, enbart på godkända domäner.',
    partnersCta: 'Starta en partnertråd',
    contactTag: 'KONTAKT',
    contactTitle: 'Allmänna frågor och partnerskap.',
    contactBody: 'Ingen ärendekö, ingen säljtratt. En inkorg, läst av dem som skriver koden.',
    inboxUse: 'Allmänt + partner',
  },
}
const SAT_COLORS: Record<string, string> = { deploydoctor: '#00f5ff', cycletag: '#00ff9d', viesproof: '#00f5ff', 'curl-to-buy': '#ff2bd1', failclosed: '#ff8a1e', 'csv-rescue': '#00ff9d' }
const SAT_POS = [['50%', '4%'], ['92%', '28%'], ['92%', '72%'], ['50%', '96%'], ['8%', '72%'], ['8%', '28%']]
const ROOMS = {
  products: { c: '#00ff9d', href: '#products' },
  partners: { c: '#ff2bd1', href: '#partners' },
  contact: { c: '#ff8a1e', href: HELLO_HREF },
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
  // useLocale is plain JS, so narrow its value for TypeScript.
  const locale: 'en' | 'sv' = useLocale()[0] === 'sv' ? 'sv' : 'en'
  const t = COPY[locale]
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
  const current = room ? { ...ROOMS[room], ...t.rooms[room] } : null

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
          <nav className={s.nav} aria-label={t.navAria}>
            {t.nav.map((l) => <a key={l.href} href={l.href} className={`${s.navLink} ${s.mono}`}>{l.label}</a>)}
            <Link href={SITE_NAV_CTA.href} className={`${s.navCta} ${s.mono}`}>{navLabel(SITE_NAV_CTA, locale)}</Link>
            <LocaleToggle accent="#00f5ff" />
          </nav>
          <button type="button" className={s.menuBtn} onClick={() => setMenuOpen((v) => !v)} aria-label={t.menu} aria-expanded={menuOpen}>{menuOpen ? '✕' : '☰'}</button>
        </div>
        {menuOpen && (
          <div className={s.menu}>
            {t.nav.map((l) => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className={`${s.menuLink} ${s.mono}`}>{l.label}</a>)}
            <div className={s.menuLink}><LocaleToggle accent="#00f5ff" /></div>
            <Link href={SITE_NAV_CTA.href} className={`${s.menuCta} ${s.mono}`}>{navLabel(SITE_NAV_CTA, locale)}</Link>
          </div>
        )}
      </header>

      <main id="top" className={s.main}>
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <span className={`${s.pill} ${s.mono}`}><span className={s.pillDot} aria-hidden="true" />{t.pill}</span>
              <h1 id="hero-title" className={s.h1}>
                <span className={s.h1Line}>{t.h1a}</span>
                <span className={s.h1Alt}>{t.h1b}</span>
              </h1>
              <p className={s.lede}>{t.lede}</p>
              <div className={s.ctaRow}>
                <a href="#products" className={s.btnPrimary}>{t.findTool} <span className={s.mono}>→</span></a>
                <Link href="/products" className={s.btnGhost}>{t.compare}</Link>
              </div>
              <div className={s.facts}>
                {[[String(products.length), t.facts[0]], ['1', t.facts[1]], ['SE', t.facts[2]]].map(([v, l]) => (
                  <div key={l} className={s.fact}><div className={s.factValue}>{v}</div><div className={`${s.factLabel} ${s.mono}`}>{l}</div></div>
                ))}
              </div>
            </div>

            <div className={s.orbit} aria-hidden="true">
              <div className={s.ringOuter} /><div className={s.ringInner} />
              <div className={s.orbitA}><span /></div><div className={s.orbitB}><span /></div>
              <div className={s.core}><span className={`${s.coreTag} ${s.mono}`}>RELAY</span><span className={`${s.coreWord} ${s.serif}`}>{t.core}</span></div>
              {products.slice(0, 6).map((p, i) => (
                <a key={p.slug} href={`#${anchorOf(p)}`} className={`${s.sat} ${s.mono}`} style={{ left: SAT_POS[i][0], top: SAT_POS[i][1], '--c': SAT_COLORS[p.slug] ?? '#00f5ff' } as CSSProperties}>
                  <span className={s.satDot} />{p.name.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div className={`${s.hint} ${s.mono}`} aria-hidden="true">{t.hint}</div>

          <div className={s.lobby}>
            <div className={s.lobbyHead}>
              <span className={`${s.lobbyLabel} ${s.mono}`}>{t.doors}</span>
              {room && <button type="button" onClick={() => setRoom(null)} className={`${s.backLink} ${s.mono}`}>{t.backCaps}</button>}
            </div>
            {!room ? (
              <div className={s.orbs}>
                {([
                  ['products', t.orbs.products[0], t.orbs.products[1], orbVars('#00ff9d', '140deg', '9s', '7s', '0s')],
                  ['partners', t.orbs.partners[0], t.orbs.partners[1], orbVars('#ff2bd1', '0deg', '11s', '8s', '0.5s')],
                  ['contact', t.orbs.contact[0], t.orbs.contact[1], orbVars('#ff8a1e', '260deg', '13s', '9s', '1s')],
                ] as [Room, string, string, CSSProperties][]).map(([key, tag, sub, vars]) => (
                  <button key={key} type="button" onClick={() => setRoom(key)} className={s.orb} style={vars}>
                    <span className={s.orbRing} aria-hidden="true" /><span className={s.orbBody} aria-hidden="true" /><span className={s.orbRipple} aria-hidden="true" />
                    <span className={s.orbText}>
                      <span className={`${s.orbTag} ${s.mono}`}>{tag}</span>
                      <span className={s.orbSub}>{sub}</span>
                      <span className={`${s.orbEnter} ${s.mono}`}>{t.enter}</span>
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
                  <button type="button" onClick={() => setRoom(null)} className={s.roomBack}>{t.back}</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={`${s.ticker} ${s.reveal}`} aria-hidden="true">
          <div className={s.tickerFade} />
          <div className={s.tickerRow}>
            {[...t.ticker, ...t.ticker].map(([tag, text], i) => <span key={i} className={`${s.tickerItem} ${s.mono}`}><b>{tag}</b>{text}</span>)}
          </div>
        </section>

        <section id="products" className={s.section} aria-labelledby="products-title">
          <div className={`${s.sectionHead} ${s.reveal}`}>
            <div>
              <div className={`${s.eyebrow} ${s.mono}`}>{t.portfolio}</div>
              <h2 id="products-title" className={s.h2}>{t.h2a}<br /><i>{t.h2b}</i></h2>
            </div>
            <p className={s.sectionLede}>{t.sectionLede} <Link href="/products">{t.comparePricing}</Link></p>
          </div>
          <div className={s.grid}>
            {products.map((p) => {
              const pr = t.pricing[p.slug]
              const copy = productCopy(p, locale)
              return (
                <a key={p.slug} id={anchorOf(p)} href={p.url} target="_blank" rel="noreferrer" className={`${s.card} ${s.reveal}`}>
                  <div className={s.cardTop}>
                    <span className={`${s.cardCat} ${s.mono}`}>{copy.category}</span>
                    <span className={`${s.status} ${s.mono}`}><span className={s.statusDot} />{t.live}</span>
                  </div>
                  <div className={s.cardName}><strong>{p.name}</strong>{pr && <span className={s.price}>{pr.price}</span>}</div>
                  {pr && <div className={`${s.priceNote} ${s.mono}`}>{pr.note}</div>}
                  <p className={s.cardDesc}>{copy.description}</p>
                  {pr && <div className={`${s.free} ${s.mono}`}><b>{t.free}</b> {pr.free}</div>}
                  <div className={`${s.cardFoot} ${s.mono}`}>
                    <span>{p.primaryMarket} · {hostOf(p.url)}</span><b>{t.cta[p.slug] ?? t.open(p.name)} →</b>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        <section id="relay" className={`${s.relay} ${s.reveal}`} aria-labelledby="relay-title">
          <div className={s.relaySweep} aria-hidden="true" />
          <div className={s.relayGrid}>
            <RelaySim locale={locale} apps={products.map((p) => ({ name: p.name, slug: p.slug }))} />
            {t.steps.map((st) => (
              <div key={st.n} className={s.step}>
                <span className={`${s.stepN} ${s.mono}`}>{st.n}</span><span className={s.stepTitle}>{st.title}</span><span className={s.stepBody}>{st.body}</span>
              </div>
            ))}
          </div>
          <div className={s.endpoints}>
            {API_ENDPOINTS.map((e) => <span key={e.id} className={`${s.endpoint} ${s.mono}`}><b>{e.method}</b>{e.path}</span>)}
            <span className={`${s.endpointNote} ${s.mono}`}>{t.endpointNote}</span>
          </div>
        </section>

        <section className={`${s.scope} ${s.reveal}`}>
          <div className={`${s.eyebrow} ${s.mono}`}>{t.scope}</div>
          <h2 className={s.h2Small}>{t.scopeTitle}</h2>
          <div className={s.nots}>{t.nots.map((n) => <div key={n} className={s.not}><b className={s.mono}>✕</b>{n}</div>)}</div>
          <p className={s.scopeNote}>{t.scopeNote}</p>
        </section>

        <section id="partners" className={`${s.duo} ${s.reveal}`} aria-labelledby="partners-title">
          <div className={s.duoCard} style={roomVars('#ff2bd1')}>
            <div className={`${s.duoTag} ${s.mono}`}>{t.partnersTag}</div>
            <h3 id="partners-title" className={s.h3}>{t.partnersTitle}</h3>
            <p className={s.duoBody}>{t.partnersBody}</p>
            <a href={HELLO_HREF} className={`${s.roomPrimary} ${s.duoBtn}`}>{t.partnersCta} <span className={s.mono}>→</span></a>
          </div>
          <div id="contact" className={s.duoCard} style={roomVars('#ff8a1e')}>
            <div className={`${s.duoTag} ${s.mono}`}>{t.contactTag}</div>
            <h3 className={s.h3}>{t.contactTitle}</h3>
            <p className={s.duoBody}>{t.contactBody}</p>
            <div className={`${s.inboxes} ${s.mono}`}>
              <div className={s.inbox}><a href={HELLO_HREF}>{HELLO_EMAIL}</a><span className={s.inboxUse}>{t.inboxUse}</span></div>
            </div>
          </div>
        </section>
      </main>

      <Wordmark />
      <SiteFooter accent="#00f5ff" />
    </div>
  )
}
