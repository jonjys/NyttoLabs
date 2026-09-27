'use client'

// The landing page now lives in components/landing (TypeScript). This file is
// kept so app/page.js and the existing public-copy tests keep their entry point.
import LandingPage from '@/components/landing/landing-page'

export default function HomeView() {
  return <LandingPage />
}
