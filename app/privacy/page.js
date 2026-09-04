import PrivacyView from './privacy-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Privacy — Nytto Labs',
  description: 'How Nytto Labs handles data. Privacy-first routing; contact privacy@nyttolabs.com.',
  path: '/privacy',
})

export default function Page() {
  return <PrivacyView />
}
