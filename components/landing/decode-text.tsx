'use client'

import { useEffect, useState } from 'react'

const GLYPHS = '01<>/\\{}[]#$%&*+=?ABCDEFGHJKLMNPQRSTUVWXYZ'

/**
 * Renders `text`, then (once, on mount) decodes it from random glyphs
 * left-to-right. Server HTML and screen readers always get the real text;
 * skipped entirely under prefers-reduced-motion.
 */
export default function DecodeText({ text, delay = 0, duration = 700 }: { text: string; delay?: number; duration?: number }) {
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay
      const p = Math.min(1, Math.max(0, (now - start) / duration))
      const revealed = Math.floor(p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i]
        out += i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setShown(out)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, duration])

  return (
    <>
      <span aria-hidden="true">{shown}</span>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {text}
      </span>
    </>
  )
}
