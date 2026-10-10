import FixView from './fix-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Fix this — Nytto Labs',
  description: 'Need a site, a script, or a Gmail fix? Nytto Labs builds and repairs small jobs. Email hello@nyttolabs.com.',
  path: '/fix',
})

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd name="Fix this" path="/fix" />
      <FixView />
    </>
  )
}
