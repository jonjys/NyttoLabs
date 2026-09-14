'use client'

import PageShell, { ACCENT, Eyebrow } from '@/components/site/page-shell'
import ProductCard from '@/components/site/product-card'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'

const STATUS_LABELS = {
  live: { title: 'Live', desc: 'Available today.' },
  'public-beta': { title: 'Public beta', desc: 'Usable, still taking shape.' },
  'private-beta': { title: 'Private beta', desc: 'Invite only — no public beta.' },
  building: { title: 'Building', desc: 'Under active development — not live.' },
}

export default function ProductsView() {
  const products = usePublicProducts()
  const grouped = groupPublicProductsByStatus(products)
  const hasAny = grouped.some((g) => g.list.length > 0)

  return (
    <PageShell
      accent={ACCENT.products}
      wide
      eyebrow="Products"
      title="Everything we build, under its own name."
      lead="Nytto Labs is the company. These are the products — each with its own name, its own site, and its own job to do."
    >
      {grouped.map((g) => {
        if (g.list.length === 0) return null
        const label = STATUS_LABELS[g.key] || { title: g.title, desc: g.desc }
        return (
          <section key={g.key} className="mx-auto max-w-6xl px-5 py-8 2xl:max-w-[1560px]">
            <div className="mb-6">
              <Eyebrow accent={ACCENT.products}>{label.title}</Eyebrow>
              <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.34)' }}>
                {label.desc}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )
      })}

      {!hasAny && (
        <section className="mx-auto max-w-6xl px-5 py-8 2xl:max-w-[1560px]">
          <div
            className="rounded-2xl px-6 py-14 text-center text-sm backdrop-blur-sm"
            style={{
              border: '1px dashed rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            No products to show right now. Refresh the page, or reach us from the contact page.
          </div>
        </section>
      )}
    </PageShell>
  )
}
