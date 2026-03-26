'use client'

import { SearchContent, useIsRepository, type SearchConfig } from '@/lib/core'
import { useMemo } from 'react'

const REPO_CONFIG: SearchConfig = {
  title: 'Document Search',
  description: 'Search SEC filings and investment documents',
  placeholder: 'Search filings, fund documents, research...',
  filters: {
    sourceType: true,
    entity: true,
    formType: true,
    fiscalYear: true,

  },
}

const USER_GRAPH_CONFIG: SearchConfig = {
  title: 'Document Search',
  description: 'Search uploaded documents and AI memories',
  placeholder: 'Search your documents...',
  filters: { sourceType: true },
}

export function SearchPageContent() {
  const isRepository = useIsRepository()
  const config = useMemo(
    () => (isRepository ? REPO_CONFIG : USER_GRAPH_CONFIG),
    [isRepository]
  )
  return <SearchContent config={config} />
}
