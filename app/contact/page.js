import ContactView from './contact-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Contact — Nytto Labs',
  description: 'Contact Nytto Labs at hello@nyttolabs.com for general questions and partnerships.',
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
