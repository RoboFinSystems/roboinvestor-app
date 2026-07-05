import { ReportsSearchContent } from './content'

export default async function SecReportsSearchPage({
  params,
}: {
  params: Promise<{ repository: string }>
}) {
  const { repository } = await params
  return <ReportsSearchContent repository={repository} />
}
