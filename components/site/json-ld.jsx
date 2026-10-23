import { SITE_ORIGIN, siteUrl } from '@/lib/site'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nytto Labs',
  url: SITE_ORIGIN,
  email: 'hello@nyttolabs.com',
  description: 'Swedish software company making small tools that finish the job: DeployDoctor Vercel checks, Vatidence EU VAT checks, StayTag QR moving box labels, Nytto Checkout one-link sales, CSV Rescue file cleanup, Failclosed inventory sync, AIklart and the Expanse product map.',
  founder: { '@type': 'Person', name: 'Fredrik Kornelind' },
  address: { '@type': 'PostalAddress', addressCountry: 'SE' },
}

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  )
}

export function BreadcrumbJsonLd({ name, path }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name, item: siteUrl(path) },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
