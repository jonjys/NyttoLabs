import Link from 'next/link'
import PageShell, { ACCENT } from '@/components/site/page-shell'

export default function NotFound() {
  return (
    <PageShell
      accent={ACCENT.home}
      eyebrow="404"
      title="This page is not here."
      lead="The address may have changed, or it never existed. The public site lives at Home, Products, Partners, Contact, Privacy, and Terms."
    >
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-lg px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: ACCENT.home, color: '#03030c' }}
          >
            Back to the lobby
          </Link>
          <Link
            href="/products"
            className="rounded-lg px-6 py-3 text-sm font-medium transition-colors duration-200 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.6)' }}
          >
            Products
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
