'use client'

import PageShell, { ACCENT } from '@/components/site/page-shell'
import { FTAX_LINE, OPERATOR_LINE } from '@/lib/site'
import { PRIVACY_EMAIL } from '@/lib/privacy'
import { usePublicSettings } from '@/hooks/use-public-catalog'
import { useLocale } from '@/hooks/use-locale'

const body = { color: 'rgba(255,255,255,0.5)' }
const h2 = 'mt-9 text-lg font-bold text-white'

const COPY = {
  en: {
    eyebrow: 'Privacy',
    title: 'Privacy-first by design.',
    lead: `${OPERATOR_LINE} ${FTAX_LINE}`,
    intro: [
      'Nytto Labs is built to be privacy-first. Our routing infrastructure is designed to operate on the minimum anonymous commercial context required to route a request — nothing more.',
      'This policy covers the nyttolabs.com website, its routing infrastructure, and partner inquiries. Each product handles its own data under its own privacy policy — for example Vatidence processes the VAT numbers you submit, GateZero stores encrypted keys, and Nytto Checkout handles uploaded files and payments. See the individual product for the details that apply when you use it.',
    ],
    notStoredTitle: 'What the routing layer does not store',
    notStored: [
      'Names or email addresses of anonymous product users',
      'Full IP addresses or full user-agent strings',
      'Complete QR payloads from StayTag labels',
      'Personal document content, payment records, or VAT-number lists',
      'API keys or secrets belonging to product users',
    ],
    storedTitle: 'What we do store',
    stored:
      'Only anonymous commercial event data needed for routing and attribution: the application slug, an action, a product category / brand / search phrase, a market, an opaque click identifier, and which partner (if any) was selected.',
    inquiriesTitle: 'Partner inquiries and contact messages',
    inquiries:
      'When you submit the Partners or Contact form, we store the details you enter — for example company, name, email, and your message — solely to evaluate and respond to it. We keep it only as long as needed for that conversation and any resulting partnership, and you can ask us to delete it at any time by emailing',
    aiTitle: 'AI-assisted replies',
    ai:
      'To answer faster, we may have an AI model (Claude, from Anthropic) sort a message you sent us and draft a reply. This only happens when we choose to, never automatically when you submit the form, and a person reads and edits every reply before it is sent. Anthropic processes the message on our behalf and does not use it to train its models.',
    disclosureTitle: 'Affiliate disclosure',
    contactTitle: 'Contact',
    contact: 'Questions about privacy? Email',
  },
  sv: {
    eyebrow: 'Integritet',
    title: 'Integritet från grunden.',
    lead: 'Nytto Labs drivs av Fredrik Kornelind (Sverige). Godkänd för F‑skatt.',
    intro: [
      'Nytto Labs är byggt med integriteten först. Vår routinginfrastruktur arbetar med minsta möjliga anonyma kommersiella sammanhang som krävs för att vidarebefordra en förfrågan — inget mer.',
      'Den här policyn gäller webbplatsen nyttolabs.com, dess routinginfrastruktur och partnerförfrågningar. Varje produkt hanterar sin egen data enligt sin egen integritetspolicy — till exempel behandlar Vatidence de momsnummer du skickar in, GateZero lagrar krypterade nycklar och Nytto Checkout hanterar uppladdade filer och betalningar. Se respektive produkt för vad som gäller när du använder den. Vid skillnader mellan språkversionerna gäller den engelska.',
    ],
    notStoredTitle: 'Det routinglagret inte sparar',
    notStored: [
      'Namn eller e-postadresser till anonyma produktanvändare',
      'Fullständiga IP-adresser eller fullständiga user-agent-strängar',
      'Fullständigt QR-innehåll från StayTag-etiketter',
      'Innehåll i personliga dokument, betalningsuppgifter eller listor med momsnummer',
      'API-nycklar eller hemligheter som tillhör produktanvändare',
    ],
    storedTitle: 'Det vi sparar',
    stored:
      'Endast anonym kommersiell händelsedata som behövs för routing och attribution: applikationens namn, en handling, en produktkategori / ett märke / en sökfras, en marknad, en anonym klickidentifierare och vilken partner (om någon) som valdes.',
    inquiriesTitle: 'Partnerförfrågningar och kontaktmeddelanden',
    inquiries:
      'När du skickar partner- eller kontaktformuläret sparar vi uppgifterna du fyller i — till exempel företag, namn, e-post och ditt meddelande — enbart för att kunna bedöma och besvara det. Vi sparar dem bara så länge som behövs för den konversationen och ett eventuellt samarbete, och du kan när som helst be oss radera dem genom att mejla',
    aiTitle: 'AI-stöd för svar',
    ai:
      'För att svara snabbare kan vi låta en AI-modell (Claude, från Anthropic) sortera ett meddelande du skickat oss och skriva ett utkast till svar. Det sker bara när vi själva väljer det, aldrig automatiskt när du skickar formuläret, och en människa läser och redigerar varje svar innan det skickas. Anthropic behandlar meddelandet för vår räkning och använder det inte för att träna sina modeller.',
    disclosureTitle: 'Om partnerlänkar',
    disclosure:
      'Vissa länkar i Nytto Labs produkter är partnerlänkar. Nytto Labs kan få ersättning när du väljer en partner, utan extra kostnad för dig om inget annat anges tydligt.',
    contactTitle: 'Kontakt',
    contact: 'Frågor om integritet? Mejla',
  },
}

export default function PrivacyView() {
  const s = usePublicSettings()
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  return (
    <PageShell accent={ACCENT.home} eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <article className="mx-auto max-w-3xl px-5 pb-8 pt-4">
        <div className="space-y-5 text-[15px] leading-relaxed" style={body}>
          {t.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}

          <h2 className={h2}>{t.notStoredTitle}</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {t.notStored.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={h2}>{t.storedTitle}</h2>
          <p>{t.stored}</p>

          <h2 className={h2}>{t.inquiriesTitle}</h2>
          <p>
            {t.inquiries} {PRIVACY_EMAIL}.
          </p>

          <h2 className={h2}>{t.aiTitle}</h2>
          <p>{t.ai}</p>

          <h2 className={h2}>{t.disclosureTitle}</h2>
          <p>{locale === 'sv' ? t.disclosure : s.affiliateDisclosure}</p>

          <h2 className={h2}>{t.contactTitle}</h2>
          <p>
            {t.contact}{' '}
            <a
              className="font-medium transition-opacity hover:opacity-80"
              style={{ color: ACCENT.home }}
              href={`mailto:${PRIVACY_EMAIL}`}
            >
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
        </div>
      </article>
    </PageShell>
  )
}
