'use client'

import { BrowseRepositories, PageLayout } from '@/lib/core'
import { useRouter } from 'next/navigation'

export function BrowseRepositoriesPageContent() {
  const router = useRouter()

  return (
    <PageLayout>
      <BrowseRepositories
        onSubscribed={(repoType) =>
          router.push(`/repositories/${repoType}/getting-started`)
        }
        onViewSubscriptions={() => router.push('/repositories')}
      />
    </PageLayout>
  )
}
