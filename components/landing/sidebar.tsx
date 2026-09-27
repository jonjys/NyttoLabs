'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { HELLO_HREF, NAV_SECTIONS, SITE_ROUTES } from './data'
import s from './landing.module.css'

interface NavListProps {
  activeHref: string
  onNavigate?: () => void
  collapsed?: boolean
}

function NavList({ activeHref, onNavigate, collapsed = false }: NavListProps) {
  return (
    <ul className={s.sideList}>
      {NAV_SECTIONS.map((item) => {
        const active = item.href === activeHref
        return (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={onNavigate}
              className={`${s.sideLink} ${active ? s.sideLinkActive : ''}`}
              aria-current={active ? 'location' : undefined}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? `${item.num}. ${item.label}` : undefined}
            >
              <span className={`${s.sideNum} ${s.mono}`}>{item.num}</span>
              <span className={s.sideLabel}>{item.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function RouteLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className={s.sideFooter}>
      {SITE_ROUTES.map((r) => (
        <Link key={r.href} href={r.href} className={s.sideFooterLink} onClick={onNavigate}>
          {r.label} →
        </Link>
      ))}
    </div>
  )
}

interface SidebarProps {
  activeHref: string
  collapsed: boolean
  onToggle: () => void
}

/** Tablet/desktop sidebar (hidden below 768px via CSS). */
export function Sidebar({ activeHref, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={s.sidebar} aria-label="Page sections">
      <div className={s.sideHead}>
        <span className={`${s.sideEyebrow} ${s.mono}`}>Index</span>
        <button
          type="button"
          className={s.collapseBtn}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronsRight size={14} aria-hidden="true" /> : <ChevronsLeft size={14} aria-hidden="true" />}
        </button>
      </div>
      <nav aria-label="Sections">
        <NavList activeHref={activeHref} collapsed={collapsed} />
      </nav>
      <RouteLinks />
    </aside>
  )
}

interface DrawerProps {
  open: boolean
  activeHref: string
  onClose: () => void
}

/** Mobile navigation drawer opened from the hamburger button. */
export function MobileDrawer({ open, activeHref, onClose }: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className={s.drawerBackdrop} onClick={onClose} aria-hidden="true" />
      <div className={s.drawer} role="dialog" aria-modal="true" aria-label="Menu" id="landing-mobile-menu">
        <div className={s.sideHead}>
          <span className={`${s.sideEyebrow} ${s.mono}`}>Index</span>
          <button ref={closeRef} type="button" className={s.iconBtn} onClick={onClose} aria-label="Close menu">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Sections">
          <NavList activeHref={activeHref} onNavigate={onClose} />
        </nav>
        <RouteLinks onNavigate={onClose} />
        <a href={HELLO_HREF} className={s.drawerCta} onClick={onClose}>
          Get in touch
        </a>
      </div>
    </>
  )
}
