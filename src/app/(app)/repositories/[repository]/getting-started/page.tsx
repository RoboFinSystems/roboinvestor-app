import { ApiKeysContent } from './content'

export default async function SharedRepositoryApiKeysPage({
  params,
}: {
  params: Promise<{ repository: string }>
}) {
  const { repository } = await params
  return <ApiKeysContent repository={repository} />
}
