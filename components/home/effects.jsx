'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE, mono, useFinePointer } from './motion-kit'

// Inertial smooth scrolling for wheel/trackpad. Touch keeps native scrolling
// (Lenis leaves it alone by default) and reduced-motion users get none.
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return undefined
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      autoRaf: true,
      anchors: { offset: -84 },
    })
    return () => lenis.destroy()
  }, [reduce])
  return null
}

// A soft ring that trails the pointer and swells over anything clickable.
// The native cursor stays visible — this is an accent, not a replacement.
export function CursorHalo() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 })
  const gx = useSpring(x, { stiffness: 60, damping: 20 })
  const gy = useSpring(y, { stiffness: 60, damping: 20 })
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!fine || reduce) return undefined
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setShown(true)
      setHot(!!e.target.closest?.('a, button, [role="button"], .nl-hot'))
    }
    const leave = () => setShown(false)
    const press = () => setDown(true)
    const release = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null
  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: gx,
          y: gy,
          width: 520,
          height: 520,
          marginLeft: -260,
          marginTop: -260,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          background: 'radial-gradient(closest-side, rgba(0,245,255,0.07), transparent 70%)',
          opacity: shown ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: down ? 0.7 : hot ? 1.9 : 1, opacity: shown ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: sx,
          y: sy,
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderRadius: '50%',
          border: '1px solid rgba(0,245,255,0.75)',
          background: hot ? 'rgba(0,245,255,0.12)' : 'transparent',
          boxShadow: '0 0 18px rgba(0,245,255,0.35)',
          pointerEvents: 'none',
          zIndex: 200,
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}

// A thin progress rail across the very top that springs with the scroll.
export function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90, height: 2, background: 'rgba(255,255,255,0.04)' }}>
      <motion.div
        style={{
          height: '100%',
          scaleX,
          transformOrigin: '0% 50%',
          background: 'linear-gradient(90deg, #ff2bd1, #00f5ff 45%, #00ff9d)',
          boxShadow: '0 0 14px rgba(0,245,255,0.7)',
        }}
      />
    </div>
  )
}

// The page's colour field. Three blurred blobs drift on their own and slide
// with the scroll, so the ambient light shifts cyan → magenta → green → amber
// as you move through sections — one continuous surface, no hard edges.
// Only transform and opacity are scroll-driven, so the blurred layers stay on
// the compositor instead of being re-rasterised every frame.
export function Aurora() {
  const { scrollYProgress } = useScroll()
  const yA = useTransform(scrollYProgress, [0, 1], ['-8vh', '40vh'])
  const yB = useTransform(scrollYProgress, [0, 1], ['30vh', '-10vh'])
  const yC = useTransform(scrollYProgress, [0, 1], ['70vh', '0vh'])
  const cyan = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 0.55, 0.25])
  const magenta = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.8], [0.35, 1, 0.6, 0.3])
  const green = useTransform(scrollYProgress, [0.15, 0.45, 0.75], [0.15, 1, 0.5])
  const amber = useTransform(scrollYProgress, [0.55, 0.85, 1], [0, 0.8, 1])
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <motion.div className="nl-blob" style={{ y: yA, opacity: cyan, top: 0, left: '4%', width: '58vw', height: '58vw', '--c': 'rgba(0,245,255,0.2)', animationDuration: '19s' }} />
      <motion.div className="nl-blob" style={{ y: yB, opacity: magenta, top: 0, right: '-8%', width: '48vw', height: '48vw', '--c': 'rgba(255,43,209,0.16)', animationDuration: '23s', animationDirection: 'reverse' }} />
      <motion.div className="nl-blob" style={{ y: yC, opacity: green, top: 0, left: '28%', width: '44vw', height: '44vw', '--c': 'rgba(0,255,157,0.12)', animationDuration: '27s' }} />
      <motion.div className="nl-blob" style={{ y: yB, opacity: amber, top: '20vh', left: '-10%', width: '46vw', height: '46vw', '--c': 'rgba(255,138,30,0.12)', animationDuration: '31s', animationDirection: 'reverse' }} />
      <div className="nl-grid" />
      <div className="nl-grain" />
    </div>
  )
}

const INTRO_WORD = 'NYTTO LABS'

// A short boot sequence: a counter runs to 100 while the wordmark decodes,
// then the curtain lifts on a curved edge. CSS carries a fail-safe fade so
// the page is never trapped behind it if JavaScript stalls.
export function Intro({ onDone }) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(true)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (reduce) {
      setOpen(false)
      doneRef.current?.()
      return undefined
    }
    let raf
    const t0 = performance.now()
    const total = 1250
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / total)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else
        setTimeout(() => {
          setOpen(false)
          doneRef.current?.()
        }, 180)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          className="nl-intro"
          aria-hidden="true"
          initial={{ clipPath: 'ellipse(150% 150% at 50% 0%)' }}
          exit={{ clipPath: 'ellipse(150% 0% at 50% 0%)' }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ display: 'flex', gap: '0.1em', fontSize: 'clamp(1.6rem, 6vw, 3.4rem)', fontWeight: 700, letterSpacing: '0.18em' }}>
              {INTRO_WORD.split('').map((c, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
                  <motion.span
                    style={{ display: 'inline-block' }}
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.05 + i * 0.045 }}
                  >
                    {c === ' ' ? ' ' : c}
                  </motion.span>
                </span>
              ))}
            </div>
            <div style={{ width: 'min(280px, 60vw)', height: 1, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${count}%`, background: 'linear-gradient(90deg, #ff2bd1, #00f5ff)', boxShadow: '0 0 12px #00f5ff' }} />
            </div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: '0.34em', color: 'rgba(255,255,255,0.45)' }}>
              ROUTING INTENT · {String(count).padStart(3, '0')}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
