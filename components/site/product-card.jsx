'use client'

import * as Icons from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

const statusStyle = {
  live: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  building: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  ventures: 'bg-stone-200 text-stone-700 ring-stone-500/20',
}
const statusLabel = { live: 'Live', building: 'Building', ventures: 'Ventures' }

export default function ProductCard({ product }) {
  const Icon = Icons[product.icon] || Icons.Box
  const st = product.status
  return (
    <div className="group flex flex-col rounded-xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1b1b16] text-emerald-400">
          <Icon className="h-5 w-5" />
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle[st] || statusStyle.ventures}`}>
          {statusLabel[st] || st}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1b1b16]">{product.name}</h3>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-[#8a8778]">{product.category}</div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4a4a3e]">{product.description}</p>
      {product.actions?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.actions.map((a) => (
            <span key={a} className="rounded-md bg-[#f0efe8] px-2 py-0.5 text-[11px] font-medium text-[#6a6858]">{a}</span>
          ))}
        </div>
      )}
      <a href={product.url} target="_blank" rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:text-emerald-900">
        Visit {product.name} <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}
