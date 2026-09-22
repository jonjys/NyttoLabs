import { SITE_ORIGIN, siteUrl } from '@/lib/site'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nytto Labs',
  url: SITE_ORIGIN,
  email: 'hello@nyttolabs.com',
  description: 'Swedish software company. CycleTag QR reorder labels, Vatidence EU VAT checks, and Curl-to-Buy digital file sales.',
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
