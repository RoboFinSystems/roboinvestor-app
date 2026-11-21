'use client'

import { PRODUCT_PAGES } from '@/lib/product-pages'
import { LandingFooter } from '@robosystems/core'
import ContactModal from './ContactModal'

export default function Footer() {
  return (
    <LandingFooter
      tagline="Equity research and private-company portfolios. Part of RoboSystems, the open-source knowledge graph for finance."
      // Section links carry the root path so they resolve from the docs too, where the
      // footer also renders.
      productLinks={[
        { label: 'Features', href: '/#features' },
        { label: 'Platform', href: '/#schema' },
        { label: 'Console', href: '/#console' },
        { label: 'Research', href: '/research' },
        { label: 'Docs', href: '/docs' },
        ...PRODUCT_PAGES.map((page) => ({
          label: page.navLabel,
          href: page.path,
        })),
      ]}
      contactModal={ContactModal}
    />
  )
}
