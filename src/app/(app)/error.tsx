'use client'

import { ErrorScreen } from '@/components/error/ErrorScreen'

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorScreen {...props} homeHref="/home" homeLabel="Go Home" />
}
