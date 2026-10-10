'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import type { Command, CommandGroup } from './types'
import s from './landing.module.css'

// Layout effect on the client (runs in the same task as the Cmd/Ctrl+K keydown,
// so the input is focused before the next keystroke); plain effect on the server.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const GROUP_ORDER: CommandGroup[] = ['Jump to', 'Copy', 'Open']

interface Props {
  open: boolean
  onClose: () => void
  commands: Command[]
}

function matches(cmd: Command, query: string): boolean {
  if (!query) return true
  const hay = `${cmd.group} ${cmd.label} ${cmd.hint ?? ''} ${cmd.keywords ?? ''}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

/**
 * Dependency-free command palette. Opened by Cmd/Ctrl+K (bound in LandingPage)
 * or the header trigger. Arrow keys move, Enter runs, Escape closes.
 */
export default function CommandPalette({ open, onClose, commands }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const baseId = useId()

  const filtered = useMemo(() => {
    const hits = commands.filter((c) => matches(c, query.trim()))
    // Keep a stable group order so arrow navigation follows what is rendered.
    return GROUP_ORDER.flatMap((g) => hits.filter((c) => c.group === g))
  }, [commands, query])

  useIsoLayoutEffect(() => {
    if (!open) return undefined
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    setQuery('')
    setActive(0)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      restoreFocusRef.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  const run = (cmd: Command | undefined) => {
    if (!cmd) return
    onClose()
    // Run after close so focus restoration does not fight navigation.
    requestAnimationFrame(() => cmd.run())
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = filtered.length
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (count) setActive((i) => (i + 1) % count)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (count) setActive((i) => (i - 1 + count) % count)
        break
      case 'Home':
        if (count) {
          e.preventDefault()
          setActive(0)
        }
        break
      case 'End':
        if (count) {
          e.preventDefault()
          setActive(count - 1)
        }
        break
      case 'Enter':
        e.preventDefault()
        run(filtered[active])
        break
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        onClose()
        break
      case 'Tab':
        // Single focusable control: keep focus inside the dialog.
        e.preventDefault()
        inputRef.current?.focus()
        break
      default:
        break
    }
  }

  const listId = `${baseId}-list`
  const optionId = (i: number) => `${baseId}-opt-${i}`
  let lastGroup: CommandGroup | null = null

  return (
    <div
      className={s.paletteBackdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={s.palette} role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKeyDown}>
        <div className={s.paletteInputRow}>
          <Search size={16} className={s.paletteIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            className={s.paletteInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a product, copy an endpoint, contact support…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={filtered.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={s.kbd}>esc</kbd>
        </div>

        <div ref={listRef} className={s.paletteList} role="listbox" id={listId} aria-label="Commands">
          {filtered.length === 0 && <div className={s.paletteEmpty}>No matching commands.</div>}
          {filtered.map((cmd, i) => {
            const header = cmd.group !== lastGroup ? cmd.group : null
            lastGroup = cmd.group
            return (
              <div key={cmd.id} role="presentation">
                {header && (
                  <div className={`${s.paletteGroup} ${s.mono}`} role="presentation">
                    {header}
                  </div>
                )}
                <div
                  id={optionId(i)}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  className={`${s.paletteItem} ${i === active ? s.paletteItemActive : ''}`}
                  onMouseMove={() => {
                    if (i !== active) setActive(i)
                  }}
                  onClick={() => run(cmd)}
                >
                  <span>{cmd.label}</span>
                  {cmd.hint && <span className={`${s.paletteHint} ${s.mono}`}>{cmd.hint}</span>}
                </div>
              </div>
            )
          })}
        </div>

        <div className={s.paletteFoot} aria-hidden="true">
          <span>
            <kbd className={s.kbd}>↑</kbd>
            <kbd className={s.kbd}>↓</kbd> navigate
          </span>
          <span>
            <kbd className={s.kbd}>↵</kbd> run
          </span>
          <span>
            <kbd className={s.kbd}>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}
