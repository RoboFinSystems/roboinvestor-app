'use client'

import { ActiveSubscriptions, BrowseRepositories } from '@/lib/core'
import { useRouter } from 'next/navigation'

export function RepositoriesContent() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <ActiveSubscriptions
        onOpenConsole={() => router.push('/console')}
        onGettingStarted={(repoId) =>
          router.push(`/repositories/${repoId}/getting-started`)
        }
        onBrowse={() => router.push('/repositories/browse')}
        emptyState={<BrowseRepositoriesContent />}
      />
    </div>
  )
}

function BrowseRepositoriesContent() {
  const router = useRouter()

  return (
    <BrowseRepositories
      onSubscribed={(repoType) =>
        router.push(`/repositories/${repoType}/getting-started`)
      }
      onViewSubscriptions={() => router.push('/repositories')}
    />
  )
}
