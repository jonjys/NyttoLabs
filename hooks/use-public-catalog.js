'use client'

import { useEffect, useState } from 'react'
import { defaultPublicProducts, DEFAULT_PUBLIC_SETTINGS } from '@/lib/relay/catalog'

export function usePublicProducts() {
  const [products, setProducts] = useState(defaultPublicProducts)
  useEffect(() => {
    fetch('/api/public/products')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.products) && d.products.length) setProducts(d.products)
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
        if (d && !d.error) setSettings({ ...DEFAULT_PUBLIC_SETTINGS, ...d })
      })
      .catch(() => {})
  }, [])
  return settings
}
