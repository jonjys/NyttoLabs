'use client'

import { useEffect, useState } from 'react'

const STORAGE = 'nytto-locale-v2'

export function useLocale() {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE)
      if (stored === 'sv' || stored === 'en') {
        setLocaleState(stored)
        document.documentElement.lang = stored
      } else {
        document.documentElement.lang = 'en'
      }
    } catch {
      document.documentElement.lang = 'en'
    }
    function onChange(event) {
      const next = event.detail
      if (next === 'sv' || next === 'en') setLocaleState(next)
    }
    window.addEventListener('nytto-locale', onChange)
    return () => window.removeEventListener('nytto-locale', onChange)
  }, [])

  function setLocale(next) {
    if (next !== 'sv' && next !== 'en') return
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE, next)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next
    window.dispatchEvent(new CustomEvent('nytto-locale', { detail: next }))
  }

  return [locale, setLocale]
}
