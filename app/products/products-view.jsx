'use client'

import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import ProductCard from '@/components/site/product-card'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'

const STATUS_LABELS_SV = {
  live: { title: 'Live', desc: 'Tillgängligt idag.' },
  'public-beta': { title: 'Publik beta', desc: 'Användbart, formas fortfarande.' },
  'private-beta': { title: 'Privat beta', desc: 'Endast på inbjudan — ingen publik beta.' },
  building: { title: 'Under uppbyggnad', desc: 'Under aktiv utveckling — inte live.' },
}

export default function ProductsView() {
  const products = usePublicProducts()
  const grouped = groupPublicProductsByStatus(products)
  const hasAny = grouped.length > 0

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-6">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Produkter</h1>
        <p className="mt-3 max-w-2xl text-[#4a4a3e]">
          Nytto Labs är bolaget. De här produkterna är det vi bygger — var och en med eget namn, egen sajt och eget jobb.
        </p>
      </section>
      {grouped.map((g) => {
        if (g.list.length === 0) return null
        const label = STATUS_LABELS_SV[g.key] || { title: g.title, desc: g.desc }
        return (
          <section key={g.key} className="mx-auto max-w-6xl px-5 py-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{label.title}</h2>
              <p className="text-sm text-[#8a8778]">{label.desc}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.list.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </section>
        )
      })}
      {!hasAny && (
        <section className="mx-auto max-w-6xl px-5 py-6">
          <div className="rounded-xl border border-dashed border-black/15 bg-white px-5 py-10 text-sm text-[#6a6858]">
            Inga produkter att visa just nu. Uppdatera sidan eller kontakta oss via kontaktsidan.
          </div>
        </section>
      )}
      <SiteFooter />
    </div>
  )
}
