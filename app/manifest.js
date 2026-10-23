export default function manifest() {
  return {
    id: '/',
    name: 'Nytto Labs',
    short_name: 'Nytto Labs',
    description: 'Small tools that finish the job.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f6f6f3',
    theme_color: '#f6f6f3',
    lang: 'en',
    icons: [
      { src: '/portal-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/portal-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
}
