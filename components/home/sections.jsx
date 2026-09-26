'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import RelayField from './relay-field'
import { CountUp, EASE, Magnetic, Reveal, Scramble, ScrollWords, SplitChars, TiltCard, mono, serifItalic } from './motion-kit'

/* ───────────────────────────── Header ───────────────────────────── */

// Glass pill that tucks away while you read downward and slides back the
// moment you scroll up. A shared-layout highlight glides between links.
export function Header({ links, email, ready }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hover, setHover] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 24)
    if (menuOpen) return
    setHidden(y > prev && y > 260)
  })

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={ready ? { y: hidden ? -110 : 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, padding: '16px 16px 0' }}
    >
      <div
        className="nl-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          maxWidth: 1100,
          margin: '0 auto',
          height: 58,
          padding: '0 10px 0 20px',
          borderRadius: 999,
          background: solid ? 'rgba(5,5,16,0.72)' : 'rgba(5,5,16,0.35)',
          transition: 'background 0.4s ease',
        }}
      >
        <a href="#top" className="nl-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, color: '#fff' }}>
          <span className="nl-logo-mark">
            <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#03030c', animation: 'nl-pulse 2.6s ease-in-out infinite' }} />
          </span>
          <span style={{ ...mono, fontSize: 11, letterSpacing: '0.3em', whiteSpace: 'nowrap' }}>NYTTO LABS</span>
        </a>

        <nav className="nl-desktop-only" style={{ alignItems: 'center', gap: 4 }} onPointerLeave={() => setHover(null)}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onPointerEnter={() => setHover(l.href)}
              className="nl-roll"
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 16px', ...mono, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)' }}
            >
              {hover === l.href && (
                <motion.span
                  layoutId="nl-nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              )}
              <RollText text={l.label} />
            </a>
          ))}
          <Magnetic strength={0.25} style={{ marginLeft: 8 }}>
            <a href={`mailto:${email}`} className="nl-btn nl-btn-primary nl-roll" style={{ minHeight: 40, padding: '0 18px', ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              <RollText text="Get in touch" />
            </a>
          </Magnetic>
        </nav>

        <button
          type="button"
          className="nl-mobile-only"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          style={{ alignItems: 'center', justifyContent: 'center', width: 42, height: 42, flex: 'none', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, background: 'transparent', color: '#fff', cursor: 'pointer' }}
        >
          <span style={{ position: 'relative', width: 16, height: 10 }}>
            <motion.span animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} style={burgerLine(0)} />
            <motion.span animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} style={burgerLine(8)} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            className="nl-glass nl-mobile-only"
            initial={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ flexDirection: 'column', gap: 2, maxWidth: 1100, margin: '10px auto 0', padding: '14px 20px 18px', borderRadius: 24, background: 'rgba(5,5,16,0.94)' }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: EASE }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 54, borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}
              >
                {l.label}
                <span style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>0{i + 1}</span>
              </motion.a>
            ))}
            <motion.a
              href={`mailto:${email}`}
              onClick={() => setMenuOpen(false)}
              className="nl-btn nl-btn-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45, ease: EASE }}
              style={{ justifyContent: 'center', minHeight: 50, marginTop: 14, ...mono, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Get in touch
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

const burgerLine = (top) => ({ position: 'absolute', left: 0, top, width: 16, height: 1.5, borderRadius: 2, background: '#fff' })

// Hover swaps the label for an identical copy rolling up from below.
function RollText({ text }) {
  return (
    <span className="nl-roll-mask">
      <span className="nl-sr">{text}</span>
      <span aria-hidden="true" className="nl-roll-a">{text}</span>
      <span aria-hidden="true" className="nl-roll-b">{text}</span>
    </span>
  )
}

/* ────────────────────────────── Hero ────────────────────────────── */

export function Hero({ ready, facts }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const fieldOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2])

  return (
    <section ref={ref} id="top" style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: 0, opacity: fieldOpacity }}>
        <RelayField />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 70% at 30% 45%, transparent 30%, #03030c 100%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(transparent, #03030c)' }} />
      </motion.div>

      <motion.div className="nl-wrap" style={{ position: 'relative', zIndex: 2, width: '100%', padding: '140px 20px 120px', y, opacity, scale }}>
        <div style={{ maxWidth: '52rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
            transition={{ duration: 0.8, ease: EASE }}
            className="nl-badge"
          >
            <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#00f5ff', animation: 'nl-pulse 1.8s ease-in-out infinite' }} />
            <Scramble text="SWEDISH SOFTWARE COMPANY · F-TAX APPROVED" start={ready} duration={1300} style={{ ...mono, fontSize: 9, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.66)' }} />
          </motion.div>

          <h1 style={{ margin: '28px 0 0', fontSize: 'clamp(2.8rem, 8.4vw, 6.6rem)', lineHeight: 0.94, letterSpacing: '-0.045em', fontWeight: 700, perspective: 800 }}>
            <SplitChars text="Focused software." start={ready} delay={0.1} />
            <motion.span
              className="nl-shimmer"
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }}
              animate={ready ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : undefined}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.55 }}
              style={{ display: 'block', ...serifItalic, letterSpacing: '-0.015em', paddingBottom: '0.08em', paddingRight: '0.1em' }}
            >
              Invisible infrastructure.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            style={{ margin: '28px 0 0', maxWidth: '36rem', fontSize: 'clamp(16px, 1.5vw, 18px)', lineHeight: 1.65, color: 'rgba(255,255,255,0.56)', textWrap: 'pretty' }}
          >
            We build small products that finish a job — VAT proof, reorder labels, API spend limits — and one routing
            layer underneath them that turns real intent into the right next action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 38 }}
          >
            <Magnetic>
              <a href="#products" className="nl-btn nl-btn-primary nl-btn-lg">
                What you can buy today <span className="nl-arrow" style={mono}>→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#relay" className="nl-btn nl-btn-ghost nl-btn-lg">
                How Relay works
              </a>
            </Magnetic>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 36, marginTop: 56 }}>
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 16 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: 1.2 + i * 0.1 }}
                style={{ minWidth: 108, paddingLeft: 14, borderLeft: '1px solid rgba(0,245,255,0.3)' }}
              >
                <CountUp value={fact.value} start={ready} style={{ ...serifItalic, fontStyle: 'normal', fontSize: 38, lineHeight: 1, color: '#fff' }} />
                <div style={{ marginTop: 8, ...mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{fact.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div style={{ opacity }} className="nl-scroll-cue-wrap">
        <motion.a
          href="#lobby"
          aria-label="Scroll down"
          initial={{ opacity: 0, y: -10 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 1.8, duration: 1 }}
          className="nl-scroll-cue"
        >
          <span className="nl-scroll-cue-dot" />
        </motion.a>
      </motion.div>
    </section>
  )
}

/* ────────────────────────────── Lobby ───────────────────────────── */

export function Lobby({ doors, rooms }) {
  const [room, setRoom] = useState(null)
  const active = rooms.find((r) => r.key === room)
  return (
    <section id="lobby" className="nl-wrap" style={{ position: 'relative', padding: '40px 20px 96px' }}>
      <Reveal style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>THREE DOORS · PICK ONE AND WALK THROUGH</span>
        <AnimatePresence>
          {room && (
            <motion.button
              type="button"
              onClick={() => setRoom(null)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="nl-link-dim"
              style={{ border: 0, background: 'transparent', padding: 0, ...mono, fontSize: 9, letterSpacing: '0.24em', cursor: 'pointer' }}
            >
              ← BACK TO LOBBY
            </motion.button>
          )}
        </AnimatePresence>
      </Reveal>

      <AnimatePresence mode="wait" initial={false}>
        {!active ? (
          <motion.div
            key="doors"
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 32, marginTop: 44, justifyItems: 'center' }}
          >
            {doors.map((d, i) => (
              <Orb key={d.key} index={i} {...d} onClick={() => setRoom(d.key)} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={active.key}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)', borderRadius: '50%' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', borderRadius: '22px' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              marginTop: 44,
              padding: 'clamp(26px, 5vw, 48px)',
              border: `1px solid rgba(${active.color},0.34)`,
              background: `radial-gradient(120% 140% at 12% 0%, rgba(${active.color},0.16), rgba(3,3,12,0.92) 62%)`,
              boxShadow: `0 0 90px rgba(${active.color},0.16)`,
            }}
          >
            <div aria-hidden="true" className="nl-room-orbit" style={{ '--rc': `rgba(${active.color},0.5)` }} />
            <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }} style={{ position: 'relative' }}>
              <motion.div variants={fadeUp} style={{ ...mono, fontSize: 9, letterSpacing: '0.34em', color: active.hex }}>{active.eyebrow}</motion.div>
              <motion.h2 variants={fadeUp} style={{ margin: '16px 0 0', maxWidth: '32rem', fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontWeight: 700 }}>
                {active.title}
              </motion.h2>
              <motion.p variants={fadeUp} style={{ margin: '16px 0 0', maxWidth: '34rem', fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>
                {active.body}
              </motion.p>
              <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
                <Magnetic>
                  <a href={active.href} onClick={() => active.href.startsWith('#') && setRoom(null)} className="nl-btn nl-btn-lg" style={{ background: active.hex, color: '#03030c' }}>
                    {active.cta}
                  </a>
                </Magnetic>
                <button type="button" onClick={() => setRoom(null)} className="nl-btn nl-btn-ghost nl-btn-lg">
                  ← Back to lobby
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

const fadeUp = { h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }

function Orb({ index, onClick, color, hex, spinDeg, spinDur, floatDur, rippleDelay, label, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1, ease: EASE, delay: index * 0.12 }}
      style={{ width: '100%', maxWidth: 260 }}
    >
      <div style={{ animation: `nl-float ${floatDur} ease-in-out ${index * 0.5}s infinite` }}>
      <TiltCard
        as="button"
        type="button"
        onClick={onClick}
        max={14}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="nl-orb"
        style={{ position: 'relative', width: '100%', aspectRatio: '1', border: 0, padding: 0, background: 'transparent', cursor: 'pointer', borderRadius: '50%', '--oc': color }}
      >
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${spinDeg}deg, transparent 0deg, rgba(${color},0.85) 90deg, transparent 220deg)`, animation: `nl-spin ${spinDur} linear infinite` }} />
        <span aria-hidden="true" style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: `radial-gradient(circle at 50% 38%, rgba(${color},0.26), rgba(3,3,12,0.97) 68%)`, boxShadow: `inset 0 0 60px rgba(${color},0.25), 0 0 80px rgba(${color},0.18)` }} />
        <span aria-hidden="true" className="nl-orb-glint" />
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(${color},0.45)`, animation: `nl-ripple 4.5s ease-out ${rippleDelay} infinite` }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: 'translateZ(40px)' }}>
          <span style={{ ...mono, fontSize: 10, letterSpacing: '0.3em', color: hex }}>{label}</span>
          <span style={{ maxWidth: '72%', fontSize: 15, lineHeight: 1.35, color: 'rgba(255,255,255,0.75)' }}>{desc}</span>
          <span className="nl-orb-enter" style={{ ...mono, fontSize: 9, letterSpacing: '0.24em' }}>ENTER →</span>
        </span>
      </TiltCard>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────── Marquee ────────────────────────────── */

function wrap(min, max, v) {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

// Drifts on its own, then surges (and flips direction) with scroll speed,
// leaning into the motion via a velocity-driven skew.
export function VelocityMarquee({ baseVelocity = 2, children, skew = true, style }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const skewX = useTransform(smooth, [-2000, 2000], skew ? [8, -8] : [0, 0])
  const dir = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * Math.abs(f)
    baseX.set(baseX.get() + move)
  })

  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', ...style }}>
      <motion.div style={{ display: 'inline-flex', x, skewX }}>
        {[0, 1, 2, 3].map((k) => (
          <span key={k} aria-hidden={k > 0 ? 'true' : undefined} style={{ display: 'inline-flex', flex: 'none' }}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function Ticker({ rows }) {
  return (
    <section aria-label="Relay activity" style={{ position: 'relative', padding: '8px 0 24px' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(90deg, #03030c 0%, transparent 10%, transparent 90%, #03030c 100%)' }} />
      <VelocityMarquee baseVelocity={-1.6} skew={false} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 0', background: 'rgba(0,0,0,0.3)' }}>
        {rows.map((row) => (
          <span key={row.tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginRight: 56, ...mono, fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.36)' }}>
            <span style={{ color: '#00f5ff' }}>{row.tag}</span>
            {row.text}
          </span>
        ))}
      </VelocityMarquee>
      <VelocityMarquee baseVelocity={1.2} style={{ marginTop: 18 }}>
        {['Focused software', 'Invisible infrastructure', 'Fail-closed', 'Built in Sweden'].map((t) => (
          <span key={t} className="nl-outline-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em', marginRight: '0.5em' }}>
            {t}
            <span className="nl-star">✦</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  )
}

/* ─────────────────────────── Products ───────────────────────────── */

export function Products({ products, lede }) {
  return (
    <section id="products" className="nl-wrap nl-anchor" style={{ padding: '110px 20px 0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 22 }}>
        <div>
          <Reveal style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>01 · PORTFOLIO</Reveal>
          <h2 style={{ margin: '16px 0 0', fontSize: 'clamp(2.1rem, 5vw, 3.8rem)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 700 }}>
            <MaskLine>Each product lives under</MaskLine>
            <MaskLine delay={0.08}>
              its <span style={{ ...serifItalic, color: '#00f5ff' }}>own name.</span>
            </MaskLine>
          </h2>
        </div>
        <Reveal delay={0.15} style={{ maxWidth: '24rem', margin: 0, fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.48)' }}>
          {lede}
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, marginTop: 52 }}>
        {products.map((p, i) => (
          <ProductCard key={p.name} p={p} i={i} total={products.length} />
        ))}
      </div>
    </section>
  )
}

// A heading line that slides up from behind an invisible edge.
export function MaskLine({ children, delay = 0 }) {
  // The observer sits on the unclipped wrapper: the moving line starts fully
  // hidden by overflow, so watching it directly would never fire.
  return (
    <motion.span
      initial="h"
      whileInView="s"
      viewport={{ once: true, amount: 0.5 }}
      style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em' }}
    >
      <motion.span
        style={{ display: 'block', transformOrigin: '0% 100%' }}
        variants={{ h: { y: '105%', rotate: 3 }, s: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE, delay } } }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

function ProductCard({ p, i, total }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
    >
      <TiltCard
        as="a"
        href={p.url}
        target="_blank"
        rel="noreferrer"
        max={7}
        className="nl-card nl-product"
        style={{ '--ac': p.accent }}
      >
        <div className="nl-product-media">
          {p.image && (
            <div className="nl-product-zoom">
            <motion.img
              src={p.image}
              alt=""
              loading="lazy"
              initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.25 }}
              animate={inView ? { clipPath: 'inset(0% 0 0 0)', scale: 1 } : undefined}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.15 + i * 0.12 }}
            />
            </div>
          )}
          <span className="nl-product-index" style={mono}>
            {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="nl-live" style={mono}>
            <span className="nl-live-dot" style={{ background: p.dot }} />
            {p.status}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 24px 24px', flex: 1, transform: 'translateZ(24px)' }}>
          <span style={{ ...mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{p.category}</span>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>{p.name}</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', textWrap: 'pretty' }}>{p.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'auto', paddingTop: 12, ...mono, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.34)' }}>
            <span>{p.market}</span>
            <span className="nl-product-host">
              {p.host} <span className="nl-arrow">→</span>
            </span>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/* ─────────────────────────── Relay story ────────────────────────── */

// Scroll drives the story: as you move through the section the resolver
// "types" its request, the packet crosses the allowlist, and each step lights
// in turn. Small or short screens get the same sequence played on arrival.
export function RelayStory({ steps, lines }) {
  const outer = useRef(null)
  const [pinned, setPinned] = useState(false)
  const reduce = useReducedMotion()
  const auto = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })
  const inView = useInView(outer, { once: true, amount: 0.35 })

  useEffect(() => {
    const check = () => setPinned(window.innerWidth >= 960 && window.innerHeight >= 680)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (pinned || !inView) return undefined
    if (reduce) {
      auto.set(1)
      return undefined
    }
    const c = animate(auto, 1, { duration: 5, ease: 'linear' })
    return () => c.stop()
  }, [pinned, inView, reduce, auto])

  const progress = pinned ? scrollYProgress : auto
  const [p, setP] = useState(0)
  useMotionValueEvent(progress, 'change', (v) => setP(Math.round(v * 400) / 400))
  useEffect(() => setP(progress.get()), [progress])
  const railScale = useSpring(progress, { stiffness: 120, damping: 24 })

  const activeStep = Math.min(steps.length - 1, Math.floor(p * steps.length * 1.02))

  return (
    <section id="relay" ref={outer} className="nl-anchor" style={{ position: 'relative', height: pinned ? '300vh' : 'auto', marginTop: 120 }}>
      <div style={{ position: pinned ? 'sticky' : 'relative', top: 0, height: pinned ? '100vh' : 'auto', display: 'flex', alignItems: 'center' }}>
        <div className="nl-wrap" style={{ width: '100%', padding: '0 20px' }}>
          <div className="nl-relay-panel">
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.07), transparent)', animation: 'nl-sweep 9s ease-in-out infinite' }} />
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'center' }}>
              <div>
                <Reveal style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>02 · RELAY</Reveal>
                <h2 style={{ margin: '14px 0 16px', fontSize: 'clamp(1.9rem, 3.6vw, 2.9rem)', lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700 }}>
                  <MaskLine>Intent in.</MaskLine>
                  <MaskLine delay={0.1}>
                    <span style={serifItalic} className="nl-shimmer">Useful next action out.</span>
                  </MaskLine>
                </h2>
                <Reveal delay={0.1} as="p" style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', textWrap: 'pretty' }}>
                  Products create or detect commercial intent. Relay resolves it deterministically against an allowlist of
                  approved partner destinations, records attribution, and fails closed when no good answer exists.
                </Reveal>

                <div style={{ position: 'relative', display: 'grid', gap: 4, marginTop: 30, paddingLeft: 22 }}>
                  <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 1, background: 'rgba(255,255,255,0.1)' }} />
                  <motion.div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 1, background: 'linear-gradient(#00f5ff, #ff2bd1)', boxShadow: '0 0 10px #00f5ff', scaleY: railScale, transformOrigin: '50% 0%' }} />
                  {steps.map((s, i) => {
                    const on = i <= activeStep && p > 0.02
                    const current = i === activeStep && p > 0.02
                    return (
                      <motion.div
                        key={s.n}
                        animate={{ opacity: on ? 1 : 0.32, x: current ? 6 : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        style={{ position: 'relative', padding: '10px 0' }}
                      >
                        <motion.span
                          aria-hidden="true"
                          animate={{ scale: current ? 1 : on ? 0.6 : 0.4, background: on ? (i === steps.length - 1 ? '#ff2bd1' : '#00f5ff') : 'rgba(255,255,255,0.3)' }}
                          style={{ position: 'absolute', left: -26, top: 16, width: 9, height: 9, borderRadius: '50%', boxShadow: current ? '0 0 14px #00f5ff' : 'none' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                          <span style={{ ...mono, fontSize: 9, letterSpacing: '0.22em', color: '#00f5ff' }}>{s.n}</span>
                          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{s.title}</span>
                        </div>
                        <div style={{ marginTop: 4, marginLeft: 30, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.48)' }}>{s.body}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <Terminal lines={lines} p={p} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Terminal({ lines, p }) {
  const span = 0.9 / lines.length
  return (
    <Reveal
      y={50}
      className="nl-terminal"
      style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, background: 'linear-gradient(180deg, rgba(12,12,30,0.94), rgba(3,3,12,0.94))', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,255,0.04) inset' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '34%', pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,245,255,0.08), transparent)', animation: 'nl-scan 7s linear infinite' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: 10, ...mono, fontSize: 9, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.45)' }}>RESOLVER · EXAMPLE PAYLOAD</span>
        <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#00f5ff', animation: 'nl-pulse 1.6s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'grid', gap: 12, minHeight: 300, padding: '20px 18px 24px', ...mono, fontSize: 12, lineHeight: 1.7 }}>
        {lines.map((line, i) => {
          const local = Math.max(0, Math.min(1, (p - 0.04 - i * span) / span))
          if (local <= 0) return null
          if (line.kind === 'wire') return <Wire key={i} label={line.label} fill={local} fail={line.fail} />
          return <TypedLine key={i} line={line} fill={local} />
        })}
        <div style={{ color: 'rgba(255,255,255,0.3)' }}>
          ${' '}
          <span style={{ animation: 'nl-blink 1.1s steps(1,end) infinite' }}>▌</span>
        </div>
      </div>
    </Reveal>
  )
}

function TypedLine({ line, fill }) {
  const total = line.parts.reduce((n, part) => n + part.t.length, 0)
  let budget = Math.ceil(total * fill)
  const boxed = !!line.accent
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={
        boxed
          ? { padding: '10px 12px', borderLeft: `2px solid rgba(${line.accent},0.6)`, background: `rgba(${line.accent},0.05)`, color: 'rgba(255,255,255,0.66)', wordBreak: 'break-word' }
          : { color: 'rgba(255,255,255,0.4)', wordBreak: 'break-word' }
      }
    >
      {line.parts.map((part, k) => {
        const take = Math.max(0, Math.min(part.t.length, budget))
        budget -= take
        return (
          <span key={k} style={{ color: part.c || undefined }}>
            {part.t.slice(0, take)}
          </span>
        )
      })}
      {fill < 1 && <span style={{ color: '#00f5ff' }}>▌</span>}
    </motion.div>
  )
}

function Wire({ label, fill, fail }) {
  const c = fail ? '#ff2bd1' : '#00f5ff'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 18, color: 'rgba(255,255,255,0.3)' }}>
      <span style={{ position: 'relative', flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }}>
        <span style={{ position: 'absolute', left: 0, top: 0, height: 1, width: `${fill * 100}%`, background: c, boxShadow: `0 0 8px ${c}` }} />
        <span style={{ position: 'absolute', top: -3, left: `calc(${fill * 100}% - 3px)`, width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: `0 0 12px ${c}` }} />
      </span>
      <span style={{ fontSize: 9, letterSpacing: '0.2em', color: fill >= 1 ? c : undefined, transition: 'color 0.3s' }}>{label}</span>
    </div>
  )
}

/* ──────────────────────────── Scope ─────────────────────────────── */

export function Scope({ nots }) {
  return (
    <section className="nl-wrap" style={{ padding: '120px 20px 0' }}>
      <Reveal style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>03 · SCOPE</Reveal>
      <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(1.9rem, 3.6vw, 2.9rem)', lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700 }}>
        <MaskLine>What we deliberately don&rsquo;t do.</MaskLine>
      </h2>
      <motion.div
        initial="h"
        whileInView="s"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ s: { transition: { staggerChildren: 0.07 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: 12, marginTop: 34 }}
      >
        {nots.map((n) => (
          <motion.div key={n} variants={notItem} className="nl-not">
            <motion.span variants={notX} style={{ ...mono, fontSize: 13, color: '#ff2bd1', display: 'inline-block' }}>
              ✕
            </motion.span>
            <span>
              <motion.span variants={strike} className="nl-strike">
                {n}
              </motion.span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

const notItem = { h: { opacity: 0, y: 20, scale: 0.96 }, s: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } } }
const notX = { h: { rotate: -180, scale: 0 }, s: { rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 14, delay: 0.2 } } }
const strike = { h: { backgroundSize: '0% 1.5px' }, s: { backgroundSize: '100% 1.5px', transition: { duration: 0.6, ease: EASE, delay: 0.45 } } }

/* ─────────────────────────── Statement ──────────────────────────── */

export function Statement({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  return (
    <section ref={ref} className="nl-wrap" style={{ padding: '120px 20px 20px' }}>
      <ScrollWords
        text={text}
        progress={scrollYProgress}
        accentWords={['honest']}
        style={{ margin: 0, maxWidth: '62rem', fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', lineHeight: 1.2, letterSpacing: '-0.03em', fontWeight: 600 }}
      />
    </section>
  )
}

/* ─────────────────────────── Partners ───────────────────────────── */

export function PartnersContact({ email, inboxes }) {
  return (
    <section id="partners" className="nl-wrap nl-anchor" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, padding: '110px 20px 0' }}>
      <Reveal>
        <TiltCard max={4} className="nl-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 'clamp(26px, 4vw, 40px)', '--ac': '0,245,255', borderColor: 'rgba(0,245,255,0.24)', background: 'linear-gradient(160deg, rgba(0,245,255,0.08), rgba(3,3,12,0.6) 70%)' }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: '#00f5ff' }}>PARTNERS</div>
          <h3 style={{ margin: 0, fontSize: 'clamp(24px, 2.6vw, 30px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 700 }}>
            If your product touches ours, there is probably a reason to talk.
          </h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.52)' }}>
            You keep checkout and fulfilment. We connect high-intent users to a relevant next action, on approved domains
            only.
          </p>
          <Magnetic style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
            <a href={`mailto:${email}`} className="nl-btn nl-btn-primary nl-btn-lg">
              Open a partner thread <span className="nl-arrow" style={mono}>→</span>
            </a>
          </Magnetic>
        </TiltCard>
      </Reveal>
      <Reveal delay={0.12}>
        <TiltCard max={4} className="nl-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 'clamp(26px, 4vw, 40px)', '--ac': '255,43,209' }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.45)' }}>CONTACT</div>
          <h3 style={{ margin: 0, fontSize: 'clamp(24px, 2.6vw, 30px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 700 }}>
            A real inbox, read by the people who write the code.
          </h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.52)' }}>No ticket queue, no sales funnel.</p>
          <div style={{ display: 'grid', marginTop: 4, ...mono, fontSize: 12 }}>
            {inboxes.map((i) => (
              <a key={i.email} href={`mailto:${i.email}`} className="nl-inbox">
                <span className="nl-inbox-email">{i.email}</span>
                <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.34)' }}>{i.use}</span>
                <span className="nl-inbox-arrow">→</span>
              </a>
            ))}
          </div>
        </TiltCard>
      </Reveal>
    </section>
  )
}

/* ─────────────────────────── Wordmark ───────────────────────────── */

export function Wordmark() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const spread = useTransform(scrollYProgress, [0, 1], ['-0.02em', '0.02em'])
  const letters = 'NYTTO LABS'.split('')
  return (
    <section ref={ref} aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: '140px 0 0' }}>
      <motion.div
        initial="h"
        whileInView="s"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ s: { transition: { staggerChildren: 0.05 } } }}
        style={{ display: 'flex', justifyContent: 'center', letterSpacing: spread, fontSize: 'clamp(3rem, 14.6vw, 15rem)', fontWeight: 700, lineHeight: 0.8, whiteSpace: 'nowrap' }}
      >
        {letters.map((c, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.04em' }}>
            <motion.span variants={wmLetter} className="nl-wm-letter">
              {c === ' ' ? ' ' : c}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}

const wmLetter = { h: { y: '100%' }, s: { y: '0%', transition: { duration: 1.1, ease: EASE } } }
