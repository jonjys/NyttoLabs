'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageShell from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { TOOLS, toolCopy, toolHost } from '@/lib/tools'
import ToolFinder, { Spark } from './tool-finder'
import ToolVisual from './tool-visuals'
import s from './home.module.css'

// Cards that take two columns in the bento, so every row is full.
const WIDE = new Set(['DeployDoctor', 'Failclosed'])

const COPY = {
  en: {
    pill: `${TOOLS.length} tools live · Made in Stockholm`,
    title: ['Small tools that ', 'finish', ' the job.'],
    lead: 'Fix a failed deploy, check EU VAT numbers, label moving boxes or sell a digital file. Describe what you need done and the finder points you to the right one.',
    toolsLabel: 'The tools',
    toolsTitle: [`${TOOLS.length} tools. `, 'One job each.'],
    toolsLead: 'Choose a tool, see its price and go straight to its own site. You pay for the job you came to do, in the currency shown.',
    priceList: 'See the price list',
    live: 'Live',
    suggested: 'Suggested',
    free: 'Start:',
    buildLabel: 'How we build',
    buildTitle: ['Built to be used, ', 'not learned.'],
    rules: [
      ['One job per tool', 'Each tool does one thing, under its own name. If it needs a manual, it is too big.'],
      ['No account where none is needed', 'Check a number, label a box, buy a file: most jobs start without signing up.'],
      ['AI where it earns its place', 'AI diagnoses failed build logs in DeployDoctor and answers the finder on this page. Never where a plain rule does the job better.'],
      ['Fail closed', 'When the data looks wrong, the tool stops and says so instead of guessing.'],
    ],
    customLabel: 'Custom work',
    customTitle: ['Not on the shelf? ', 'Send the job.'],
    customLead: 'A site, a script, a Gmail fix, or something that should already work. Describe it in three lines and get a yes, a price or a no.',
    customCta: 'Send the job',
    customMore: 'How it works',
    briefTo: 'To',
    brief: [
      ['What needs fixing', 'Our booking form stopped sending email.'],
      ['What done looks like', 'Every booking lands in our inbox.'],
      ['When you need it', 'Before Friday.'],
    ],
    briefReply: ['A yes', 'A price', 'Or a no'],
    subject: 'Fix this',
    body: 'What needs fixing:\n\nWhat done looks like:\n\nWhen you need it:\n',
    partnersLabel: 'Partners',
    partnersTitle: 'You keep checkout, payment and delivery.',
    partnersBody: 'When a real buying need shows up in one of our tools, we can send that person to you. Sponsored placements are always disclosed.',
    partnersCta: 'Become a partner',
    contactLabel: 'Contact',
    contactTitle: 'One inbox for everything.',
    contactBody: 'General questions and partnerships go to the same place, and a person reads every message.',
    contactCta: 'Write to us',
  },
  sv: {
    pill: `${TOOLS.length} verktyg live · Byggt i Stockholm`,
    title: ['Små verktyg som ', 'gör klart', ' jobbet.'],
    lead: 'Fixa en trasig deploy, kontrollera EU-momsnummer, märk flyttlådor eller sälj en digital fil. Beskriv vad du behöver få gjort, så pekar sökrutan ut rätt verktyg.',
    toolsLabel: 'Verktygen',
    toolsTitle: [`${TOOLS.length} verktyg. `, 'Ett jobb var.'],
    toolsLead: 'Välj ett verktyg, se priset och gå direkt till dess egen sajt. Du betalar för jobbet du kom för, i valutan som visas.',
    priceList: 'Se prislistan',
    live: 'Live',
    suggested: 'Föreslaget',
    free: 'Börja här:',
    buildLabel: 'Så bygger vi',
    buildTitle: ['Byggt för att användas, ', 'inte läras in.'],
    rules: [
      ['Ett jobb per verktyg', 'Varje verktyg gör en sak, under eget namn. Behöver det en manual är det för stort.'],
      ['Inget konto i onödan', 'Kontrollera ett nummer, märk en låda, köp en fil: de flesta jobb börjar utan registrering.'],
      ['AI där den gör nytta', 'AI felsöker byggloggar i DeployDoctor och svarar i sökrutan på den här sidan. Aldrig där en enkel regel gör jobbet bättre.'],
      ['Hellre stopp än fel', 'När datan ser fel ut stannar verktyget och säger det, i stället för att gissa.'],
    ],
    customLabel: 'Uppdrag',
    customTitle: ['Finns det inte på hyllan? ', 'Skicka jobbet.'],
    customLead: 'En sajt, ett skript, en Gmail-fix eller något som borde fungera redan. Beskriv det på tre rader och få ett ja, ett pris eller ett nej.',
    customCta: 'Skicka uppdraget',
    customMore: 'Så funkar det',
    briefTo: 'Till',
    brief: [
      ['Vad behöver fixas', 'Bokningsformuläret har slutat skicka mejl.'],
      ['Hur det ser ut när det är klart', 'Varje bokning landar i vår inkorg.'],
      ['När du behöver det', 'Före fredag.'],
    ],
    briefReply: ['Ett ja', 'Ett pris', 'Eller ett nej'],
    subject: 'Fixa det här',
    body: 'Vad behöver fixas:\n\nHur det ser ut när det är klart:\n\nNär du behöver det:\n',
    partnersLabel: 'Partner',
    partnersTitle: 'Ni behåller kassa, betalning och leverans.',
    partnersBody: 'När ett verkligt köpbehov dyker upp i något av våra verktyg kan vi skicka personen vidare till er. Sponsrade placeringar redovisas alltid.',
    partnersCta: 'Bli partner',
    contactLabel: 'Kontakt',
    contactTitle: 'En inkorg för allt.',
    contactBody: 'Allmänna frågor och partnerskap hamnar på samma ställe, och en människa läser varje meddelande.',
    contactCta: 'Skriv till oss',
  },
}

function ToolCard({ tool, locale, t, picked }) {
  const c = toolCopy(tool, locale)
  return (
    <a id={`tool-${tool.slug}`} href={tool.url} className={`${s.card} ${WIDE.has(tool.name) ? s.wide : ''} nl-rise`} data-picked={picked}>
      <div className={s.visual} aria-hidden>
        <ToolVisual name={tool.name} locale={locale} />
      </div>
      <div className={s.cardBody}>
        <div className={s.cardTop}>
          <h3 className={s.cardName}>{tool.name}</h3>
          {picked ? (
            <span className={s.picked}>{t.suggested}</span>
          ) : (
            <span className={s.badge}>
              <span className="nl-live-dot" aria-hidden />
              {t.live}
            </span>
          )}
        </div>
        <p className={s.cardCategory}>{c.category}</p>
        <p className={s.cardJob}>{c.job}</p>
        <div className={s.cardFacts}>
          <span className={s.fact}><b>{t.free}</b> {c.free}</span>
          <span className={s.fact}>{c.price}</span>
        </div>
        <div className={s.cardFoot}>
          <span className={s.host}>{c.cta} <span className={s.cardHost}>{toolHost(tool)}</span></span>
          <span className={s.go} aria-hidden>
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  )
}

export default function HomePage() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const [picks, setPicks] = useState([])
  const mail = `mailto:${PUBLIC_HELLO_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`

  return (
    <PageShell>
      <section className={s.hero}>
        <div aria-hidden className={s.aurora}>
          <span className={s.blob} />
          <span className={s.blob} />
          <span className={s.blob} />
        </div>
        <div className={s.wrap}>
          <p className="nl-pill">
            <span className="nl-live-dot" aria-hidden />
            {t.pill}
          </p>
          <h1 className={s.title}>
            {t.title[0]}
            <em>{t.title[1]}</em>
            {t.title[2]}
          </h1>
          <p className={s.lead}>{t.lead}</p>
          <ToolFinder locale={locale} onPicks={setPicks} />
          <a href="#tools" className="nl-link mt-6 inline-flex min-h-11 items-center gap-2">
            {locale === 'sv' ? 'Se alla verktyg och priser' : 'Browse all tools and prices'} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <div className={s.strip} aria-hidden>
        <div className={s.track}>
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span key={i} className={s.stripItem}>
              <strong>{tool.name}</strong>
              <span>{toolCopy(tool, locale).category}</span>
            </span>
          ))}
        </div>
      </div>

      <section id="tools" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.sectionHead} nl-rise`}>
            <div>
              <p className="nl-label">{t.toolsLabel}</p>
              <h2 className={s.h2}>
                {t.toolsTitle[0]}
                <em>{t.toolsTitle[1]}</em>
              </h2>
            </div>
            <div>
              <p className={s.sectionLead}>{t.toolsLead}</p>
              <Link href="/products" className="nl-link mt-3 inline-flex min-h-10 items-center gap-1.5 font-medium text-ink">
                {t.priceList} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <nav className={s.toolNav} aria-label={locale === 'sv' ? 'Välj vad du vill göra' : 'Choose your task'}>
            {TOOLS.map((tool) => <a key={tool.slug} href={`#tool-${tool.slug}`}>{toolCopy(tool, locale).category}</a>)}
          </nav>
          <div className={s.bento}>
            {TOOLS.map((tool) => (
              <ToolCard key={tool.name} tool={tool} locale={locale} t={t} picked={picks.includes(tool.name)} />
            ))}
          </div>
        </div>
      </section>

      <section className={s.section} aria-labelledby="questions-title">
        <div className={s.wrap}>
          <p className="nl-label">{locale === 'sv' ? 'Bra att veta' : 'Before you start'}</p>
          <h2 id="questions-title" className={s.h2}>{locale === 'sv' ? 'Rätt verktyg. Tydliga villkor.' : 'The right tool. Clear terms.'}</h2>
          <div className={s.faq}>
            {(locale === 'sv' ? [
              ['Vad kan jag göra med NyttoLabs?', 'Kontrollera Vercel-byggen med DeployDoctor, EU-momsnummer med Vatidence och flyttlådor med StayTag. Nytto Checkout hjälper dig sälja via en länk, CSV Rescue städar CSV-filer och Failclosed bevakar lagersynk.'],
              ['Är alla verktyg gratis?', 'Nej. Flera har ett gratis första steg. Produktkorten visar vad som ingår och priset för nästa steg. CSV Rescue kostar 29 SEK per fil.'],
              ['Vilken valuta betalar jag i?', 'Priset visas i verktygets betalvaluta: SEK, USD eller EUR. Kontrollera slutbelopp och eventuell moms i respektive kassa innan du betalar.'],
              ['Behöver jag ett gemensamt konto?', 'Nej, NyttoLabs är en väg till verktygen. Varje produkt har sina egna kontokrav, betalning och villkor.']
            ] : [
              ['What can I do with NyttoLabs?', 'Check Vercel builds with DeployDoctor, EU VAT numbers with Vatidence and moving boxes with StayTag. Nytto Checkout helps you sell through a link, CSV Rescue cleans CSV files and Failclosed monitors inventory sync.'],
              ['Are all the tools free?', 'No. Several offer a free first step. Each card explains what is included and the price for the next step. CSV Rescue costs SEK 29 per file.'],
              ['Which currency will I pay in?', 'Prices use the currency charged by each tool: SEK, USD or EUR. Check the final total and any VAT in that tool’s checkout before paying.'],
              ['Do I need a shared account?', 'No. NyttoLabs helps you find the tools. Each product has its own account requirements, checkout and terms.']
            ]).map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </div>
      </section>

      <div className={s.wrap}>
        <section className={`${s.dark} nl-on-ink nl-rise`}>
          <p className="nl-label">{t.buildLabel}</p>
          <h2 className={s.h2}>
            {t.buildTitle[0]}
            <em>{t.buildTitle[1]}</em>
          </h2>
          <ol className={s.rules}>
            {t.rules.map(([title, body], i) => (
              <li key={title} className={s.rule}>
                <p className={s.ruleNo}>
                  {String(i + 1).padStart(2, '0')}
                  {i === 2 && <span className="ml-2 inline-block align-[-2px]"><Spark size={12} /></span>}
                </p>
                <h3 className={s.ruleTitle}>{title}</h3>
                <p className={s.ruleBody}>{body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.split}`}>
          <div className="nl-rise">
            <p className="nl-label">{t.customLabel}</p>
            <h2 className={s.h2}>
              {t.customTitle[0]}
              <em>{t.customTitle[1]}</em>
            </h2>
            <p className={`${s.sectionLead} mt-6 max-w-lg`}>{t.customLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={mail} className="nl-btn">
                {t.customCta} <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/fix" className="nl-btn nl-btn-ghost">{t.customMore}</Link>
            </div>
          </div>
          <div className={`${s.brief} nl-rise`} aria-hidden>
            <div className={s.briefHead}>
              <span className={s.briefTo}>
                {t.briefTo} <b>{PUBLIC_HELLO_EMAIL}</b>
              </span>
              <span className="nl-label">{t.subject}</span>
            </div>
            <dl>
              {t.brief.map(([label, value]) => (
                <div key={label} className={s.briefField}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.briefReply}>
              {t.briefReply.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.pair}`}>
          <div className={`${s.panel} nl-rise`}>
            <p className="nl-label">{t.partnersLabel}</p>
            <h2 className={s.panelTitle}>{t.partnersTitle}</h2>
            <p className={s.panelBody}>{t.partnersBody}</p>
            <div className="mt-7">
              <Link href="/partners" className="nl-btn nl-btn-ghost">
                {t.partnersCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className={`${s.panel} ${s.panelDark} nl-on-ink nl-rise`}>
            <p className="nl-label">{t.contactLabel}</p>
            <h2 className={s.panelTitle}>{t.contactTitle}</h2>
            <p className={s.panelBody}>{t.contactBody}</p>
            <a href={`mailto:${PUBLIC_HELLO_EMAIL}`} className={s.mail}>{PUBLIC_HELLO_EMAIL}</a>
            <div className="mt-7">
              <Link href="/contact" className="nl-btn nl-btn-light">
                {t.contactCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
