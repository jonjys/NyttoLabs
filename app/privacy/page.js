import PrivacyView from './privacy-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Privacy — Nytto Labs',
  description: 'How Nytto Labs handles data. Privacy-first routing; contact privacy@nyttolabs.com.',
  path: '/privacy',
})

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd name="Privacy" path="/privacy" />
      <PrivacyView />
    </>
  )
}
