'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import s from './landing-v2.module.css'

const LETTERS = 'NYTTO LABS'.split('')

export default function Wordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver !== 'function') return undefined
    setArmed(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={`${s.wm} ${armed && !shown ? s.wmHidden : ''}`}>
      <div className={s.wmRow}>
        {LETTERS.map((c, i) => (
          <span key={i} className={s.wmSlot}>
            <span className={s.wmLetter} style={{ '--i': i } as CSSProperties}>
              {c === ' ' ? ' ' : c}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
