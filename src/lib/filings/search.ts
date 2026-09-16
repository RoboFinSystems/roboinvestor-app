import type { IndexRow } from './types'

/**
 * Filers matching a term: an exact ticker first, then ticker prefixes in
 * ticker order, then name matches in name order. Case-insensitive; capped so a
 * dropdown stays small. The same ranking the xbrlkit viewer applies to the
 * same index, so a search reads alike in both.
 */
export function searchIndex(
  rows: IndexRow[],
  term: string,
  limit = 20
): IndexRow[] {
  const q = term.trim()
  if (!q) return []
  const upper = q.toUpperCase()
  const lower = q.toLowerCase()
  const exact: IndexRow[] = []
  const prefix: IndexRow[] = []
  const byName: IndexRow[] = []
  for (const row of rows) {
    const ticker = row.ticker.toUpperCase()
    if (ticker === upper) exact.push(row)
    else if (ticker.startsWith(upper)) prefix.push(row)
    else if (row.name.toLowerCase().includes(lower)) byName.push(row)
  }
  prefix.sort((a, b) => a.ticker.localeCompare(b.ticker))
  byName.sort((a, b) => a.name.localeCompare(b.name))
  return [...exact, ...prefix, ...byName].slice(0, limit)
}
