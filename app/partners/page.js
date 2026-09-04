import PartnersView from './partners-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Partners — Nytto Labs',
  description: 'Partner with Nytto Labs. You keep checkout and fulfilment; we connect high-intent users to a relevant next action.',
  path: '/partners',
})

export default function Page() {
  return <PartnersView />
}
