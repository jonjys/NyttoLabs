'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, Menu, Search } from 'lucide-react'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import SiteFooter from '@/components/site/footer'
import BentoGrid from './bento-grid'
import CommandPalette from './command-palette'
import { copyText } from './clipboard'
import { MobileDrawer, Sidebar } from './sidebar'
import {
  API_ENDPOINTS,
  HELLO_HREF,
  INBOXES,
  NAV_SECTIONS,
  NOTS,
  PRODUCT_ACCENTS,
  PRODUCT_ANCHORS,
  RELAY_LOG,
  RESOLVE_CURL,
  SITE_ROUTES,
  STEPS,
  SUPPORT_HREF,
  endpointUrl,
} from './data'
import type { Command, PublicProduct } from './types'
import s from './landing.module.css'

const SIDEBAR_KEY = 'nl-landing-sidebar-collapsed'

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === '1'
  } catch {
    return false
  }
}
function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_KEY, value ? '1' : '0')
  } catch {
    // storage unavailable (private mode etc.) — preference just isn't kept
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function jumpTo(href: string) {
  // Plain hash navigation so behaviour matches clicking the existing anchors.
  window.location.hash = href
}

/** Tracks which sidebar section is currently in view. */
function useActiveSection(): string {
  const [active, setActive] = useState<string>(NAV_SECTIONS[0].href)
  useEffect(() => {
    let frame = 0
    const compute = () => {
      frame = 0
      const offset = 140
      let current: string = NAV_SECTIONS[0].href
      for (const item of NAV_SECTIONS.slice(1)) {
        const el = document.getElementById(item.href.slice(1))
        if (el && el.getBoundingClientRect().top - offset <= 0) current = item.href
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = NAV_SECTIONS[NAV_SECTIONS.length - 1].href
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

export default function LandingPage() {
  // Catalog module is plain JS; narrow its inferred type to the documented shape.
  const allProducts = usePublicProducts() as ReadonlyArray<PublicProduct | null>
  const products = useMemo(
    () => allProducts.filter((p): p is PublicProduct => !!p && p.status === 'live'),
    [allProducts],
  )

  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [shortcut, setShortcut] = useState('⌘K')
  const barRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const activeHref = useActiveSection()

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  useEffect(() => {
    setCollapsed(readCollapsed())
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
    setShortcut(isMac ? '⌘K' : 'Ctrl K')
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      writeCollapsed(!v)
      return !v
    })
  }, [])

  // Global Cmd/Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen(false)
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close the mobile drawer when resizing up to the sidebar layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Reading progress bar (kept from the previous landing page).
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

  const copy = useCallback(
    async (text: string, label: string) => {
      const ok = await copyText(text)
      notify(ok ? `Copied ${label}` : 'Copy failed')
    },
    [notify],
  )

  const commands = useMemo<Command[]>(() => {
    const jump: Command[] = [
      ...NAV_SECTIONS.map((item) => ({
        id: `jump-${item.href}`,
        group: 'Jump to' as const,
        label: `${item.num} · ${item.label}`,
        hint: item.href,
        run: () => jumpTo(item.href),
      })),
      { id: 'jump-products', group: 'Jump to', label: 'All live products', hint: '#products', run: () => jumpTo('#products') },
      { id: 'jump-relay', group: 'Jump to', label: 'How Relay works', hint: '#relay', run: () => jumpTo('#relay') },
    ]
    const copies: Command[] = [
      ...API_ENDPOINTS.map((ep) => ({
        id: `copy-${ep.id}`,
        group: 'Copy' as const,
        label: `Copy ${ep.label} endpoint`,
        hint: `${ep.method} ${ep.path}`,
        keywords: 'api url endpoint',
        run: () => void copy(endpointUrl(ep.path), `${ep.method} ${ep.path}`),
      })),
      {
        id: 'copy-resolve-curl',
        group: 'Copy',
        label: 'Copy resolve curl example',
        hint: 'curl -X POST /api/resolve',
        keywords: 'api snippet',
        run: () => void copy(RESOLVE_CURL, 'resolve curl example'),
      },
    ]
    const opens: Command[] = [
      { id: 'open-support', group: 'Open', label: 'Contact support', hint: SUPPORT_HREF.replace('mailto:', ''), keywords: 'help email', run: () => { window.location.href = SUPPORT_HREF } },
      { id: 'open-hello', group: 'Open', label: 'Get in touch', hint: HELLO_HREF.replace('mailto:', ''), keywords: 'email partners', run: () => { window.location.href = HELLO_HREF } },
      ...products.map((p) => ({
        id: `open-${p.slug}`,
        group: 'Open' as const,
        label: `Open ${p.name}`,
        hint: hostOf(p.url),
        keywords: p.category,
        run: () => {
          window.open(p.url, '_blank', 'noreferrer')
        },
      })),
      ...SITE_ROUTES.map((r) => ({
        id: `route-${r.href}`,
        group: 'Open' as const,
        label: `${r.label} page`,
        hint: r.href,
        run: () => {
          window.location.href = r.href
        },
      })),
    ]
    return [...jump, ...copies, ...opens]
  }, [copy, products])

  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const facts = [
    { value: String(products.length), label: 'Live products' },
    { value: '1', label: 'Routing layer' },
    { value: 'SE', label: 'Built in Sweden' },
  ]

  return (
    <div className={s.root}>
      <div className={s.bgGrid} aria-hidden="true" />
      <div className={s.bgGlow} aria-hidden="true" />
      <div className={s.progress} aria-hidden="true">
        <div ref={barRef} className={s.progressBar} />
      </div>

      <div className={s.shell}>
        <header className={s.header}>
          <button
            type="button"
            className={s.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
          >
            <Menu size={16} aria-hidden="true" />
          </button>
          <a href="#top" className={s.brand}>
            <span className={s.brandMark}>
              <span className={s.brandDot} />
            </span>
            <span className={`${s.brandText} ${s.mono}`}>NYTTO LABS</span>
          </a>
          <div className={s.headerSpacer} />
          <button
            type="button"
            className={s.searchTrigger}
            onClick={() => setPaletteOpen(true)}
            aria-label={`Open command palette (${shortcut})`}
            aria-haspopup="dialog"
          >
            <Search size={14} aria-hidden="true" />
            <span className={s.searchLabel}>Search or jump to…</span>
            <kbd className={s.kbd}>{shortcut}</kbd>
          </button>
          <a href={HELLO_HREF} className={s.headerCta}>
            Get in touch
          </a>
        </header>

        <div className={`${s.layout} ${collapsed ? s.layoutCollapsed : ''}`}>
          <Sidebar activeHref={activeHref} collapsed={collapsed} onToggle={toggleCollapsed} />

          <main id="top" className={`${s.content} ${s.anchor}`}>
            {/* 00 · Studio overview */}
            <section className={s.hero} aria-labelledby="hero-title">
              <div>
                <span className={`${s.pill} ${s.mono}`}>
                  <span className={s.pillDot} aria-hidden="true" />
                  SWEDISH SOFTWARE COMPANY · F-TAX APPROVED
                </span>
                <h1 id="hero-title" className={s.h1}>
                  Focused software.
                  <span className={s.h1Alt}>Invisible infrastructure.</span>
                </h1>
                <p className={s.lede}>
                  We build small products that finish a job — VAT proof, reorder labels, API spend limits — and one routing
                  layer underneath them that turns real intent into the right next action.
                </p>
                <div className={s.ctaRow}>
                  <a href="#products" className={s.btnPrimary}>
                    What you can buy today <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a href="#relay" className={s.btnGhost}>
                    How Relay works
                  </a>
                </div>
                <div className={s.facts}>
                  {facts.map((f) => (
                    <div key={f.label}>
                      <div className={s.factValue}>{f.value}</div>
                      <div className={`${s.factLabel} ${s.mono}`}>{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <nav className={s.glass} aria-label="Live products">
                <div className={`${s.indexHead} ${s.mono}`}>
                  <span>LIVE PRODUCTS</span>
                  <span>{products.length} / {products.length}</span>
                </div>
                <ul className={s.indexList}>
                  {products.map((p) => {
                    const anchor = PRODUCT_ANCHORS[p.slug] ?? p.slug
                    const num = NAV_SECTIONS.find((n) => n.href === `#${anchor}`)?.num ?? '··'
                    return (
                      <li key={p.slug}>
                        <a href={`#${anchor}`} className={s.indexRow}>
                          <span className={`${s.sideNum} ${s.mono}`}>{num}</span>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className={s.swatch} style={{ background: PRODUCT_ACCENTS[p.slug] ?? '#00f5ff' }} aria-hidden="true" />
                              <span className={s.indexName}>{p.name}</span>
                            </span>
                            <span className={s.indexMeta} style={{ display: 'block' }}>
                              {p.category} · {hostOf(p.url)}
                            </span>
                          </span>
                          <ArrowRight size={16} className={s.indexArrow} aria-hidden="true" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </section>

            {/* Products — bento showcase */}
            <section id="products" className={`${s.section} ${s.anchor}`} aria-labelledby="products-title">
              <div className={s.sectionHead}>
                <div>
                  <div className={`${s.eyebrow} ${s.mono}`}>Portfolio</div>
                  <h2 id="products-title" className={s.h2}>
                    Each product lives under its own name.
                  </h2>
                </div>
                <p className={s.sectionLede}>
                  No bundles, no suite. Three live products you can open and pay for right now. Try the demos below — they
                  run in your browser only.
                </p>
              </div>
              <BentoGrid products={products} notify={notify} />
            </section>

            {/* Relay */}
            <section id="relay" className={`${s.section} ${s.anchor}`} aria-labelledby="relay-title">
              <div className={s.relayPanel}>
                <div>
                  <div className={`${s.eyebrow} ${s.mono}`}>Relay</div>
                  <h2 id="relay-title" className={s.h2}>
                    Intent in.{' '}
                    <span className={s.h1Alt} style={{ display: 'inline' }}>
                      Useful next action out.
                    </span>
                  </h2>
                  <p className={s.sectionLede} style={{ marginTop: 14, maxWidth: '34rem' }}>
                    Products create or detect commercial intent. Relay resolves it deterministically against an
                    allowlist of approved partner destinations, records attribution, and fails closed when no good answer
                    exists.
                  </p>
                </div>

                <div className={s.terminal} style={{ '--tile-accent': '#00f5ff' } as CSSProperties}>
                  <div className={s.termBar}>
                    <span className={s.termDot} />
                    <span className={s.termDot} />
                    <span className={s.termDot} />
                    <span className={`${s.termTitle} ${s.mono}`}>RESOLVER · EXAMPLE PAYLOAD</span>
                  </div>
                  <pre className={s.code}>
                    <span className={s.codeComment}>POST /api/resolve</span>
                    {'\n'}
                    {'{ "app": "cycletag", "action": "reorder", "country": "SE" }'}
                    {'\n'}
                    <span className={s.codeOk}>200 OK</span>
                    {' · { "click_id": "c_8f3a…", "fallback": false }'}
                  </pre>
                  <ul className={`${s.log} ${s.mono}`}>
                    {RELAY_LOG.map((row) => (
                      <li key={row.tag}>
                        <span className={s.logTag}>{row.tag}</span>
                        {row.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={s.steps}>
                  {STEPS.map((step) => (
                    <div key={step.n} className={s.step}>
                      <span className={`${s.stepN} ${s.mono}`}>{step.n}</span>
                      <span className={s.stepTitle}>{step.title}</span>
                      <span className={s.stepBody}>{step.body}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Scope */}
            <section className={s.section} aria-labelledby="scope-title">
              <div className={`${s.eyebrow} ${s.mono}`}>Scope</div>
              <h2 id="scope-title" className={s.h2} style={{ marginBottom: 20 }}>
                What we deliberately don&rsquo;t do.
              </h2>
              <div className={s.notGrid}>
                {NOTS.map((n) => (
                  <div key={n} className={s.notItem}>
                    <span className={`${s.notX} ${s.mono}`} aria-hidden="true">
                      ✕
                    </span>
                    {n}
                  </div>
                ))}
              </div>
              <p className={s.note}>
                Partners keep checkout, payment, VAT, delivery, returns and product support. We keep the software honest.
              </p>
            </section>

            {/* 04 · Partners & contact */}
            <section id="partners" className={`${s.section} ${s.anchor}`} aria-labelledby="partners-title">
              <div className={s.duo}>
                <div className={`${s.card} ${s.cardAccent}`}>
                  <div className={`${s.eyebrow} ${s.mono}`}>Partners</div>
                  <h2 id="partners-title" className={s.h3}>
                    If your product touches ours, there is probably a reason to talk.
                  </h2>
                  <p className={s.cardBody}>
                    You keep checkout and fulfilment. We connect high-intent users to a relevant next action, on approved
                    domains only.
                  </p>
                  <a href={HELLO_HREF} className={s.btnPrimary} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    Open a partner thread <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
                <div className={s.card}>
                  <div className={`${s.eyebrow} ${s.mono}`} style={{ color: 'var(--faint)' }}>
                    Contact
                  </div>
                  <h3 className={s.h3}>A real inbox, read by the people who write the code.</h3>
                  <p className={s.cardBody}>No ticket queue, no sales funnel.</p>
                  <div className={s.mono}>
                    {INBOXES.map((i) => (
                      <div key={i.email} className={s.inbox}>
                        <a href={`mailto:${i.email}`} className={s.inboxLink}>
                          {i.email}
                        </a>
                        <span className={s.inboxUse}>{i.use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <SiteFooter accent="#00f5ff" />

      <MobileDrawer open={menuOpen} activeHref={activeHref} onClose={closeMenu} />
      <CommandPalette open={paletteOpen} onClose={closePalette} commands={commands} />

      <div className={s.srOnly} role="status" aria-live="polite">
        {toast ?? ''}
      </div>
      {toast && (
        <div className={s.toast} aria-hidden="true">
          {toast}
        </div>
      )}
    </div>
  )
}
