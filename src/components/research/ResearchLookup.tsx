'use client'

/**
 * The lookup box on the public research index: any listed filer, by ticker or
 * name, straight to its page. The results are buttons, not links, so this adds
 * no crawlable URL — the cohort sitemaps decide what search engines see.
 */
import { CompanySearch } from '@/components/companies/CompanySearch'
import { useRouter } from 'next/navigation'

export function ResearchLookup() {
  const router = useRouter()
  return (
    <div className="mx-auto mt-8 w-full max-w-xl">
      <CompanySearch
        placeholder="Any listed company — ticker or name…"
        onSelect={(row) => router.push(`/research/${row.ticker.toLowerCase()}`)}
      />
      <p className="mt-2 text-center text-sm text-gray-400">
        Every listed filer&apos;s statements, straight from its latest filing.
      </p>
    </div>
  )
}
