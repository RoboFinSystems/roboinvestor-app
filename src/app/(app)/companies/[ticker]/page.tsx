import type { Metadata } from 'next'
import { CompanyContent } from './content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>
}): Promise<Metadata> {
  const { ticker } = await params
  return { title: `${ticker.toUpperCase()} | Company Research | RoboInvestor` }
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  return <CompanyContent ticker={ticker} />
}
