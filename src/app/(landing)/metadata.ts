import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site'
import type { Metadata } from 'next'

export const landingMetadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'AI portfolio management',
    'portfolio management agent',
    'investment analysis AI',
    'portfolio performance tracking',
    'AI financial analysis',
    'financial knowledge graph',
    'investment insights',
  ],
  // openGraph/twitter are intentionally inherited from the root layout so the homepage
  // picks up the generated app/opengraph-image.tsx. Defining an openGraph object here
  // (even without images) would shadow that file-convention image.
  alternates: {
    canonical: 'https://roboinvestor.ai',
  },
}
