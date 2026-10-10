'use client'

import { useEffect, useState } from 'react'
import s from './landing.module.css'

const GLYPHS = '01<>/\\{}[]#$%&*+=?ABCDEFGHJKLMNPQRSTUVWXYZ'

/**
 * Renders `text` exactly once in the DOM, then (once, on mount) decodes it
 * visually from random glyphs left-to-right. The scrambled glyphs are painted
 * by a CSS ::after pseudo-element (content: attr(data-glyphs)), which is not
 * part of the element's text content — so the heading's text, as read by
 * screen readers and crawlers, is always the real line, never duplicated.
 * Skipped entirely under prefers-reduced-motion.
 */
export default function DecodeText({ text, delay = 0, duration = 700 }: { text: string; delay?: number; duration?: number }) {
  const [glyphs, setGlyphs] = useState<string | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay
      const p = Math.min(1, Math.max(0, (now - start) / duration))
      if (p >= 1) {
        setGlyphs(null)
        return
      }
      const revealed = Math.floor(p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i]
        out += i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setGlyphs(out)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, duration])

  return (
    <span className={glyphs ? s.decoding : undefined} data-glyphs={glyphs ?? undefined}>
      {text}
    </span>
  )
}
