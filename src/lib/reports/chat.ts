/**
 * What the operator is told about the received report on screen. The note
 * rides ahead of every question (the operator does not read `context` into
 * its prompt yet); `focus` carries the same identifiers for a release that
 * does. The twin of roboledger-app's `lib/reports/chat.ts`, worded from the
 * reader's side: here the entity is the issuer that shared the report, not
 * the graph's own books, and the facts arrived as a copy rather than being
 * posted here.
 */
export interface ReceivedReportAnchor {
  reportId: string
  name: string
  entityName?: string | null
  periodStart?: string | null
  periodEnd?: string | null
}

export function reportFocus(
  anchor: ReceivedReportAnchor
): Record<string, unknown> {
  return {
    report_id: anchor.reportId,
    name: anchor.name,
    entity_name: anchor.entityName ?? null,
    period_start: anchor.periodStart ?? null,
    period_end: anchor.periodEnd ?? null,
    shared_report: true,
  }
}

function periodOf(anchor: ReceivedReportAnchor): string {
  if (anchor.periodStart && anchor.periodEnd)
    return `${anchor.periodStart} to ${anchor.periodEnd}`
  return anchor.periodEnd ?? anchor.periodStart ?? ''
}

/** The note that anchors the operator on the report the fund received. */
export function reportAnchorNote(anchor: ReceivedReportAnchor): string {
  const period = periodOf(anchor)
  return [
    'REPORT IN CONTEXT — the user is reading a report shared with this fund:',
    ...(anchor.entityName ? [`  Issuer: ${anchor.entityName}`] : []),
    `  Report: ${anchor.name}${period ? ` (${period})` : ''}`,
    `  Report identifier: ${anchor.reportId}`,
    'The issuer shared this report into this graph, so its facts are a received copy — this fund did not post them and holds no ledger behind them. Anchor on this report and its period, and read it by its identifier when the question is about "this report". If the user clearly asks about the fund\'s portfolio or another holding, answer that instead.',
  ].join('\n')
}

/** Questions offered on the empty state, worded for the report on screen. */
export function reportExampleQuestions(anchor: ReceivedReportAnchor): string[] {
  return [
    `Summarize ${anchor.name}`,
    'How did revenue and net income move against the prior period?',
    'What changed most on the balance sheet?',
  ]
}
