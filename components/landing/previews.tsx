'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from './clipboard'
import { useExplorer } from './explorer'
import s from './landing.module.css'

// Every preview in this file is self-contained and client-side only.
// Nothing here calls a real API; all values are hardcoded demo data.

type Notify = (message: string) => void

function useCopy(notify: Notify) {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string, label: string) => {
    const ok = await copyText(text)
    notify(ok ? `Copied ${label}` : 'Copy failed — select the text manually')
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    }
  }
  return { copied, copy }
}

export function CopyButton({
  text,
  label,
  notify,
  onCopied,
}: {
  text: string
  label: string
  notify: Notify
  onCopied?: () => void
}) {
  const { copied, copy } = useCopy(notify)
  return (
    <button
      type="button"
      className={s.copyBtn}
      onClick={() => {
        void copy(text, label)
        onCopied?.()
      }}
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ------------------------------ CycleTag ------------------------------ */

// Demo data — a decorative QR-like grid (not a scannable code).
const QR_SIZE = 21
function demoQrCells(): boolean[] {
  const cells: boolean[] = []
  let seed = 7
  const finder = (x: number, y: number, ox: number, oy: number) => {
    const dx = x - ox
    const dy = y - oy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
    return edge || core
  }
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      const f = finder(x, y, 0, 0) ?? finder(x, y, QR_SIZE - 7, 0) ?? finder(x, y, 0, QR_SIZE - 7)
      if (f !== null) {
        cells.push(f)
        continue
      }
      seed = (seed * 75 + 74) % 65537
      cells.push(seed % 3 === 0)
    }
  }
  return cells
}

// Demo data — mirrors the README "Test routing" example payload.
const DEMO_LABEL = {
  product: 'Brita Maxtra Pro',
  category: 'water-filter',
  country: 'SE',
  query: 'Brita Maxtra Pro',
}

export function CycleTagPreview() {
  const cells = useMemo(demoQrCells, [])
  const [scanned, setScanned] = useState(false)
  const { complete } = useExplorer()

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={s.label}>
        <svg className={s.qr} viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} role="img" aria-label="Illustrative reorder label code">
          {cells.map((on, i) =>
            on ? <rect key={i} x={i % QR_SIZE} y={Math.floor(i / QR_SIZE)} width="1" height="1" fill="#05050b" /> : null,
          )}
        </svg>
        <div>
          <div className={s.previewLabel + ' ' + s.mono}>Reorder label</div>
          <div className={s.labelTitle}>{DEMO_LABEL.product}</div>
          <div className={s.labelMeta}>
            {DEMO_LABEL.category} · {DEMO_LABEL.country} · no app, no account
          </div>
        </div>
      </div>
      <div className={s.scanRow}>
        <button
          type="button"
          className={s.miniBtn}
          onClick={() => {
            setScanned((v) => !v)
            complete('scan-label')
          }}
          aria-pressed={scanned}
        >
          {scanned ? 'Reset' : 'Simulate a scan'}
        </button>
      </div>
      <div aria-live="polite">
        {scanned && (
          <div className={`${s.resultLine} ${s.mono}`}>
            → reorder search for <strong>{DEMO_LABEL.query}</strong>
            <br />
            action=reorder · country={DEMO_LABEL.country} · fail-closed if no approved partner
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Vatidence ----------------------------- */

type VatOutcome =
  | { state: 'valid'; name: string; consultation: string }
  | { state: 'invalid'; reason: string }
  | { state: 'format'; reason: string }
  | { state: 'unknown' }

// Demo data — hardcoded outcomes. Nothing is sent to VIES from this page.
const DEMO_VAT: Record<string, VatOutcome> = {
  DE123456789: { state: 'valid', name: 'Demo Handels GmbH', consultation: 'DEMO-7Q2K-19XF' },
  IT00000000000: { state: 'invalid', reason: 'Not active for intra-EU trade' },
}
const DEMO_VAT_KEYS = Object.keys(DEMO_VAT)
const VAT_FORMAT = /^[A-Z]{2}[0-9A-Z]{2,12}$/

function checkDemoVat(raw: string): VatOutcome {
  const v = raw.replace(/[\s.-]/g, '').toUpperCase()
  if (!VAT_FORMAT.test(v)) return { state: 'format', reason: 'Expected a country prefix + number, e.g. DE123456789' }
  return DEMO_VAT[v] ?? { state: 'unknown' }
}

export function VatidencePreview({ productUrl }: { productUrl: string }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<VatOutcome | null>(null)
  const { complete } = useExplorer()

  const check = (v: string) => {
    const outcome = checkDemoVat(v)
    setResult(outcome)
    if (outcome.state === 'valid' || outcome.state === 'invalid') complete('check-vat')
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    check(value)
  }
  const tryValue = (v: string) => {
    setValue(v)
    check(v)
  }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <label htmlFor="demo-vat" className={`${s.previewLabel} ${s.mono}`}>
        EU VAT number
      </label>
      <form className={s.vatForm} onSubmit={submit}>
        <input
          id="demo-vat"
          className={s.vatInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. DE123456789"
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
        />
        <button type="submit" className={s.miniBtn}>
          Check
        </button>
      </form>
      <div className={s.chips}>
        {DEMO_VAT_KEYS.map((k) => (
          <button key={k} type="button" className={s.chip} onClick={() => tryValue(k)}>
            {k}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {result?.state === 'valid' && (
          <div className={`${s.vatResult} ${s.vatValid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✓ VALID</span>
            <span>{result.name}</span>
            <span className={s.mono}>Consultation no. {result.consultation}</span>
          </div>
        )}
        {result?.state === 'invalid' && (
          <div className={`${s.vatResult} ${s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✕ INVALID</span>
            <span>{result.reason}</span>
          </div>
        )}
        {result?.state === 'format' && (
          <div className={`${s.vatResult} ${s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>FORMAT</span>
            <span>{result.reason}</span>
          </div>
        )}
        {result?.state === 'unknown' && (
          <div className={s.vatResult}>
            <span>
              Not in the demo set. Run a real check on{' '}
              <a href={productUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--tile-accent)' }}>
                Vatidence
              </a>
              .
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ----------------------------- Curl-to-Buy ---------------------------- */

// Demo data — illustrative flow steps based on the product description.
const CURL_FLOW = [
  { title: 'Upload a file', detail: 'report.pdf · 2.4 MB' },
  { title: 'Set a price', detail: '49 SEK · 5% fee only when it sells' },
  { title: 'Share the link', detail: 'Buyer pays by card, no account' },
  { title: 'Time-limited download', detail: 'Link expires after 24h' },
]

export function CurlToBuyPreview({ productUrl, notify }: { productUrl: string; notify: Notify }) {
  const [step, setStep] = useState(0)
  const { complete } = useExplorer()
  // Static snippet: a HEAD request to the product's existing public URL.
  const snippet = `curl -sI ${productUrl}`

  return (
    <div className={s.curlGrid}>
      <div className={s.terminal}>
        <div className={s.termBar}>
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={`${s.termTitle} ${s.mono}`}>TERMINAL</span>
          <CopyButton text={snippet} label="curl snippet" notify={notify} onCopied={() => complete('curl-flow')} />
        </div>
        <pre className={s.code}>
          <span className={s.codePrompt}>$ </span>
          {snippet}
          {'\n'}
          <span className={s.codeComment}># Demo data — illustrative, not live output</span>
          {'\n'}
          <span className={s.codeComment}># step {step + 1}/4: </span>
          <span className={s.codeOk}>{CURL_FLOW[step].title.toLowerCase()}</span>
          {'\n'}
          <span className={s.codeComment}>#   </span>
          {CURL_FLOW[step].detail}
        </pre>
      </div>
      <ol className={s.flow} aria-label="How a sale works (demo)">
        {CURL_FLOW.map((f, i) => (
          <li key={f.title}>
            <button
              type="button"
              className={`${s.flowStep} ${i === step ? s.flowStepOn : ''}`}
              onClick={() => {
                setStep(i)
                if (i === CURL_FLOW.length - 1) complete('curl-flow')
              }}
              aria-pressed={i === step}
              style={{ width: '100%' }}
            >
              <span className={`${s.flowNum} ${s.mono}`}>0{i + 1}</span>
              <span>{f.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------------------------- DeployDoctor ---------------------------- */

type ScanState = 'pass' | 'fail' | 'warn'

// Demo data — check names come from deploydoctor.nyttolabs.com; the repo and
// every result below are illustrative. Nothing is scanned from this page.
const DEMO_REPO = 'github.com/example/shop'
const DEMO_SCAN: { check: string; state: ScanState; note: string }[] = [
  { check: 'Next.js entrypoint', state: 'pass', note: 'app/ router detected' },
  { check: 'Broken imports', state: 'fail', note: 'case mismatch: ./Components/Header' },
  { check: 'Vercel-incompatible server code', state: 'pass', note: 'no long-running server found' },
  { check: 'Environment variables', state: 'warn', note: 'DATABASE_URL used but not documented' },
]

const SCAN_ICON: Record<ScanState, string> = { pass: '✓', fail: '✕', warn: '!' }

export function DeployDoctorPreview() {
  const [scanned, setScanned] = useState(false)
  const { complete } = useExplorer()
  const iconClass: Record<ScanState, string> = { pass: s.scanPass, fail: s.scanFail, warn: s.scanWarn }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={`${s.previewLabel} ${s.mono}`}>Public GitHub repository</div>
      <div className={s.vatForm}>
        <span className={`${s.scanRepo} ${s.mono}`}>{DEMO_REPO}</span>
        <button
          type="button"
          className={s.miniBtn}
          onClick={() => {
            setScanned((v) => !v)
            complete('deploy-scan')
          }}
          aria-pressed={scanned}
        >
          {scanned ? 'Reset' : 'Run demo scan'}
        </button>
      </div>
      <div aria-live="polite">
        {scanned && (
          <ul className={s.scanList}>
            {DEMO_SCAN.map((row) => (
              <li key={row.check} className={s.scanItem}>
                <span className={`${iconClass[row.state]} ${s.mono}`} aria-hidden="true">
                  {SCAN_ICON[row.state]}
                </span>
                <span>
                  <strong>{row.check}</strong> <span className={s.srOnly}>({row.state})</span>
                  <br />
                  <span className={s.mono}>{row.note}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ LiveProof ----------------------------- */

// Demo data — an illustrative attestation trail. Each record carries the hash
// of the previous one; nothing here is fetched or signed for real.
const DEMO_TRAIL = [
  { at: '09:00:00Z', status: 200, ms: 84, hash: '7f3a91c2', prev: '00000000' },
  { at: '09:01:00Z', status: 200, ms: 91, hash: 'c04be817', prev: '7f3a91c2' },
  { at: '09:02:00Z', status: 200, ms: 88, hash: '5d2e6f40', prev: 'c04be817' },
  { at: '09:03:00Z', status: 200, ms: 79, hash: 'a91f03bd', prev: '5d2e6f40' },
]

export function LiveProofPreview() {
  const [tampered, setTampered] = useState(false)
  const [verdict, setVerdict] = useState<null | { ok: boolean; text: string }>(null)
  const { complete } = useExplorer()
  const rows = tampered ? DEMO_TRAIL.map((r, i) => (i === 2 ? { ...r, status: 503 } : r)) : DEMO_TRAIL

  const verify = () => {
    setVerdict(
      tampered
        ? { ok: false, text: 'Chain broken at record 3 — its content no longer matches the signed hash.' }
        : { ok: true, text: `Chain intact · ${rows.length} records · signatures valid` },
    )
    complete('liveproof-verify')
  }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={`${s.previewLabel} ${s.mono}`}>Signed uptime trail</div>
      <ol className={`${s.trail} ${s.mono}`}>
        {rows.map((r, i) => (
          <li key={r.at} className={`${s.trailRow} ${tampered && i === 2 ? s.trailBad : ''}`}>
            <span>{r.at}</span>
            <span className={r.status === 200 ? s.scanPass : s.scanFail}>{r.status}</span>
            <span>{r.ms}ms</span>
            <span className={s.trailHash}>#{r.hash}</span>
          </li>
        ))}
      </ol>
      <div className={s.scanRow}>
        <button type="button" className={s.miniBtn} onClick={verify}>
          Verify chain
        </button>
        <button
          type="button"
          className={s.chip}
          aria-pressed={tampered}
          onClick={() => {
            setTampered((v) => !v)
            setVerdict(null)
          }}
        >
          {tampered ? 'Restore record 3' : 'Tamper with record 3'}
        </button>
      </div>
      <div aria-live="polite">
        {verdict && (
          <div className={`${s.vatResult} ${verdict.ok ? s.vatValid : s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>{verdict.ok ? '✓ VERIFIED' : '✕ TAMPERED'}</span>
            <span>{verdict.text}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ----------------------------- Failclosed ----------------------------- */

// Demo data — three illustrative signals behind one access check. Any signal
// that is not a clear "yes" makes the decision DENIED.
type Signal = 'ok' | 'uncertain'
const SIGNALS = [
  { id: 'identity', label: 'Identity verified' },
  { id: 'device', label: 'Device posture' },
  { id: 'policy', label: 'Policy source reachable' },
] as const
type SignalId = (typeof SIGNALS)[number]['id']

export function FailclosedPreview() {
  const [state, setState] = useState<Record<SignalId, Signal>>({ identity: 'ok', device: 'ok', policy: 'ok' })
  const { complete } = useExplorer()
  const uncertain = SIGNALS.filter((sig) => state[sig.id] === 'uncertain')
  const allowed = uncertain.length === 0

  const toggle = (id: SignalId) => {
    setState((prev) => ({ ...prev, [id]: prev[id] === 'ok' ? 'uncertain' : 'ok' }))
    complete('failclosed-deny')
  }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={`${s.previewLabel} ${s.mono}`}>Access check · tap a signal</div>
      <ul className={s.scanList}>
        {SIGNALS.map((sig) => {
          const ok = state[sig.id] === 'ok'
          return (
            <li key={sig.id}>
              <button
                type="button"
                className={s.signalBtn}
                onClick={() => toggle(sig.id)}
                aria-pressed={!ok}
                aria-label={`${sig.label}: ${ok ? 'confirmed' : 'uncertain'}. Toggle.`}
              >
                <span className={`${ok ? s.scanPass : s.scanWarn} ${s.mono}`} aria-hidden="true">
                  {ok ? '✓' : '?'}
                </span>
                <span>{sig.label}</span>
                <span className={`${s.mono} ${s.signalState}`}>{ok ? 'confirmed' : 'uncertain'}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div aria-live="polite" className={`${s.vatResult} ${allowed ? s.vatValid : s.vatInvalid}`}>
        <span className={`${s.vatBadge} ${s.mono}`}>{allowed ? '✓ ALLOW' : '✕ DENIED'}</span>
        <span>
          {allowed
            ? 'Every signal is a clear yes.'
            : `${uncertain.map((u) => u.label).join(', ')} uncertain → default deny.`}
        </span>
      </div>
    </div>
  )
}
