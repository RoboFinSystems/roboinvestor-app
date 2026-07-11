'use client'
import { useUser } from '@robosystems/core'
import { Spinner } from '@robosystems/core/ui-components'
import { use } from 'react'
import ResearchDetailContent from './content'

export default function ResearchTickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = use(params)
  const { user, isLoading } = useUser()

  if (isLoading || !user) {
    return <Spinner size="xl" fullScreen />
  }

  return <ResearchDetailContent ticker={ticker} />
}
