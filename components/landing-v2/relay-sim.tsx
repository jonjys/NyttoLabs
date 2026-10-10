'use client'

import { useEffect, useRef, useState } from 'react'
import s from './landing-v2.module.css'

type Line = { tag: string; color: string; text: string }
const PARTNERS: Record<string, string> = { SE: 'prisjakt.nu', DE: 'idealo.de', NL: 'tweakers.net' }
const ACTIONS = ['scan', 'report']
const COUNTRIES = ['SE', 'DE', 'NL', 'US']

/** Browser-only demo of POST /api/resolve. Illustrative data; nothing is requested. */
export default function RelaySim({ apps }: { apps: { name: string; slug: string }[] }) {
  const [app, setApp] = useState(apps[0]?.slug ?? '')
  const [action, setAction] = useState('scan')
  const [country, setCountry] = useState('SE')
  const [log, setLog] = useState<Line[]>([])
  const [busy, setBusy] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { if (!app && apps[0]) setApp(apps[0].slug) }, [apps, app])

  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; setLog([]); setBusy(false) }

  const resolve = () => {
    if (busy) return
    const ok = country !== 'US' && !(app === 'viesproof' && action === 'scan')
    const cid = 'c_' + Math.random().toString(16).slice(2, 6)
    const head: Line = { tag: 'MATCH', color: '#00f5ff', text: `${app} · ${action} · ${country} → allowlist lookup` }
    const lines: Line[] = ok
      ? [head,
         { tag: 'DEST', color: '#00f5ff', text: `https://${PARTNERS[country]}/search?q={query}` },
         { tag: '200 OK', color: '#00ff9d', text: `{ "click_id": "${cid}…", "fallback": false }` },
         { tag: 'GO', color: '#00ff9d', text: `/go/${cid} → signed webhook on conversion` }]
      : [head,
         { tag: 'MISS', color: '#ff8a1e', text: 'no approved destination for this intent' },
         { tag: '204', color: '#ff2bd1', text: '{ "destination": null, "fallback": false }' },
         { tag: 'STOP', color: '#ff2bd1', text: 'fail-closed · visitor sent nowhere' }]
    reset()
    setBusy(true)
    lines.forEach((l, i) => timers.current.push(window.setTimeout(() => {
      setLog((prev) => prev.concat([l]))
      if (i === lines.length - 1) setBusy(false)
    }, 350 + i * 420)))
  }

  const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
    <label className={`${s.selectLabel} ${s.mono}`}>{label}
      <select className={s.select} value={value} onChange={(e) => { onChange(e.target.value); reset() }}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  )

  return (
    <>
      <div>
        <div className={`${s.eyebrow} ${s.mono}`}>02 · UNDERNEATH · NYTTO RELAY</div>
        <h2 className={s.h2Small}>Intent in.<br /><i>Useful next action out.</i></h2>
        <p className={s.relayLede}>
          Relay connects a product action to a relevant partner — a reorder scan to a replacement search, for example.
          It uses approved destinations and records referrals. If no approved match exists, it sends visitors nowhere. Try the simulation.
        </p>
        <div className={s.selects}>
          <Select label="APP" value={app} onChange={setApp} options={apps.map((a) => ({ v: a.slug, l: a.name }))} />
          <Select label="ACTION" value={action} onChange={setAction} options={ACTIONS.map((a) => ({ v: a, l: a }))} />
          <Select label="COUNTRY" value={country} onChange={setCountry} options={COUNTRIES.map((a) => ({ v: a, l: a }))} />
        </div>
        <button type="button" onClick={resolve} className={`${s.btnPrimary} ${s.resolveBtn}`}>
          {busy ? 'Resolving…' : 'Resolve intent'} <span className={s.mono}>→</span>
        </button>
      </div>
      <div className={s.console}>
        <div className={s.scan} aria-hidden="true" />
        <div className={`${s.consoleHead} ${s.mono}`}><span className={s.consoleDot} />RELAY · SIMULATION · DEMO DATA</div>
        <div className={`${s.consoleBody} ${s.mono}`} role="log" aria-live="polite">
          <div className={s.dim}>POST /api/resolve</div>
          <div className={s.payload}>{'{ "app": '}<b>"{app}"</b>{', "action": '}<b>"{action}"</b>{', "country": '}<b>"{country}"</b>{' }'}</div>
          {log.map((l, i) => (
            <div key={i} className={s.logLine}><b style={{ color: l.color }}>{l.tag}</b><span>{l.text}</span></div>
          ))}
          {log.length === 0 && !busy && <div className={s.dimmer}>1. Pick an app, action and country — then resolve.</div>}
          <div className={s.dimmer}>$ <span className={s.cursor}>▌</span></div>
        </div>
      </div>
    </>
  )
}
