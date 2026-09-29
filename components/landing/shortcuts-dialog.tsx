'use client'

import { useEffect, useRef } from 'react'
import { NAV_SECTIONS } from './data'
import s from './landing.module.css'

export default function ShortcutsDialog({ open, onClose, paletteKey }: { open: boolean; onClose: () => void; paletteKey: string }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const rows: { keys: string[]; label: string }[] = [
    { keys: [paletteKey], label: 'Command palette' },
    ...NAV_SECTIONS.map((n) => ({ keys: [String(Number(n.num))], label: n.label })),
    { keys: ['R'], label: 'Relay playground' },
    { keys: ['?'], label: 'This keyboard map' },
    { keys: ['Esc'], label: 'Close any overlay' },
  ]

  return (
    <div
      className={s.paletteBackdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={s.palette} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" style={{ maxWidth: 440 }}>
        <div className={s.paletteInputRow} style={{ justifyContent: 'space-between', minHeight: 52 }}>
          <span className={`${s.mono} ${s.paletteGroup}`} style={{ padding: 0 }}>
            Keyboard map
          </span>
          <button ref={closeRef} type="button" className={s.kbd} onClick={onClose} style={{ cursor: 'pointer' }}>
            esc
          </button>
        </div>
        <ul className={s.paletteList} style={{ margin: 0, listStyle: 'none' }}>
          {rows.map((r) => (
            <li key={r.label} className={s.paletteItem} style={{ cursor: 'default' }}>
              <span>{r.label}</span>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {r.keys.map((k) => (
                  <kbd key={k} className={s.kbd}>
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
