import { PUBLIC_ROUTES, siteUrl } from '@/lib/site'

export default function sitemap() {
  return PUBLIC_ROUTES.map((route) => ({
    url: siteUrl(route.path),
    lastModified: new Date(),
  }))
}
