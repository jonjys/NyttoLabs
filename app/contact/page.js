import ContactView from './contact-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Contact — Nytto Labs',
  description: 'Contact Nytto Labs: hello@ for general and partnerships, plus support, privacy, and billing inboxes.',
  path: '/contact',
})

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd name="Contact" path="/contact" />
      <ContactView />
    </>
  )
}
