'use client'

import Link from 'next/link'
import SiteNav from './nav'
import SiteFooter from './footer'

// Each section keeps the colour of the portal it sits behind in the lobby, so
// arriving on the page reads as a continuation of the room you walked into.
export const ACCENT = {
  home: '#00f5ff',
  partners: '#ff2bd1',
  products: '#00ff9d',
  contact: '#ff8a1e',
}

export const glassCard = 'rounded-2xl backdrop-blur-sm transition-colors duration-300'
export const glassCardStyle = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.025)',
}

export function Eyebrow({ accent, children }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.34em]" style={{ color: accent }}>
      {children}
    </p>
  )
}

export default function PageShell({
  accent = ACCENT.home,
  eyebrow,
  title,
  lead,
  wide = false,
  children,
}) {
  return (
    <div className="relative min-h-screen" style={{ background: '#03030c' }}>
      {/* Ambient backdrop: faint neon grid fading out, plus an accent bloom at
          the top so the page never reads as a flat slab after the 3D lobby. */}
      <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,180,216,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.07) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 55% at 50% 0%, #000 30%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 55% at 50% 0%, #000 30%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 42% at 50% -8%, ${accent}24 0%, transparent 72%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col" style={{ zIndex: 1 }}>
        <SiteNav accent={accent} />

        <main className="flex-1">
          {(eyebrow || title) && (
            <header className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'} px-5 pb-4 pt-16`}>
              <Link
                href="/"
                className="mb-3 inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.26em] transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                ← Back to the lobby
              </Link>
              {eyebrow && <Eyebrow accent={accent}>{eyebrow}</Eyebrow>}
              {title && (
                <h1
                  className="mt-4 font-black leading-[1.05] tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)' }}
                >
                  {title}
                </h1>
              )}
              {lead && (
                <p
                  className="mt-5 max-w-2xl text-[15px] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {lead}
                </p>
              )}
            </header>
          )}
          {children}
        </main>

        <SiteFooter accent={accent} />
      </div>
    </div>
  )
}
