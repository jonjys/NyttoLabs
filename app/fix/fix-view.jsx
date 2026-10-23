'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageShell from '@/components/site/page-shell'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

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
    steps: [
      ['Send the job', 'Three lines: what needs fixing, what done looks like, when you need it.'],
      ['Get an answer', 'A yes with a fixed price, or a no with a reason.'],
      ['It gets done', 'The price you said yes to is the price you pay.'],
    ],
    stepsLabel: 'How it works',
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
    steps: [
      ['Skicka jobbet', 'Tre rader: vad som behöver fixas, hur det ser ut när det är klart och när du behöver det.'],
      ['Få ett svar', 'Ett ja med fast pris, eller ett nej med en anledning.'],
      ['Det blir gjort', 'Priset du sa ja till är priset du betalar.'],
    ],
    stepsLabel: 'Så funkar det',
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
      wide
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      aside={
        <a href={mail} className="nl-btn">
          {t.send} <ArrowRight className="h-4 w-4" />
        </a>
      }
    >
      <section className="mx-auto max-w-6xl px-5 pt-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job, i) => (
            <li key={job.title} className="nl-card p-6">
              <p className="font-mono text-[11px] text-faded">{String(i + 1).padStart(2, '0')}</p>
              <p className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{job.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{job.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <p className="nl-label">{t.stepsLabel}</p>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {t.steps.map(([title, text], i) => (
            <li key={title} className="border-t border-ink pt-5">
              <p className="font-serif text-[44px] italic leading-none text-iris">{i + 1}</p>
              <p className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap items-center gap-3">
          <a href={mail} className="nl-btn">
            {t.send} <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/products" className="nl-btn nl-btn-ghost">
            {t.tools} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 text-sm text-faded">
          {PUBLIC_HELLO_EMAIL} · {t.note}
        </p>
      </section>
    </PageShell>
  )
}
