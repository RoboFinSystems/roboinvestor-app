import type { Metadata } from 'next'

const TITLE = 'RoboInvestor | AI Portfolio Management Agent'
const DESCRIPTION =
  'AI-powered portfolio management agent. Analyze holdings, track performance, and surface investment insights across your portfolio — powered by knowledge graphs and AI agents.'
const OG_IMAGE = '/images/logos/roboinvestor.png'

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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roboinvestor.ai',
    siteName: 'RoboInvestor',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1024, height: 1024, alt: 'RoboInvestor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    site: '@robofinsystems',
    creator: '@robofinsystems',
  },
  alternates: {
    canonical: 'https://roboinvestor.ai',
  },
}
