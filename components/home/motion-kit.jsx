'use client'

import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]
export const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' }
export const serifItalic = { fontFamily: 'var(--font-serif), Georgia, serif', fontStyle: 'italic', fontWeight: 400 }

// True only for a real mouse/trackpad. Hover-driven effects (tilt, magnet,
// cursor) stay off on touch so taps never leave cards stuck mid-tilt.
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return fine
}

// Fades and lifts content in the first time it scrolls into view. Blur is
// part of the entrance so sections "focus" into place rather than just appear.
export function Reveal({ as = 'div', delay = 0, y = 28, blur = 8, amount = 0.15, className, style, children, ...rest }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Splits a line into characters that flip up out of a mask. The readable
// string lives on the wrapper's aria-label so screen readers get one word,
// not a spelled-out sequence of letters.
export function SplitChars({ text, start = true, delay = 0, stagger = 0.028, style, charStyle }) {
  const words = text.split(' ')
  let i = 0
  return (
    <span style={{ display: 'block', ...style }}>
      <span className="nl-sr">{text}</span>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((ch) => {
            const idx = i++
            return (
              <span key={idx} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
                <motion.span
                  style={{ display: 'inline-block', transformOrigin: '50% 100%', ...charStyle }}
                  initial={{ y: '110%', rotateX: -80, opacity: 0 }}
                  animate={start ? { y: '0%', rotateX: 0, opacity: 1 } : undefined}
                  transition={{ duration: 0.9, ease: EASE, delay: delay + idx * stagger }}
                >
                  {ch}
                </motion.span>
              </span>
            )
          })}
          {w < words.length - 1 && <span style={{ display: 'inline-block', width: '0.26em' }} />}
        </span>
      ))}
    </span>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/<>_#'

// Resolves a string out of random glyphs, left to right — a decoding effect
// that fits a routing/infra company better than a plain fade.
export function Scramble({ text, start = true, duration = 1100, style, className }) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!start || reduce) {
      setOut(text)
      return undefined
    }
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const settled = Math.floor(p * text.length)
      let s = ''
      for (let k = 0; k < text.length; k++) {
        const c = text[k]
        if (k < settled || c === ' ') s += c
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, start, duration, reduce])
  return (
    <span className={className} style={style}>
      <span className="nl-sr">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

// Counts a numeric fact up from zero once visible. Non-numeric values
// (e.g. "SE") are scrambled in instead so the whole row animates together.
export function CountUp({ value, start = true, style }) {
  const ref = useRef(null)
  const n = Number(value)
  const numeric = Number.isFinite(n) && String(value).trim() !== ''
  const [display, setDisplay] = useState(numeric ? '0' : value)
  useEffect(() => {
    if (!numeric) return undefined
    if (!start) return undefined
    const controls = animate(0, n, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    })
    return () => controls.stop()
  }, [n, numeric, start])
  if (!numeric) return <Scramble text={String(value)} start={start} duration={900} style={style} />
  return (
    <span ref={ref} style={style}>
      <span className="nl-sr">{String(value)}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}

// Pulls its child toward the pointer while hovered, then springs home.
export function Magnetic({ strength = 0.35, children, style, className }) {
  const fine = useFinePointer()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const onMove = (e) => {
    if (!fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ display: 'inline-flex', x: sx, y: sy, ...style }}
    >
      {children}
    </motion.span>
  )
}

// A card that tilts in 3D toward the pointer and carries a spotlight that
// follows it (exposed as --mx/--my for the .nl-spot CSS layer).
export function TiltCard({ as = 'div', max = 8, children, style, className, ...rest }) {
  const fine = useFinePointer()
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 18 })
  const Tag = motion[as] || motion.div
  const onMove = (e) => {
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    node.style.setProperty('--mx', `${nx * 100}%`)
    node.style.setProperty('--my', `${ny * 100}%`)
    if (fine) {
      px.set(nx)
      py.set(ny)
    }
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }
  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`nl-spot ${className || ''}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: 'preserve-3d', ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Lights a paragraph word-by-word as it scrolls through the viewport.
export function ScrollWords({ text, progress, range = [0, 1], style, accentWords = [] }) {
  const words = text.split(' ')
  const [a, b] = range
  const step = (b - a) / words.length
  return (
    <p style={style}>
      <span className="nl-sr">{text}</span>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          word={w}
          progress={progress}
          from={a + i * step}
          to={a + (i + 1) * step}
          accent={accentWords.includes(w.replace(/[.,]/g, ''))}
        />
      ))}
    </p>
  )
}

function Word({ word, progress, from, to, accent }) {
  const opacity = useTransform(progress, [from, to], [0.12, 1])
  const y = useTransform(progress, [from, to], [8, 0])
  return (
    <motion.span
      aria-hidden="true"
      style={{ display: 'inline-block', marginRight: '0.25em', opacity, y, color: accent ? '#00f5ff' : undefined }}
    >
      {word}
    </motion.span>
  )
}

export function useInViewOnce(ref, amount = 0.3) {
  return useInView(ref, { once: true, amount })
}
