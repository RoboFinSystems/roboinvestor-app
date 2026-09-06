import type {
  ElementInfo,
  Fact,
  NormalizedReport,
  PeriodInfo,
  UnitInfo,
} from '@robosystems/report-components'
import { describe, expect, it } from 'vitest'
import { compactMoney, headlineFacts, statementBlocks } from '../statements'

const USGAAP = 'http://fasb.org/us-gaap/2025#'
const IFRS = 'https://xbrl.ifrs.org/taxonomy/2025-03-27/ifrs-full#'

function element(
  ns: string,
  prefix: string,
  local: string,
  periodType: 'instant' | 'duration' = 'duration'
): ElementInfo {
  return {
    id: `${ns}${local}`,
    qname: `${prefix}:${local}`,
    label: local,
    balance: null,
    periodType,
    abstract: false,
    monetary: true,
  }
}

function duration(start: string, end: string): PeriodInfo {
  return {
    id: `period:${start}/${end}`,
    type: 'duration',
    instant: null,
    startDate: start,
    endDate: end,
    end,
  }
}

function instant(date: string): PeriodInfo {
  return {
    id: `period:${date}`,
    type: 'instant',
    instant: date,
    startDate: null,
    endDate: null,
    end: date,
  }
}

/** A unit as the adapter would emit it: `symbol` absent, set, or null. */
function unit(code: string, symbol?: string | null): UnitInfo {
  return {
    id: `unit:${code}`,
    measure: `iso4217:${code}`,
    label: code,
    ...(symbol !== undefined ? { symbol } : {}),
  }
}

const USD = unit('USD', '$')

const SEGMENT: Fact['dimensions'] = [
  {
    axis: 'us-gaap:StatementBusinessSegmentsAxis',
    member: 'acme:StreamingMember',
    axisLabel: 'Segments',
    memberLabel: 'Streaming',
    explicit: true,
  },
]

let seq = 0
function fact(
  el: ElementInfo,
  period: PeriodInfo,
  value: number,
  u: UnitInfo = USD,
  dimensions?: Fact['dimensions']
): Fact {
  return {
    id: `fact:${++seq}`,
    element: el.id,
    period: period.id,
    unit: u.id,
    entity: null,
    factSet: null,
    value,
    decimals: null,
    ...(dimensions ? { dimensions } : {}),
  }
}

function report(
  facts: Fact[],
  elements: ElementInfo[],
  periods: PeriodInfo[],
  units: UnitInfo[] = [USD]
): NormalizedReport {
  const byId = <T extends { id: string }>(xs: T[]) =>
    Object.fromEntries(xs.map((x) => [x.id, x]))
  return {
    reportId: null,
    reportIri: null,
    entity: { id: 'entity', name: 'Acme', legalName: null, country: null },
    informationBlocks: [],
    structures: [],
    facts,
    elements: byId(elements),
    periods: byId(periods),
    units: byId(units),
    calcAssociations: [],
    presAssociations: [],
  }
}

const FY24 = duration('2024-01-01', '2024-12-31')
const FY23 = duration('2023-01-01', '2023-12-31')
const Q4_24 = duration('2024-10-01', '2024-12-31')
const AT24 = instant('2024-12-31')
const AT23 = instant('2023-12-31')

const Revenues = element(USGAAP, 'us-gaap', 'Revenues')
const ProfitLoss = element(USGAAP, 'us-gaap', 'ProfitLoss')
const Assets = element(USGAAP, 'us-gaap', 'Assets', 'instant')
const Cash = element(
  USGAAP,
  'us-gaap',
  'CashAndCashEquivalentsAtCarryingValue',
  'instant'
)

describe('headlineFacts', () => {
  it('takes the consolidated fact at the latest, longest period', () => {
    const r = report(
      [
        fact(Revenues, FY23, 90),
        fact(Revenues, Q4_24, 30),
        fact(Revenues, FY24, 100),
        fact(Revenues, FY24, 1000, USD, SEGMENT),
      ],
      [Revenues],
      [FY23, FY24, Q4_24]
    )
    expect(headlineFacts(r)).toEqual([
      {
        label: 'Revenue',
        concept: 'us-gaap:Revenues',
        value: 100,
        period: 'FY ending 2024-12-31',
        symbol: '$',
      },
    ])
  })

  it('falls through the concept list, and skips a headline with only dimensioned facts', () => {
    const r = report(
      [fact(ProfitLoss, FY24, 12), fact(Cash, AT24, 5, USD, SEGMENT)],
      [ProfitLoss, Cash],
      [FY24, AT24]
    )
    expect(headlineFacts(r).map((h) => [h.label, h.concept])).toEqual([
      ['Net income', 'us-gaap:ProfitLoss'],
    ])
  })

  it('labels an instant "as of" and takes the latest', () => {
    const r = report(
      [fact(Assets, AT23, 40), fact(Assets, AT24, 50)],
      [Assets],
      [AT23, AT24]
    )
    expect(headlineFacts(r)).toMatchObject([
      { label: 'Total assets', value: 50, period: 'as of 2024-12-31' },
    ])
  })

  it('labels a quarter', () => {
    const r = report([fact(Revenues, Q4_24, 30)], [Revenues], [Q4_24])
    expect(headlineFacts(r)[0]?.period).toBe('Quarter ending 2024-12-31')
  })

  it('reads an IFRS filer in its own currency', () => {
    const EUR = unit('EUR') // the adapter gave no symbol
    const SEK = unit('SEK', null) // the adapter said it has none
    const Revenue = element(IFRS, 'ifrs-full', 'Revenue')
    const Profit = element(
      IFRS,
      'ifrs-full',
      'ProfitLossAttributableToOwnersOfParent'
    )
    const r = report(
      [fact(Revenue, FY24, 7e9, EUR), fact(Profit, FY24, 1e9, SEK)],
      [Revenue, Profit],
      [FY24],
      [EUR, SEK]
    )
    expect(headlineFacts(r).map((h) => [h.label, h.concept, h.symbol])).toEqual(
      [
        ['Revenue', 'ifrs-full:Revenue', '€'],
        [
          'Net income',
          'ifrs-full:ProfitLossAttributableToOwnersOfParent',
          'SEK ',
        ],
      ]
    )
  })

  it('matches a concept the holon compacts under another prefix', () => {
    const aliased = element(USGAAP, 'gaap', 'Revenues')
    const r = report([fact(aliased, FY24, 3)], [aliased], [FY24])
    expect(headlineFacts(r)).toMatchObject([
      { concept: 'gaap:Revenues', value: 3 },
    ])
  })

  it('does not match the same local name from another taxonomy', () => {
    const lookalike = element('http://example.com/other#', 'other', 'Revenue')
    const r = report([fact(lookalike, FY24, 4)], [lookalike], [FY24])
    expect(headlineFacts(r)).toEqual([])
  })

  it('has nothing for a report without the concepts', () => {
    expect(headlineFacts(report([], [], []))).toEqual([])
  })
})

describe('statementBlocks', () => {
  function block(
    id: string,
    kind: 'Statement' | 'Disclosure',
    name: string
  ): NormalizedReport {
    const r = report([], [], [])
    r.informationBlocks = [
      {
        id,
        blockType: 'Statement',
        factSet: null,
        label: name,
        structureId: `s:${id}`,
      },
    ]
    r.structures = [
      {
        id: `s:${id}`,
        blockType: 'Statement',
        roleUri: null,
        structureName: name,
        kind,
      },
    ]
    return r
  }

  function merged(...rs: NormalizedReport[]): NormalizedReport {
    const r = report([], [], [])
    r.informationBlocks = rs.flatMap((x) => x.informationBlocks)
    r.structures = rs.flatMap((x) => x.structures)
    return r
  }

  it('keeps the statements and drops notes and parentheticals', () => {
    const r = merged(
      block('bs', 'Statement', 'Consolidated Balance Sheets'),
      block('bsp', 'Statement', 'Consolidated Balance Sheets (Parenthetical)'),
      block('is', 'Statement', 'Consolidated Statements of Operations'),
      block('n1', 'Disclosure', 'Revenue Recognition')
    )
    expect(statementBlocks(r).map((ib) => ib.id)).toEqual(['bs', 'is'])
  })

  it('is empty for a report with no statements', () => {
    expect(statementBlocks(block('n1', 'Disclosure', 'Leases'))).toEqual([])
  })
})

describe('compactMoney', () => {
  it('scales to K, M and B with one decimal', () => {
    expect(compactMoney(24_600_000_000, '$')).toBe('$24.6B')
    expect(compactMoney(1_250_000, '$')).toBe('$1.3M')
    expect(compactMoney(1_500, '$')).toBe('$1.5K')
    expect(compactMoney(999, '$')).toBe('$999')
  })

  it('brackets a negative and keeps the symbol first', () => {
    expect(compactMoney(-2_000_000_000, '€')).toBe('(€2B)')
  })

  it('prefixes a currency code where there is no symbol', () => {
    expect(compactMoney(5_000_000, 'SEK ')).toBe('SEK 5M')
  })
})
