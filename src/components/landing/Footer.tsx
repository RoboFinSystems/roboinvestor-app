'use client'

import { LandingFooter } from '@/lib/core'
import ContactModal from './ContactModal'

export default function Footer() {
  return (
    <LandingFooter
      tagline="Open-source investment intelligence powered by the RoboSystems knowledge graph platform. Build AI-powered portfolio analysis and investment research tools."
      productLinks={[
        { label: 'Features', href: '#features' },
        { label: 'Platform', href: '#schema' },
        { label: 'Console', href: '#ai-analysis' },
      ]}
      contactModal={ContactModal}
    />
  )
}
