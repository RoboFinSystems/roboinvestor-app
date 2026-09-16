import type { Metadata } from 'next'
import { CompaniesSearchContent } from './content'

export const metadata: Metadata = {
  title: 'Company Research | RoboInvestor',
  description:
    "Every listed filer's SEC filings, rendered from the public data CDN.",
}

export default function CompaniesPage() {
  return <CompaniesSearchContent />
}
