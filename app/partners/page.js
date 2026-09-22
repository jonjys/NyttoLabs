import PartnersView from './partners-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Partners — Nytto Labs',
  description: 'Partner with Nytto Labs. You keep checkout and fulfilment; we connect high-intent users to a relevant next action.',
  path: '/partners',
})

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd name="Partners" path="/partners" />
      <PartnersView />
    </>
  )
}
