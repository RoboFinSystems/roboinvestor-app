'use client'

import { LandingFooter } from '@robosystems/core'
import ContactModal from './ContactModal'

export default function Footer() {
  return (
    <LandingFooter
      tagline="Open-source investment intelligence powered by the RoboSystems knowledge graph platform. Build AI-powered portfolio analysis and investment research tools."
      // Section links carry the root path so they resolve from the docs too, where the
      // footer also renders.
      productLinks={[
        { label: 'Features', href: '/#features' },
        { label: 'Platform', href: '/#schema' },
        { label: 'Console', href: '/#ai-analysis' },
        { label: 'Research', href: '/research' },
        { label: 'Docs', href: '/docs' },
      ]}
      contactModal={ContactModal}
    />
  )
}
