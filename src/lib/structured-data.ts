// Site-wide Schema.org structured data. The Organization block is rendered in the root
// layout so every page carries publisher identity; the SoftwareApplication block is rendered
// on the homepage. `sameAs` mirrors the shared RoboFinSystems social profiles linked from
// the footer.

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RoboInvestor',
  url: 'https://roboinvestor.ai',
  logo: 'https://roboinvestor.ai/images/logos/roboinvestor.png',
  description:
    'AI-powered portfolio management agent — analyze holdings, track performance, and surface investment insights.',
  sameAs: [
    'https://github.com/RoboFinSystems',
    'https://x.com/robofinsystems',
    'https://www.linkedin.com/company/robofinsystems',
    'https://www.youtube.com/@RoboSystems',
  ],
  founder: {
    '@type': 'Person',
    name: 'Joseph French',
  },
}

export const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RoboInvestor',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'AI-powered portfolio management agent. Analyze holdings, track performance, and surface investment insights across your portfolio.',
  url: 'https://roboinvestor.ai',
}
