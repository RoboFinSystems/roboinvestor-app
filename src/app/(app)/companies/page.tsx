import type { Metadata } from 'next'
import { CompaniesSearchContent } from './content'

export const metadata: Metadata = {
  title: 'Research | RoboInvestor',
  description:
    "Search any listed filer's SEC filings, rendered from the filing itself, and read the latest published research.",
}

export default function CompaniesPage() {
  return <CompaniesSearchContent />
}
