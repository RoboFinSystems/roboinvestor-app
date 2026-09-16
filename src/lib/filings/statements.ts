// From a filing's report file (its Tavi model, or its holon) to what the company page renders: the primary
// financial statements as pivot tables (server-side, through the shared
// report components' pure projection), and the handful of headline figures a
// searcher wants first, each traced to the fact it came from.

import type {
  Fact,
  InformationBlock,
  NormalizedReport,
  PeriodInfo,
  PivotTable,
  UnitInfo,
} from '@robosystems/report-components'
import { buildPivot, reportSections } from '@robosystems/report-components'
import { parseReportDocument } from '@robosystems/report-components/adapters'
import { fetchReportText } from './catalog'

export interface HeadlineFact {
  label: string
  /** The concept the figure came from, e.g. `us-gaap:Assets`. */
  concept: string
  value: number
  /** Human period, e.g. `FY ending 2024-12-31` or `as of 2024-12-31`. */
  period: string
  /** Currency symbol for display, e.g. `$`; a code with a space when there is none. */
  symbol: string
}

export interface PrimaryStatements {
  entity: { name: string } | null
  tables: PivotTable[]
  units: Record<string, UnitInfo>
  headline: HeadlineFact[]
}

/**
 * Headline figures: the first concept with a consolidated fact wins, at its
 * latest period. US GAAP first, then the IFRS concepts a 20-F or 40-F filer
 * reports under.
 */
const HEADLINE: Array<{ label: string; concepts: string[] }> = [
  {
    label: 'Revenue',
    concepts: [
      'us-gaap:Revenues',
      'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
      'us-gaap:SalesRevenueNet',
      'ifrs-full:Revenue',
    ],
  },
  {
    label: 'Net income',
    concepts: [
      'us-gaap:NetIncomeLoss',
      'us-gaap:ProfitLoss',
      'ifrs-full:ProfitLossAttributableToOwnersOfParent',
      'ifrs-full:ProfitLoss',
    ],
  },
  { label: 'Total assets', concepts: ['us-gaap:Assets', 'ifrs-full:Assets'] },
  {
    label: 'Cash',
    concepts: [
      'us-gaap:CashAndCashEquivalentsAtCarryingValue',
      'us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents',
      'ifrs-full:CashAndCashEquivalents',
    ],
  },
]

/** Symbols for the headline strip; any other currency shows its code. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  HKD: 'HK$',
  INR: '₹',
  KRW: '₩',
  BRL: 'R$',
}

function currencySymbol(unit: UnitInfo | null): string {
  if (!unit) return ''
  if (unit.symbol) return unit.symbol
  const measure = unit.measure || unit.label || ''
  const [scheme, local] = measure.includes(':')
    ? measure.split(':', 2)
    : ['iso4217', measure]
  if (scheme !== 'iso4217') return ''
  const code = local.toUpperCase()
  return CURRENCY_SYMBOLS[code] ?? (code ? `${code} ` : '')
}

/**
 * The element ids for a concept: the compacted name, or — when the holon
 * compacts the taxonomy under another prefix, or keeps the taxonomy year in
 * the qname (`us-gaap:2026#Assets`) — the local name within the concept's
 * taxonomy, read off the element IRI.
 */
function elementIdsFor(report: NormalizedReport, concept: string): Set<string> {
  const [taxonomy, local] = concept.split(':')
  const ids = new Set<string>()
  for (const el of Object.values(report.elements)) {
    const sameLocal =
      el.qname.endsWith(`:${local}`) ||
      el.id.endsWith(`#${local}`) ||
      el.id.endsWith(`/${local}`)
    if (el.qname === concept || (sameLocal && el.id.includes(taxonomy)))
      ids.add(el.id)
  }
  return ids
}

/** Days a duration covers; 0 for an instant or a period without both dates. */
function spanDays(period: PeriodInfo): number {
  if (period.type !== 'duration' || !period.startDate || !period.endDate)
    return 0
  const start = Date.parse(period.startDate)
  const end = Date.parse(period.endDate)
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  return (end - start) / 86400000
}

/** Whole months a duration covers, so a 52- and a 53-week year both read as a year. */
function spanMonths(period: PeriodInfo): number {
  const days = spanDays(period)
  return days === 0 ? 0 : Math.max(1, Math.round(days / 30.44))
}

/**
 * Which span to headline when a filing reports several to the same date. An
 * annual filing headlines the year over a fourth-quarter stub; a quarterly
 * filing headlines the quarter over the year to date it reports beside it.
 */
type SpanPreference = 'longest' | 'shortest'

function spanPreferenceFor(form: string | undefined): SpanPreference {
  return form?.startsWith('10-Q') ? 'shortest' : 'longest'
}

/** The consolidated fact for a concept at its latest period, the preferred span first. */
function latestConsolidated(
  report: NormalizedReport,
  ids: Set<string>,
  prefer: SpanPreference
): Fact | null {
  let best: Fact | null = null
  let bestKey: [string, number] | null = null
  for (const fact of report.facts) {
    if (!ids.has(fact.element) || fact.value === null) continue
    if (fact.dimensions && fact.dimensions.length > 0) continue
    const period = report.periods[fact.period]
    if (!period) continue
    const span = spanDays(period)
    // Higher wins at the same end. A span that could not be measured never
    // beats one that could, whichever way the preference runs.
    const rank = prefer === 'shortest' ? (span > 0 ? -span : -Infinity) : span
    const key: [string, number] = [period.end, rank]
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
  const months = spanMonths(period)
  const kind =
    months === 0
      ? 'Period'
      : months === 12
        ? 'FY'
        : months === 3
          ? 'Quarter'
          : `${months} month${months === 1 ? '' : 's'}`
  return `${kind} ending ${period.end}`
}

/**
 * The headline strip for a filing. `form` decides which span leads when the
 * filing reports several to one date: a 10-Q's quarter over its year to date.
 */
export function headlineFacts(
  report: NormalizedReport,
  form?: string
): HeadlineFact[] {
  const prefer = spanPreferenceFor(form)
  const out: HeadlineFact[] = []
  for (const { label, concepts } of HEADLINE) {
    for (const concept of concepts) {
      const ids = elementIdsFor(report, concept)
      if (ids.size === 0) continue
      const fact = latestConsolidated(report, ids, prefer)
      if (!fact || fact.value === null) continue
      out.push({
        label,
        concept: report.elements[fact.element]?.qname ?? concept,
        value: fact.value,
        period: periodLabel(report, fact),
        symbol: currencySymbol(
          fact.unit ? (report.units[fact.unit] ?? null) : null
        ),
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
 * The blocks the page renders: the sections the filer's role definitions mark
 * `Statement`, less the parentheticals, in the report's own order. Chosen
 * before anything is projected — the notes and disclosures, most of a
 * filing's sections, are never pivoted here.
 */
export function statementBlocks(report: NormalizedReport): InformationBlock[] {
  const blocks = new Map(report.informationBlocks.map((ib) => [ib.id, ib]))
  return reportSections(report)
    .filter((s) => s.kind === 'Statement' && !/parenthetical/i.test(s.title))
    .flatMap((s) => {
      const ib = blocks.get(s.id)
      return ib ? [ib] : []
    })
}

/**
 * The statements a filing carries, projected for rendering, from whichever
 * file the catalog offers: the Tavi model (walked directly, tens of
 * milliseconds) or the holon (through its RDF expansion). Only the primary
 * statements are projected; the viewer carries the disclosures.
 */
export async function loadPrimaryStatements(
  reportFileUrl: string,
  form?: string
): Promise<PrimaryStatements> {
  const text = await fetchReportText(reportFileUrl)
  const { report } = await parseReportDocument(text)
  const tables = statementBlocks(report).map((ib) => buildPivot(report, ib))
  return {
    entity: report.entity ? { name: report.entity.name } : null,
    tables,
    units: report.units,
    headline: headlineFacts(report, form),
  }
}
