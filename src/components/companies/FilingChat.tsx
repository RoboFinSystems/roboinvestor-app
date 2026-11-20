'use client'

/**
 * Ask about this filing — the shared ReportChat from core, anchored on the
 * company and filing on screen and pointed at the SEC graph. No key: the
 * call is the account's own and spends its credits, so the chat shows for a
 * user whose graphs include the SEC repository and turns into a pointer to
 * Repositories for everyone else. The page underneath is free either way.
 */
import {
  anchorNote,
  exampleQuestions,
  filingFocus,
  onSecTrial,
  type SubscriptionSeat,
} from '@/lib/filings/chat'
import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import {
  onlyRepositories,
  ReportChat,
  SDK,
  unwrapSdk,
  useGraphContext,
  useOrg,
  useUser,
} from '@robosystems/core'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const SEC_GRAPH_ID = 'sec'

const START_PLAN_URL = `${process.env.NEXT_PUBLIC_ROBOSYSTEMS_APP_URL || 'https://robosystems.ai'}/organization?tab=subscriptions`

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
  // The trial covers the analysis tools; the operator opens with the plan.
  const { currentOrg } = useOrg()
  const { user } = useUser()
  // Kept with the org it was read for, so another org's answer never shows.
  const [trialIn, setTrialIn] = useState<string | null>(null)
  const orgId = currentOrg?.id ?? null
  useEffect(() => {
    if (!hasSec || !orgId) return
    let live = true
    SDK.listOrgSubscriptions({ path: { org_id: orgId } })
      .then((result) => {
        const seats = unwrapSdk(result)
        const onTrial =
          Array.isArray(seats) &&
          onSecTrial(seats as SubscriptionSeat[], user?.id)
        if (live) setTrialIn(onTrial ? orgId : null)
      })
      // Unknown is not a trial: the API still says so if it is.
      .catch(() => {
        if (live) setTrialIn(null)
      })
    return () => {
      live = false
    }
  }, [hasSec, orgId, user?.id])
  const trial = hasSec && orgId !== null && trialIn === orgId

  return (
    <ReportChat
      graphId={SEC_GRAPH_ID}
      title="Ask about this filing"
      hint={
        !hasSec
          ? 'Needs the SEC repository'
          : trial
            ? 'Opens with your plan'
            : 'Answers from the SEC graph. Uses credits.'
      }
      anchorNote={anchorNote(company, filing)}
      focus={{ ...filingFocus(company, filing) }}
      intro={`Ask anything about ${company.name}'s ${filing.form}. The operator reads the SEC graph — this filing, prior periods, and peers — and answers from the numbers.`}
      examples={exampleQuestions(company, filing)}
      placeholder={`Ask about ${company.ticker}'s ${filing.form}…`}
      available={hasSec && !trial}
      unavailable={
        trial ? (
          <>
            Questions about a filing are not part of the SEC trial, which covers
            the analysis tools. They open with your first payment, and you do
            not have to wait for the trial to end:{' '}
            <a
              href={START_PLAN_URL}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              start your plan now
            </a>
            .
          </>
        ) : (
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
        )
      }
    />
  )
}
