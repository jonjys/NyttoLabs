import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Nytto Labs — Focused software. Invisible infrastructure.',
  description: 'Nytto Labs builds focused digital products and quietly connects people to the right next product, service, or action.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}