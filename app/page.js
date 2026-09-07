import PortalView from '@/components/portal/portal-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — Small tools. Work, handled.',
  description: 'Nine focused tools for reordering, VAT checks, API spend, payments and evidence. Find your next tool in the Nytto Labs product studio.',
  path: '/',
})

export default function Page() {
  return <PortalView />
}
