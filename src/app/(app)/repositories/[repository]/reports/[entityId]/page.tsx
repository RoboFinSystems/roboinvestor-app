import { EntityReportsContent } from './content'

export default async function SecEntityReportsPage({
  params,
}: {
  params: Promise<{ repository: string; entityId: string }>
}) {
  const { repository, entityId } = await params
  return <EntityReportsContent repository={repository} cik={entityId} />
}
