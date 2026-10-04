'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { SITE_NAV_CTA, SITE_NAV_LINKS } from '@/components/site/nav-links'
import { ArrowRight, Menu, Search } from 'lucide-react'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import SiteFooter from '@/components/site/footer'
import BentoGrid from './bento-grid'
import CommandPalette from './command-palette'
import DecodeText from './decode-text'
import RelayPlayground from './relay-playground'
import ShortcutsDialog from './shortcuts-dialog'
import SignalField from './signal-field'
import { copyText } from './clipboard'
import { MobileDrawer, Sidebar } from './sidebar'
import {
  API_ENDPOINTS,
  HELLO_HREF,
  HELLO_EMAIL,
  NAV_SECTIONS,
  PRODUCT_ACCENTS,
  PRODUCT_ANCHORS,
  RESOLVE_CURL,
  SITE_ROUTES,
  STEPS,
  endpointUrl,
  showcaseProducts,
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

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
/** "Six" for 6 — the product count always comes from the catalog. */
function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
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
  return <Landing />
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

function Landing() {
  // Catalog module is plain JS; narrow its inferred type to the documented shape.
  const allProducts = usePublicProducts() as ReadonlyArray<PublicProduct | null>
  // `products`: everything shown on the page — live products only.
  // `liveCount`: the live counter — only status === 'live' counts.
  const products = useMemo(() => showcaseProducts(allProducts), [allProducts])
  const liveCount = products.filter((p) => p.status === 'live').length

  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
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

  // Global keys: Cmd/Ctrl+K palette; plain keys (when not typing and no overlay
  // is open) jump to sections, R opens the playground, ? the keyboard map.
  const overlayOpen = paletteOpen || shortcutsOpen || menuOpen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen(false)
        setShortcutsOpen(false)
        setPaletteOpen((v) => !v)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey || overlayOpen || isTypingTarget(e.target)) return
      if (e.key === '?') {
        e.preventDefault()
        setShortcutsOpen(true)
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        jumpTo('#relay')
        return
      }
      const section = NAV_SECTIONS.find((n) => String(Number(n.num)) === e.key)
      if (section) jumpTo(section.href)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlayOpen])

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
      { id: 'jump-products', group: 'Jump to', label: 'All products', hint: '#products', run: () => jumpTo('#products') },
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
      { id: 'open-hello', group: 'Open', label: 'Get in touch', hint: HELLO_HREF.replace('mailto:', ''), keywords: 'email partners', run: () => { window.location.href = HELLO_HREF } },
      ...products.filter((p) => p.url).map((p) => ({
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
    const extras: Command[] = [
      { id: 'jump-playground', group: 'Jump to', label: 'Relay playground — route an intent', hint: 'R', keywords: 'simulate resolve demo', run: () => jumpTo('#relay') },
      { id: 'open-shortcuts', group: 'Open', label: 'Keyboard map', hint: '?', keywords: 'shortcuts keys help', run: () => setShortcutsOpen(true) },
    ]
    return [...jump, ...extras.slice(0, 1), ...copies, ...opens, ...extras.slice(1)]
  }, [copy, products])

  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), [])
  const fieldNodes = useMemo(
    () =>
      products.map((p) => ({
        label: p.name,
        color: PRODUCT_ACCENTS[p.slug] ?? '#00f5ff',
        href: `#${PRODUCT_ANCHORS[p.slug] ?? p.slug}`,
      })),
    [products],
  )
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const facts = [
    { value: String(liveCount), label: 'Live products' },
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
          <nav className={s.headerNav} aria-label="Company">
            {SITE_NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={s.headerNavLink} aria-current={l.href === '/' ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
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
          <Link href={SITE_NAV_CTA.href} className={s.headerCta}>
            {SITE_NAV_CTA.label}
          </Link>
        </header>

        <div className={`${s.layout} ${collapsed ? s.layoutCollapsed : ''}`}>
          <Sidebar activeHref={activeHref} collapsed={collapsed} onToggle={toggleCollapsed} />

          <main id="top" className={`${s.content} ${s.anchor}`}>
            {/* 00 · Studio overview */}
            <section className={s.hero} aria-labelledby="hero-title">
              <div className={s.heroCanvas}>
                <SignalField nodes={fieldNodes} />
              </div>
              <div className={s.heroCopy}>
                <span className={`${s.pill} ${s.mono}`}>
                  <span className={s.pillDot} aria-hidden="true" />
                  SWEDISH SOFTWARE COMPANY · F-TAX APPROVED
                </span>
                <h1 id="hero-title" className={s.h1}>
                  <span className={s.h1Line}>
                    <DecodeText text="Check VAT." />
                  </span>{' '}
                  <span className={s.h1Line}>Catch deploy errors.</span>{' '}
                  <span className={s.h1Alt}>Sell digital files.</span>
                </h1>
                <p className={s.lede}>
                  Practical tools for EU VAT checks, Vercel deployment checks and digital file sales.
                  Plus QR reorder labels and inventory sync. Choose the tool for the job and open it directly.
                </p>
                <div className={s.ctaRow}>
                  <a href="#products" className={s.btnPrimary}>
                    Find your tool <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <Link href="/products" className={s.btnGhost}>
                    Compare products & pricing
                  </Link>
                </div>
                <nav className={s.heroChips} aria-label="Products">
                  {products.map((p) => {
                    const anchor = PRODUCT_ANCHORS[p.slug] ?? p.slug
                    return (
                      <a
                        key={p.slug}
                        href={`#${anchor}`}
                        className={s.heroChip}
                        style={{ '--chip': PRODUCT_ACCENTS[p.slug] ?? '#00f5ff' } as CSSProperties}
                      >
                        <span className={s.heroChipDot} aria-hidden="true" />
                        {p.name}
                        {p.url && <span className={`${s.heroChipHost} ${s.mono}`}>{hostOf(p.url)}</span>}
                      </a>
                    )
                  })}
                </nav>
                <div className={s.facts}>
                  {facts.map((f) => (
                    <div key={f.label}>
                      <div className={s.factValue}>{f.value}</div>
                      <div className={`${s.factLabel} ${s.mono}`}>{f.label}</div>
                    </div>
                  ))}
                </div>
                <p className={`${s.heroHint} ${s.mono}`} aria-hidden="true">
                  ↳ move your cursor — every particle is an intent being routed · press ? for keys
                </p>
              </div>
            </section>

            {/* Products — bento showcase */}
            <section id="products" className={`${s.section} ${s.anchor}`} aria-labelledby="products-title">
              <div className={s.sectionHead}>
                <div>
                  <div className={`${s.eyebrow} ${s.mono}`}>Portfolio</div>
                  <h2 id="products-title" className={s.h2}>
                    Pick a tool. Finish the job.
                  </h2>
                </div>
                <p className={s.sectionLede}>
                  {countWord(liveCount)} live products. Preview a tool below, then open its site to use it.
                  The demos use illustrative data and run in your browser only.{' '}
                  <Link href="/products">Compare pricing and free options →</Link>
                </p>
              </div>
              <BentoGrid products={products} notify={notify} />
            </section>

            {/* Relay */}
            <section id="relay" className={`${s.section} ${s.anchor}`} aria-labelledby="relay-title">
              <div className={s.relayPanel}>
                <div>
                  <div className={`${s.eyebrow} ${s.mono}`}>For partners · Nytto Relay</div>
                  <h2 id="relay-title" className={s.h2}>
                    Intent in.{' '}
                    <span className={s.h1Alt} style={{ display: 'inline' }}>
                      Useful next action out.
                    </span>
                  </h2>
                  <p className={s.sectionLede} style={{ marginTop: 14, maxWidth: '34rem' }}>
                    Relay connects a product action to a relevant partner — for example, a reorder scan to a replacement
                    search. It uses approved destinations and records referrals. If no approved match exists, it sends
                    visitors nowhere. Try the simulation with an app, an action and a market.
                  </p>
                </div>

                <RelayPlayground products={products} />

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

            {/* 07 · Partners & contact */}
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
                  <h3 className={s.h3}>General questions and partnerships.</h3>
                  <div className={s.mono}>
                    <div className={s.inbox}>
                      <a href={HELLO_HREF} className={s.inboxLink}>
                        {HELLO_EMAIL}
                      </a>
                      <span className={s.inboxUse}>General + partners</span>
                    </div>
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
      <ShortcutsDialog open={shortcutsOpen} onClose={closeShortcuts} paletteKey={shortcut} />

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
