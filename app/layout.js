import './globals.css'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { Providers } from './providers'
import { SITE_ORIGIN } from '@/lib/site'

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

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: 'Nytto Labs',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Nytto Labs', statusBarStyle: 'default' },
  twitter: { card: 'summary_large_image', images: [`${SITE_ORIGIN}/opengraph-image`] },
  title: 'Nytto Labs — CycleTag and VIESproof',
  description: 'Buy CycleTag reorder labels or pay for a VIESproof VAT check. Swedish software, F-tax. Other tools live under Products.',
  openGraph: {
    title: 'Nytto Labs — CycleTag and VIESproof',
    description: 'Two tools you can pay for today. CycleTag and VIESproof. The rest of the lab is on Products.',
    siteName: 'Nytto Labs',
    type: 'website',
  },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#1c3329' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
