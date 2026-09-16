'use client'

/**
 * Ask about this filing — the shared ReportChat from core, anchored on the
 * company and filing on screen and pointed at the SEC graph. No key: the
 * call is the account's own and spends its credits, so the chat shows for a
 * user whose graphs include the SEC repository and turns into a pointer to
 * Repositories for everyone else. The page underneath is free either way.
 */
import { anchorNote, exampleQuestions, filingFocus } from '@/lib/filings/chat'
import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import {
  onlyRepositories,
  ReportChat,
  useGraphContext,
} from '@robosystems/core'
import Link from 'next/link'
import { useMemo } from 'react'

const SEC_GRAPH_ID = 'sec'

export function FilingChat({
  company,
  filing,
}: {
  company: CompanyCatalog
  filing: CatalogFiling
}) {
  const { state } = useGraphContext()
  const hasSec = useMemo(
    () =>
      state.graphs.some(
        (g) => onlyRepositories(g) && g.graphId === SEC_GRAPH_ID
      ),
    [state.graphs]
  )

  return (
    <ReportChat
      graphId={SEC_GRAPH_ID}
      title="Ask about this filing"
      hint={
        hasSec
          ? 'Answers from the SEC graph. Uses credits.'
          : 'Needs the SEC repository'
      }
      anchorNote={anchorNote(company, filing)}
      focus={{ ...filingFocus(company, filing) }}
      intro={`Ask anything about ${company.name}'s ${filing.form}. The operator reads the SEC graph — this filing, prior periods, and peers — and answers from the numbers.`}
      examples={exampleQuestions(company, filing)}
      placeholder={`Ask about ${company.ticker}'s ${filing.form}…`}
      available={hasSec}
      unavailable={
        <>
          Questions about a filing run through the RoboSystems operator on the
          SEC knowledge graph and use your credits. Connect the SEC repository
          under{' '}
          <Link
            href="/repositories"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Repositories
          </Link>{' '}
          to ask here.
        </>
      }
    />
  )
}
