import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site'
import type { Metadata } from 'next'

export const landingMetadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'AI portfolio management',
    'private company portfolio tracking',
    'investment analysis AI',
    'portfolio company reporting',
    'AI financial analysis',
    'financial knowledge graph',
    'SEC filings research',
  ],
  // openGraph/twitter are intentionally inherited from the root layout so the homepage
  // picks up the generated app/opengraph-image.tsx. Defining an openGraph object here
  // (even without images) would shadow that file-convention image.
  alternates: {
    canonical: 'https://roboinvestor.ai',
  },
}
