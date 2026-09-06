// From a filing's holon to what the company page renders: the primary
// financial statements as pivot tables (server-side, through the shared
// report components' pure projection), and the handful of headline figures a
// searcher wants first, each traced to the fact it came from.

import type {
  Fact,
  NormalizedReport,
  PivotTable,
  UnitInfo,
} from '@robosystems/report-components'
import { buildPivots } from '@robosystems/report-components'
import { parseJsonld } from '@robosystems/report-components/adapters'
import { fetchHolonText } from './catalog'

export interface HeadlineFact {
  label: string
  /** The concept the figure came from, e.g. `us-gaap:Assets`. */
  concept: string
  value: number
  /** Human period, e.g. `FY ending 2024-12-31` or `as of 2024-12-31`. */
  period: string
  /** Currency symbol for display, e.g. `$`. */
  symbol: string
}

export interface PrimaryStatements {
  entity: { name: string } | null
  tables: PivotTable[]
  units: Record<string, UnitInfo>
  headline: HeadlineFact[]
  factCount: number
}

/** Headline figures, first matching concept wins, consolidated latest period. */
const HEADLINE: Array<{ label: string; concepts: string[] }> = [
  {
    label: 'Revenue',
    concepts: [
      'us-gaap:Revenues',
      'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
      'us-gaap:SalesRevenueNet',
    ],
  },
  {
    label: 'Net income',
    concepts: ['us-gaap:NetIncomeLoss', 'us-gaap:ProfitLoss'],
  },
  { label: 'Total assets', concepts: ['us-gaap:Assets'] },
  {
    label: 'Cash',
    concepts: [
      'us-gaap:CashAndCashEquivalentsAtCarryingValue',
      'us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents',
    ],
  },
]

function elementIdsFor(report: NormalizedReport, concept: string): Set<string> {
  const local = concept.split(':')[1]
  const ids = new Set<string>()
  for (const el of Object.values(report.elements)) {
    if (el.qname === concept) ids.add(el.id)
    else if (
      el.qname.endsWith(`:${local}`) &&
      (el.id.includes('us-gaap') || el.qname.startsWith('us-gaap:'))
    )
      ids.add(el.id)
  }
  return ids
}

/** The consolidated fact for a concept with the latest period, longest span first. */
function latestConsolidated(
  report: NormalizedReport,
  ids: Set<string>
): Fact | null {
  let best: Fact | null = null
  let bestKey: [string, number] | null = null
  for (const fact of report.facts) {
    if (!ids.has(fact.element) || fact.value === null) continue
    if (fact.dimensions && fact.dimensions.length > 0) continue
    const period = report.periods[fact.period]
    if (!period) continue
    const span =
      period.type === 'duration' && period.startDate && period.endDate
        ? Date.parse(period.endDate) - Date.parse(period.startDate)
        : 0
    const key: [string, number] = [period.end, span]
    if (
      !bestKey ||
      key[0] > bestKey[0] ||
      (key[0] === bestKey[0] && key[1] > bestKey[1])
    ) {
      best = fact
      bestKey = key
    }
  }
  return best
}

function periodLabel(report: NormalizedReport, fact: Fact): string {
  const period = report.periods[fact.period]
  if (!period) return ''
  if (period.type === 'instant') return `as of ${period.end}`
  const start = period.startDate ? Date.parse(period.startDate) : NaN
  const end = period.endDate ? Date.parse(period.endDate) : NaN
  const days =
    Number.isNaN(start) || Number.isNaN(end) ? 0 : (end - start) / 86400000
  const kind = days > 300 ? 'FY' : days > 80 ? 'Quarter' : 'Period'
  return `${kind} ending ${period.end}`
}

export function headlineFacts(report: NormalizedReport): HeadlineFact[] {
  const out: HeadlineFact[] = []
  for (const { label, concepts } of HEADLINE) {
    for (const concept of concepts) {
      const ids = elementIdsFor(report, concept)
      if (ids.size === 0) continue
      const fact = latestConsolidated(report, ids)
      if (!fact || fact.value === null) continue
      const unit = fact.unit ? report.units[fact.unit] : null
      out.push({
        label,
        concept: report.elements[fact.element]?.qname ?? concept,
        value: fact.value,
        period: periodLabel(report, fact),
        symbol: unit?.symbol ?? (unit?.label === 'USD' ? '$' : ''),
      })
      break
    }
  }
  return out
}

/** Compact money: 24.6B, 1.2M — the headline strip, not the statements. */
export function compactMoney(value: number, symbol: string): string {
  const abs = Math.abs(value)
  const [num, suffix] =
    abs >= 1e9
      ? [value / 1e9, 'B']
      : abs >= 1e6
        ? [value / 1e6, 'M']
        : abs >= 1e3
          ? [value / 1e3, 'K']
          : [value, '']
  const text = `${symbol}${Math.abs(num).toLocaleString('en-US', {
    maximumFractionDigits: abs >= 1e3 ? 1 : 0,
  })}${suffix}`
  return value < 0 ? `(${text})` : text
}

/**
 * The statements a filing's holon carries, projected for rendering. Only the
 * primary statements (the sections the filer's role definitions mark
 * `Statement`, less the parentheticals); the viewer carries the disclosures.
 */
export async function loadPrimaryStatements(
  holonUrl: string
): Promise<PrimaryStatements> {
  const text = await fetchHolonText(holonUrl)
  const report = await parseJsonld(text)
  const tables = buildPivots(report).filter(
    (p) => p.kind === 'Statement' && !/parenthetical/i.test(p.title)
  )
  return {
    entity: report.entity ? { name: report.entity.name } : null,
    tables,
    units: report.units,
    headline: headlineFacts(report),
    factCount: report.facts.length,
  }
}
