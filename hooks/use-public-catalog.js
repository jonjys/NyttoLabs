'use client'

import { useEffect, useState } from 'react'
import { defaultPublicProducts, DEFAULT_PUBLIC_SETTINGS, mergePublicCatalog } from '@/lib/relay/catalog'

export function usePublicProducts() {
  const [products, setProducts] = useState(defaultPublicProducts)
  useEffect(() => {
    fetch('/api/public/products')
      .then((r) => r.json())
      .then((d) => {
        const next = mergePublicCatalog(d?.products)
        if (next.length) setProducts(next)
      })
      .catch(() => {})
  }, [])
  return products
}

export function usePublicSettings() {
  const [settings, setSettings] = useState(DEFAULT_PUBLIC_SETTINGS)
  useEffect(() => {
    fetch('/api/public/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          const hidden = new Set(['legalName', 'orgNumber', 'vatNumber', 'registeredAddress'])
          const safe = Object.fromEntries(Object.entries(d).filter(([key]) => !hidden.has(key)))
          setSettings({
            ...DEFAULT_PUBLIC_SETTINGS,
            ...safe,
            helloEmail: DEFAULT_PUBLIC_SETTINGS.helloEmail,
            supportEmail: DEFAULT_PUBLIC_SETTINGS.supportEmail,
            partnerEmail: DEFAULT_PUBLIC_SETTINGS.partnerEmail,
            privacyEmail: DEFAULT_PUBLIC_SETTINGS.privacyEmail,
            billingEmail: DEFAULT_PUBLIC_SETTINGS.billingEmail,
          })
        }
      })
      .catch(() => {})
  }, [])
  return settings
}
