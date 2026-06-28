import type { Metadata } from 'next'

const TITLE = 'RoboInvestor | AI Portfolio Management Agent'
const DESCRIPTION =
  'AI-powered portfolio management agent. Analyze holdings, track performance, and surface investment insights across your portfolio — powered by knowledge graphs and AI agents.'

export const landingMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
