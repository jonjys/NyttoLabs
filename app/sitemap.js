import { PUBLIC_ROUTES, siteUrl } from '@/lib/site'

// Build time is a good-enough freshness signal: every deploy regenerates it.
const lastModified = new Date()

export default function sitemap() {
  return PUBLIC_ROUTES.map((route) => ({
    url: siteUrl(route.path),
    lastModified,
    changeFrequency: route.path === '/' || route.path === '/products' ? 'weekly' : 'monthly',
    priority: route.path === '/' ? 1 : route.path === '/products' ? 0.9 : 0.5,
  }))
}
