'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

const accent = ACCENT.contact

const jobs = [
  { title: 'A website', text: 'A landing page, a product page, or a rebuild of something that already exists.' },
  { title: 'A script', text: 'Gmail, Sheets, a CSV cleanup, a small automation. One job, one file, no platform.' },
  { title: 'A checkout', text: 'A payment link for a file or a product, without standing up a whole shop.' },
  { title: 'A fix', text: 'Something that used to work. A form, a deploy, a broken page, a label that does not scan.' },
]

const mail = `mailto:${PUBLIC_HELLO_EMAIL}?subject=${encodeURIComponent('Fix this')}&body=${encodeURIComponent('What needs fixing:\n\nWhat done looks like:\n\nWhen you need it:\n')}`

export default function FixView() {
  return (
    <PageShell
      accent={accent}
      wide
      eyebrow="Custom work"
      title="You want this fixed."
      lead="A site, a script, a Gmail fix, or something else that should already work. Send the job. We reply with a yes, a price, or a no."
    >
      <section className="mx-auto max-w-6xl px-5 pb-16 2xl:max-w-[1560px]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {jobs.map((job) => (
            <li
              key={job.title}
              className="rounded-2xl p-5"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}
            >
              <p className="text-base font-semibold text-white">{job.title}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{job.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={mail}
            className="inline-flex min-h-11 items-center rounded-lg px-6 text-sm font-bold"
            style={{ background: accent, color: '#03030c' }}
          >
            Send the job
          </a>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-white/60 hover:text-white"
          >
            Or open a live tool <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {PUBLIC_HELLO_EMAIL} · Built in Sweden · No retainer required for a one-off.
        </p>
      </section>
    </PageShell>
  )
}
