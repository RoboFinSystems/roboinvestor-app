// Site-wide Schema.org structured data. The Organization block is rendered in the root
// layout so every page carries publisher identity; the SoftwareApplication block is rendered
// on the homepage. `sameAs` mirrors the shared RoboFinSystems social profiles linked from
// the footer.

import { SITE_DESCRIPTION, SITE_NAME } from './site'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: 'https://roboinvestor.ai',
  logo: 'https://roboinvestor.ai/images/logos/roboinvestor-icon.png',
  description: SITE_DESCRIPTION,
  sameAs: [
    'https://github.com/RoboFinSystems',
    'https://x.com/robofinsystems',
    'https://www.linkedin.com/company/robosystems',
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
  name: SITE_NAME,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  // No `offers` block: pricing and provisioning live on the RoboSystems side, and a
  // `price: '0'` Offer told search engines the app was free. It is not. roboledger-app
  // dropped the same block for the same reason.
  description: SITE_DESCRIPTION,
  url: 'https://roboinvestor.ai',
}
