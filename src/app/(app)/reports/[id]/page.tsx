import ReceivedReportContent from './content'

export default async function ReceivedReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ReceivedReportContent reportId={id} />
}
