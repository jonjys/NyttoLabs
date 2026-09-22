import './globals.css'
import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import { Providers } from './providers'
import { OrganizationJsonLd } from '@/components/site/json-ld'
import { HOME_DESCRIPTION, SITE_ORIGIN } from '@/lib/site'

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: 'Nytto Labs',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Nytto Labs', statusBarStyle: 'default' },
  twitter: { card: 'summary_large_image', images: [`${SITE_ORIGIN}/opengraph-image`] },
  title: 'Nytto Labs — Swedish software from Stockholm',
  description: HOME_DESCRIPTION,
  openGraph: {
    title: 'Nytto Labs',
    description: HOME_DESCRIPTION,
    siteName: 'Nytto Labs',
    type: 'website',
  },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#03030c' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans">
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
