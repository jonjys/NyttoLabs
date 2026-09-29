'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

// "Explorer" — a small discovery game. Each mission is completed by actually
// using a part of the page (a demo, the playground, the palette…). Progress is a
// per-visitor convenience kept in localStorage; nothing is sent anywhere.

export interface Mission {
  id: MissionId
  label: string
  hint: string
  href: `#${string}`
}

export type MissionId =
  | 'scan-label'
  | 'check-vat'
  | 'curl-flow'
  | 'deploy-scan'
  | 'liveproof-verify'
  | 'failclosed-deny'
  | 'route-intent'
  | 'palette'
  | 'shortcuts'

export const MISSIONS: Mission[] = [
  { id: 'route-intent', label: 'Route an intent through Relay', hint: 'Run the Relay playground', href: '#relay' },
  { id: 'deploy-scan', label: 'Run a DeployDoctor scan', hint: 'Run the demo scan', href: '#deploydoctor' },
  { id: 'scan-label', label: 'Scan a CycleTag label', hint: 'Simulate a scan on the CycleTag tile', href: '#cycletag' },
  { id: 'check-vat', label: 'Verify a VAT number', hint: 'Check a number in the Vatidence demo', href: '#vatidence' },
  { id: 'curl-flow', label: 'Walk a Curl-to-Buy sale', hint: 'Step through the sale or copy the snippet', href: '#curl-to-buy' },
  { id: 'liveproof-verify', label: 'Verify a LiveProof trail', hint: 'Verify the chain, then tamper with it', href: '#liveproof' },
  { id: 'failclosed-deny', label: 'Get denied by Failclosed', hint: 'Make one signal uncertain', href: '#failclosed' },
  { id: 'palette', label: 'Open the command palette', hint: 'Press ⌘K / Ctrl K', href: '#top' },
  { id: 'shortcuts', label: 'Find the keyboard map', hint: 'Press ?', href: '#top' },
]

const STORAGE_KEY = 'nl-explorer-v1'

function readDone(): MissionId[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const valid = new Set(MISSIONS.map((m) => m.id))
    return Array.isArray(parsed) ? parsed.filter((x): x is MissionId => typeof x === 'string' && valid.has(x as MissionId)) : []
  } catch {
    return []
  }
}

function writeDone(ids: MissionId[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // storage unavailable — progress lasts for this page view only
  }
}

interface ExplorerValue {
  done: ReadonlySet<MissionId>
  complete: (id: MissionId) => void
  reset: () => void
  /** Last mission completed in this page view, for the celebration toast. */
  latest: { id: MissionId; at: number } | null
}

const ExplorerContext = createContext<ExplorerValue>({
  done: new Set(),
  complete: () => undefined,
  reset: () => undefined,
  latest: null,
})

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<MissionId[]>([])
  const [latest, setLatest] = useState<ExplorerValue['latest']>(null)
  const loaded = useRef(false)

  useEffect(() => {
    setDone(readDone())
    loaded.current = true
  }, [])

  const doneRef = useRef<MissionId[]>([])
  doneRef.current = done

  const complete = useCallback((id: MissionId) => {
    if (doneRef.current.includes(id)) return
    const next = [...doneRef.current, id]
    doneRef.current = next
    setDone(next)
    if (loaded.current) writeDone(next)
    setLatest({ id, at: Date.now() })
  }, [])

  const reset = useCallback(() => {
    setDone([])
    setLatest(null)
    writeDone([])
  }, [])

  const value = useMemo<ExplorerValue>(() => ({ done: new Set(done), complete, reset, latest }), [done, complete, reset, latest])
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

export function useExplorer(): ExplorerValue {
  return useContext(ExplorerContext)
}
