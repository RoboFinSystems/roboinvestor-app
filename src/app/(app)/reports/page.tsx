'use client'
import { useUser } from '@robosystems/core'
import { Spinner } from '@robosystems/core/ui-components'
import ReceivedReportsContent from './content'

export default function ReportsPage() {
  const { user, isLoading } = useUser()

  if (isLoading || !user) {
    return <Spinner size="xl" fullScreen />
  }

  return <ReceivedReportsContent />
}
