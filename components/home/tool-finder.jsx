'use client'

import Link from 'next/link'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, X } from 'lucide-react'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { toolByName, toolCopy } from '@/lib/tools'
import s from './home.module.css'

const COPY = {
  en: {
    label: 'Describe the job you need done',
    placeholder: 'Describe the job…',
    typed: [
      'I’m moving and want to find things in my boxes',
      'Check 200 EU VAT numbers for our books',
      'My Next.js deploy fails on Vercel',
      'Our shop and warehouse stock don’t match',
      'We need a booking form that emails us',
    ],
    examples: ['Label 40 moving boxes', 'Check EU VAT numbers', 'Why did my Vercel build fail?', 'Sell a PDF without a shop', 'Excel breaks åäö in my CSV', 'An AI policy for my staff'],
    submit: 'Find the tool',
    aiNote: 'Claude answers. Please leave out personal details.',
    plainNote: 'Describe it in your own words.',
    enter: 'to ask',
    byClaude: 'Answered by Claude',
    byMatch: 'Keyword match',
    thinking: 'Finding the right tool…',
    clear: 'Clear the answer',
    rateLimited: 'That was a lot of questions. Try again in a few minutes, or browse the tools below.',
    failed: 'No answer right now. Browse the tools below, or send the job by email.',
    sendJob: 'Send this as a job',
    howCustom: 'How custom work works',
    subject: 'Fix this',
  },
  sv: {
    label: 'Beskriv jobbet du behöver få gjort',
    placeholder: 'Beskriv jobbet…',
    typed: [
      'Vi flyttar och vill hitta saker i lådorna',
      'Kontrollera 200 EU-momsnummer till bokföringen',
      'Min Next.js-deploy failar på Vercel',
      'Lagret i butiken och på lagret stämmer inte',
      'Vi behöver ett bokningsformulär som mejlar oss',
    ],
    examples: ['Märka 40 flyttlådor', 'Kontrollera EU-momsnummer', 'Varför failar mitt Vercel-bygge?', 'Sälja en PDF utan butik', 'Excel förstör åäö i min CSV', 'En AI-policy för personalen'],
    submit: 'Hitta verktyget',
    aiNote: 'Claude svarar. Skriv inga personuppgifter.',
    plainNote: 'Beskriv det med egna ord.',
    enter: 'för att fråga',
    byClaude: 'Svar från Claude',
    byMatch: 'Sökordsmatchning',
    thinking: 'Letar fram rätt verktyg…',
    clear: 'Rensa svaret',
    rateLimited: 'Det blev många frågor. Försök igen om några minuter, eller bläddra bland verktygen nedan.',
    failed: 'Inget svar just nu. Bläddra bland verktygen nedan, eller skicka jobbet via mejl.',
    sendJob: 'Skicka det som ett uppdrag',
    howCustom: 'Så funkar uppdrag',
    subject: 'Fixa det här',
  },
}

// A four-point spark in the AI gradient: the mark for "Claude did this".
export function Spark({ size = 14 }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b43f0" />
          <stop offset="0.5" stopColor="#ff5c8a" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill={`url(#spark-${id})`} />
    </svg>
  )
}

function useTypedPlaceholder(lines, fallback, paused) {
  const [text, setText] = useState(fallback)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(fallback)
      return undefined
    }
    let line = 0
    let length = 0
    let step = 1
    let timer
    const tick = () => {
      const full = lines[line]
      length += step
      setText(full.slice(0, length))
      let delay = step > 0 ? 42 : 18
      if (step > 0 && length >= full.length) {
        step = -1
        delay = 1900
      } else if (step < 0 && length <= 0) {
        step = 1
        line = (line + 1) % lines.length
        delay = 380
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 700)
    return () => clearTimeout(timer)
  }, [lines, fallback, paused])
  return text
}

export default function ToolFinder({ locale, onPicks }) {
  const t = COPY[locale] || COPY.en
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [ai, setAi] = useState(null)
  const [result, setResult] = useState({ status: 'idle' })
  const inputRef = useRef(null)
  const pending = useRef(null)
  const placeholder = useTypedPlaceholder(t.typed, t.placeholder, focused || query.length > 0)

  useEffect(() => {
    fetch('/api/finder')
      .then((r) => r.json())
      .then((d) => setAi(Boolean(d?.ai)))
      .catch(() => setAi(false))
  }, [])

  // Grow the box with the text, up to its max height.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [query])

  async function ask(text) {
    const q = (text ?? query).replace(/\s+/g, ' ').trim()
    if (q.length < 3) return
    setQuery(q)
    setResult({ status: 'busy' })
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    try {
      const res = await fetch('/api/finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, locale }),
        signal: controller.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 429) return setResult({ status: 'error', msg: t.rateLimited })
      if (!res.ok || !Array.isArray(data.picks)) return setResult({ status: 'error', msg: t.failed })
      setResult({ status: 'done', q, ...data })
      onPicks?.(data.picks)
    } catch (error) {
      if (error?.name !== 'AbortError') setResult({ status: 'error', msg: t.failed })
    }
  }

  function clear() {
    pending.current?.abort()
    setResult({ status: 'idle' })
    setQuery('')
    onPicks?.([])
    inputRef.current?.focus()
  }

  const busy = result.status === 'busy'
  const mail = (q) =>
    `mailto:${PUBLIC_HELLO_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(`${q}\n\n`)}`

  return (
    <div className={s.finder}>
      <form
        className={s.ring}
        data-busy={busy}
        onSubmit={(e) => {
          e.preventDefault()
          ask()
        }}
      >
        <div className={s.box}>
          <div className={s.inputRow}>
            <label htmlFor="finder-input" className="sr-only">{t.label}</label>
            <div className={s.inputWrap}>
              {query === '' && (
                <span className={s.ghost} aria-hidden>
                  {placeholder}
                  {!focused && <span className={s.caret} />}
                </span>
              )}
              <textarea
                id="finder-input"
                ref={inputRef}
                rows={1}
                value={query}
                maxLength={280}
                className={s.input}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    ask()
                  }
                }}
              />
            </div>
            <button type="submit" className={s.send} disabled={busy || query.trim().length < 3} aria-label={t.submit}>
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          <div className={s.boxFoot}>
            <span className={s.spark}>
              {ai && <Spark />}
              {ai ? t.aiNote : t.plainNote}
            </span>
            <span className="hidden sm:inline">
              <kbd>Enter</kbd> {t.enter}
            </span>
          </div>
        </div>
      </form>

      {result.status === 'idle' ? (
        <div className={s.examples}>
          {t.examples.map((example) => (
            <button key={example} type="button" className={s.example} onClick={() => ask(example)}>
              {example}
            </button>
          ))}
        </div>
      ) : (
        <div className={s.answer} aria-live="polite" aria-busy={busy}>
          <div className={s.answerHead}>
            <span className={s.spark}>
              {result.source === 'ai' && <Spark />}
              {result.status === 'done' && (result.source === 'ai' ? t.byClaude : t.byMatch)}
            </span>
            <button type="button" onClick={clear} className="-m-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-faded transition-colors hover:bg-canvas-2 hover:text-ink" aria-label={t.clear}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {busy && (
            <p className={s.thinking}>
              <span className={s.dots} aria-hidden><i /><i /><i /></span>
              {t.thinking}
            </p>
          )}

          {result.status === 'error' && <p className={s.reply}>{result.msg}</p>}

          {result.status === 'done' && (
            <>
              <p className={s.reply}>
                {result.reply.split(' ').map((word, i) => (
                  <Fragment key={i}>
                    <span className={s.word} style={{ animationDelay: `${i * 32}ms` }}>{word}</span>{' '}
                  </Fragment>
                ))}
              </p>
              {result.picks.length > 0 && (
                <div className={s.picks}>
                  {result.picks.map((name, i) => {
                    const tool = toolByName(name)
                    if (!tool) return null
                    const c = toolCopy(tool, locale)
                    return (
                      <a key={name} href={tool.url} className={s.pick} style={{ animationDelay: `${220 + i * 90}ms` }}>
                        <span className={s.pickName}>
                          {tool.name}
                          <small>{c.category}</small>
                        </span>
                        <span className={s.pickMeta}>{c.free} · {c.price}</span>
                        <span className={s.pickGo}>
                          {c.cta} <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </a>
                    )
                  })}
                </div>
              )}
              {result.custom && (
                <div className={s.customRow}>
                  <a href={mail(result.q)} className="nl-btn nl-btn-sm">{t.sendJob}</a>
                  <Link href="/fix" className="nl-btn nl-btn-ghost nl-btn-sm">{t.howCustom}</Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
