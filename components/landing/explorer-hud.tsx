'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Compass } from 'lucide-react'
import { MISSIONS, useExplorer } from './explorer'
import s from './landing.module.css'

/** Header button with a progress ring; opens the mission list. */
export default function ExplorerHud({ notify }: { notify: (message: string) => void }) {
  const { done, latest, reset } = useExplorer()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const total = MISSIONS.length
  const count = done.size
  const pct = count / total
  const R = 9
  const C = 2 * Math.PI * R

  // Celebrate each newly completed mission.
  const lastSeen = useRef<number>(0)
  useEffect(() => {
    if (!latest || latest.at === lastSeen.current) return
    lastSeen.current = latest.at
    const mission = MISSIONS.find((m) => m.id === latest.id)
    if (!mission) return
    notify(
      count === total
        ? `All ${total} missions complete — you've seen everything Nytto Labs does.`
        : `Mission unlocked · ${mission.label} · ${count}/${total}`,
    )
  }, [latest, count, total, notify])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={s.hudWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${s.hudBtn} ${count === total ? s.hudBtnDone : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="explorer-panel"
        aria-label={`Explorer: ${count} of ${total} missions complete`}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle
            cx="11"
            cy="11"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            transform="rotate(-90 11 11)"
            className={s.hudRing}
          />
        </svg>
        <span className={`${s.hudCount} ${s.mono}`}>
          {count}/{total}
        </span>
      </button>

      {open && (
        <div className={s.hudPanel} id="explorer-panel" role="dialog" aria-label="Explorer missions">
          <div className={s.hudHead}>
            <Compass size={14} aria-hidden="true" />
            <span className={s.mono}>EXPLORER · {count}/{total}</span>
          </div>
          <p className={s.hudIntro}>Every part of this page does something. Find it all.</p>
          <ul className={s.hudList}>
            {MISSIONS.map((m) => {
              const isDone = done.has(m.id)
              return (
                <li key={m.id}>
                  <a
                    href={m.href}
                    className={`${s.hudItem} ${isDone ? s.hudItemDone : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className={s.hudCheck} aria-hidden="true">
                      {isDone ? <Check size={12} /> : null}
                    </span>
                    <span>
                      <span className={s.hudLabel}>{m.label}</span>
                      <span className={`${s.hudHint} ${s.mono}`}>{isDone ? 'done' : m.hint}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
          {count > 0 && (
            <button type="button" className={s.hudReset} onClick={reset}>
              Reset progress
            </button>
          )}
        </div>
      )}
    </div>
  )
}
