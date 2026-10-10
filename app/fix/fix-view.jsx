'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

const accent = ACCENT.contact

const COPY = {
  en: {
    eyebrow: 'Custom work',
    title: 'You want this fixed.',
    lead: 'A site, a script, a Gmail fix, or something else that should already work. Send the job. We reply with a yes, a price, or a no.',
    jobs: [
      { title: 'A website', text: 'A landing page, a product page, or a rebuild of something that already exists.' },
      { title: 'A script', text: 'Gmail, Sheets, a CSV cleanup, a small automation. One job, one file, no platform.' },
      { title: 'A checkout', text: 'A payment link for a file or a product, without standing up a whole shop.' },
      { title: 'A fix', text: 'Something that used to work. A form, a deploy, a broken page, a label that does not scan.' },
    ],
    send: 'Send the job',
    tools: 'Or open a live tool',
    note: 'Built in Sweden · No retainer required for a one-off.',
    subject: 'Fix this',
    body: 'What needs fixing:\n\nWhat done looks like:\n\nWhen you need it:\n',
  },
  sv: {
    eyebrow: 'Uppdrag',
    title: 'Du vill få det här fixat.',
    lead: 'En sajt, ett skript, en Gmail-fix eller något annat som borde fungera redan. Skicka uppdraget. Vi svarar med ett ja, ett pris eller ett nej.',
    jobs: [
      { title: 'En webbplats', text: 'En landningssida, en produktsida eller en ombyggnad av något som redan finns.' },
      { title: 'Ett skript', text: 'Gmail, Sheets, en CSV-städning, en liten automatisering. Ett jobb, en fil, ingen plattform.' },
      { title: 'En kassa', text: 'En betallänk för en fil eller en produkt, utan att bygga en hel butik.' },
      { title: 'En lagning', text: 'Något som brukade fungera. Ett formulär, en deploy, en trasig sida, en etikett som inte går att skanna.' },
    ],
    send: 'Skicka uppdraget',
    tools: 'Eller öppna ett färdigt verktyg',
    note: 'Byggt i Sverige · Inget löpande avtal krävs för ett engångsjobb.',
    subject: 'Fixa det här',
    body: 'Vad behöver fixas:\n\nHur det ser ut när det är klart:\n\nNär du behöver det:\n',
  },
}

const mailFor = (t) =>
  `mailto:${PUBLIC_HELLO_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`

export default function FixView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const jobs = t.jobs
  const mail = mailFor(t)
  return (
    <PageShell
      accent={accent}
      wide
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
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
            {t.send}
          </a>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-white/60 hover:text-white"
          >
            {t.tools} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {PUBLIC_HELLO_EMAIL} · {t.note}
        </p>
      </section>
    </PageShell>
  )
}
