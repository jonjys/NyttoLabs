import PortalView from '@/components/portal/portal-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Explore all nine Nytto Labs products. Search by task, save your favorites and open each independent tool directly.',
  path: '/products',
})

export default function Page() {
  return <PortalView directory />
}
