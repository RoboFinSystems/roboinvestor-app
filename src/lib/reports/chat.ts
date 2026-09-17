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

/**
 * Counterparty text, flattened before it reaches the operator.
 *
 * `name` and `entityName` on a received report are the issuer's own words — a
 * party this fund does not control — and they land in the note that steers the
 * operator. What the operator can reach is fixed by the graph in the request
 * URL and re-checked server-side, so crafted text cannot read anything the
 * reader could not; but a name carrying newlines could still dress itself up
 * as another line of the note. Collapsing whitespace and clamping the length
 * takes the disguise away and leaves every honest report reading the same.
 */
function flatten(value: string, max = 200): string {
  const oneLine = value.replace(/\s+/g, ' ').trim()
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine
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
    ...(anchor.entityName ? [`  Issuer: ${flatten(anchor.entityName)}`] : []),
    `  Report: ${flatten(anchor.name)}${period ? ` (${period})` : ''}`,
    `  Report identifier: ${anchor.reportId}`,
    'The issuer shared this report into this graph, so its facts are a received copy — this fund did not post them and holds no ledger behind them. Anchor on this report and its period, and read it by its identifier when the question is about "this report". If the user clearly asks about the fund\'s portfolio or another holding, answer that instead.',
  ].join('\n')
}

/** Questions offered on the empty state, worded for the report on screen. */
export function reportExampleQuestions(anchor: ReceivedReportAnchor): string[] {
  // Tapping an example sends it as the reader's own question, so the issuer's
  // text is flattened here too rather than riding into the thread unchanged.
  return [
    `Summarize ${flatten(anchor.name)}`,
    'How did revenue and net income move against the prior period?',
    'What changed most on the balance sheet?',
  ]
}
