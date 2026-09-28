'use client'

import {
  ActiveSubscriptions,
  BrowseRepositories,
  openConsoleDrawer,
  PageLayout,
} from '@robosystems/core'
import { useRouter } from 'next/navigation'

export function RepositoriesContent() {
  const router = useRouter()

  return (
    <PageLayout>
      <ActiveSubscriptions
        onOpenConsole={openConsoleDrawer}
        onGettingStarted={(repoId) =>
          router.push(`/repositories/${repoId}/getting-started`)
        }
        onBrowse={() => router.push('/repositories/browse')}
        emptyState={<BrowseRepositoriesContent />}
      />
    </PageLayout>
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
