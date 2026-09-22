import HomeView from './home-view'
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
})

export default function Page() {
  return <HomeView />
}
