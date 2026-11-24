// Which other reports a research page links to: the ones in the same industry.
//
// Each catalog item carries `industries`, written by robosystems-content-machine from its
// classification tables: a list of {id, labels, primary}, primary first. An id is the
// slug path of a node (technology/software/application/payroll-and-hcm), so two reports
// are peers at a level when their ids share that many leading segments.

import type { CoverageIndustry, CoverageItem } from './types'

export interface RelatedCoverage {
  /** The industry the links share, as a reader would name it: "Payroll & HCM". */
  label: string
  /** The reports to link, closest first. */
  items: CoverageItem[]
  /** A report written about the industry itself, when one covers this company's. */
  hub: CoverageItem | null
}

/** Fewer peers than this at a level, and the next level up is tried. */
const MIN_PEERS = 3
const MAX_LINKS = 6
/** A sector report links every member it has, up to this. */
const MAX_HUB_LINKS = 30

const depthOf = (id: string) => id.split('/').length
const prefix = (id: string, depth: number) =>
  id.split('/').slice(0, depth).join('/')

/** An industry's name at a depth. A subsector nobody has divided is its own industry and
 *  shows once in `labels`, so the last label stands for every level below it. */
const labelAt = (industry: CoverageIndustry, depth: number) =>
  industry.labels[Math.min(depth, industry.labels.length) - 1]

const isHub = (item: CoverageItem) => (item.industries ?? []).some((i) => i.hub)

/** How many leading segments two industries share. */
function shared(a: string, b: string): number {
  const x = a.split('/')
  const y = b.split('/')
  let n = 0
  while (n < x.length && n < y.length && x[n] === y[n]) n += 1
  return n
}

/** The deepest level at which `other` sits in `industry`, or 0. */
const closeness = (industry: CoverageIndustry, other: CoverageItem) =>
  Math.max(0, ...(other.industries ?? []).map((o) => shared(industry.id, o.id)))

/** A stable start point per page, so the reports of a large industry do not all link to
 *  the same few: each page shows a different run of its peers. */
function rotation(seed: string, length: number): number {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return length ? h % length : 0
}

function pick(seed: string, peers: CoverageItem[], max: number) {
  const byTicker = [...peers].sort((a, b) => a.ticker.localeCompare(b.ticker))
  const start = rotation(seed, byTicker.length)
  return [...byTicker.slice(start), ...byTicker.slice(0, start)].slice(0, max)
}

export function relatedCoverage(
  item: CoverageItem,
  all: CoverageItem[]
): RelatedCoverage | null {
  const industries = item.industries ?? []
  if (!industries.length) return null
  const others = all.filter((o) => o.ticker !== item.ticker)
  const companies = others.filter((o) => !isHub(o))

  // A report about an industry links the reports on its members.
  const own = industries.find((i) => i.hub)
  if (own) {
    const members = companies
      .filter((o) => closeness(own, o) >= depthOf(own.id))
      .sort((a, b) => a.ticker.localeCompare(b.ticker))
      .slice(0, MAX_HUB_LINKS)
    if (!members.length) return null
    return { label: labelAt(own, depthOf(own.id)), items: members, hub: null }
  }

  const hub =
    others.find((o) =>
      (o.industries ?? []).some(
        (h) =>
          h.hub && industries.some((i) => shared(i.id, h.id) >= depthOf(h.id))
      )
    ) ?? null

  // Primary industry first. Within one, the deepest level with enough peers wins; with
  // none that deep, whatever shares the subsector, and last the sector.
  for (const industry of industries) {
    const at = (depth: number) =>
      companies.filter((o) => closeness(industry, o) >= depth)
    let depth = depthOf(industry.id)
    while (depth > 2 && at(depth).length < MIN_PEERS) depth -= 1
    if (!at(depth).length) depth = 1
    const peers = at(depth)
    if (!peers.length) continue
    // Closest first: a report in the same sub-industry outranks one that only shares
    // the subsector, and each band is rotated on its own.
    const bands = new Map<number, CoverageItem[]>()
    for (const p of peers) {
      const c = closeness(industry, p)
      bands.set(c, [...(bands.get(c) ?? []), p])
    }
    const items = [...bands.keys()]
      .sort((a, b) => b - a)
      .flatMap((c) => pick(item.ticker, bands.get(c) ?? [], MAX_LINKS))
      .slice(0, MAX_LINKS)
    return { label: labelAt(industry, depth), items, hub }
  }
  return hub ? { label: hub.company, items: [], hub } : null
}
