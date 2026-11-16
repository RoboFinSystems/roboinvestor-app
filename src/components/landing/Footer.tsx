'use client'

import { LandingFooter } from '@robosystems/core'
import ContactModal from './ContactModal'

export default function Footer() {
  return (
    <LandingFooter
      tagline="Private-company portfolios and public-company research, early. Part of RoboSystems, the open-source knowledge graph for finance."
      // Section links carry the root path so they resolve from the docs too, where the
      // footer also renders.
      productLinks={[
        { label: 'Features', href: '/#features' },
        { label: 'Platform', href: '/#schema' },
        { label: 'Console', href: '/#console' },
        { label: 'Research', href: '/research' },
        { label: 'Docs', href: '/docs' },
      ]}
      contactModal={ContactModal}
    />
  )
}
