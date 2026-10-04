import HomeView from './home-view'
import { pageMetadata, SITE_ORIGIN } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — Focused software. Invisible infrastructure.',
  description:
    'Nytto Labs builds focused digital products and quietly connects people to the right next product, service, or action.',
  path: '/',
})

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nytto Labs',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/icon.svg`,
  email: 'hello@nyttolabs.com',
  description: 'Swedish software company building focused digital products and a shared partner-routing layer.',
  sameAs: ['https://cycletag.eu/', 'https://vatidence.nyttolabs.com/', 'https://pay.nyttolabs.com/'],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <HomeView />
    </>
  )
}
