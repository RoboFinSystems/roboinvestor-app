'use client'

import { BrowseRepositories } from '@/lib/core'
import { useRouter } from 'next/navigation'

export function BrowseRepositoriesPageContent() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <BrowseRepositories
        onSubscribed={(repoType) =>
          router.push(`/repositories/${repoType}/getting-started`)
        }
        onViewSubscriptions={() => router.push('/repositories')}
      />
    </div>
  )
}
