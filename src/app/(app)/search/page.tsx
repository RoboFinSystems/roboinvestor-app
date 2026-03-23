import type { Metadata } from 'next'
import { SearchPageContent } from './content'

export const metadata: Metadata = {
  title: 'Document Search | RoboInvestor',
  description: 'Search SEC filings and investment documents',
}

export default function SearchPage() {
  return <SearchPageContent />
}
