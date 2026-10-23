import { SITE_ORIGIN, siteUrl } from '@/lib/site'
import { TOOLS } from '@/lib/tools'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nytto Labs',
  url: SITE_ORIGIN,
  email: 'hello@nyttolabs.com',
  description: 'Swedish software company making small tools that finish the job: DeployDoctor Vercel checks, Vatidence EU VAT checks, StayTag QR moving box labels, Nytto Checkout one-link sales, CSV Rescue file cleanup and Failclosed inventory sync.',
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

// Describes the visible directory, not unverified prices, reviews or ratings.
export function ToolDirectoryJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nytto Labs tools',
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: { '@type': 'WebApplication', name: tool.name, url: tool.url, description: tool.en.job, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web browser' },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
