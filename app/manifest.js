export default function manifest() {
  return {
    id: '/',
    name: 'Nytto Labs — Product toolbox',
    short_name: 'Nytto Labs',
    description: 'Find and bookmark the independent tools from Nytto Labs.',
    start_url: '/products',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f5f0',
    theme_color: '#1c3329',
    lang: 'en',
    icons: [
      { src: '/portal-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/portal-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
}
