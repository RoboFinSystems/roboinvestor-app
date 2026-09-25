/**
 * Money and quantity parsing for the position form.
 *
 * Both values arrive as free text (the inputs are `type="text"`, so the parser
 * sees exactly what was typed — a `type="number"` input silently rewrites or
 * blanks anything it can't read, differently per browser) and are sent to the
 * API as numbers. A parse that "succeeds" on garbage books a wrong position,
 * so anything ambiguous is refused rather than guessed. Kept as a pure module
 * so the contract can be tested without the page's SDK, browser and flowbite
 * dependencies.
 */

/**
 * The accepted number shapes: plain digits (`1525`, `1525.5`) or US-style
 * thousands groups (`1,525.50`), with an optional leading `$`. Everything else
 * — `1.525,50`, `1 525,50`, `15,25`, `1e5` — is refused: those either use a
 * decimal comma or can't be read one way only.
 */
const PLAIN = /^\d+(\.\d+)?$/
const GROUPED = /^\d{1,3}(,\d{3})+(\.\d+)?$/

function readNumber(raw: string): number | null {
  const text = raw.trim().replace(/^\$\s*/, '')
  if (!PLAIN.test(text) && !GROUPED.test(text)) return null
  const n = Number(text.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

/**
 * Dollars as typed -> integer cents, the unit the API stores cost basis in.
 *
 * `''` is a deliberate "no cost basis supplied" and returns 0. Anything else
 * that isn't a non-negative dollar amount with at most two decimal places
 * returns null, which the form refuses — booking garbage as $0 is
 * indistinguishable from a real zero cost basis (a grant or gift).
 */
export function parseMoneyToCents(raw: string): number | null {
  if (!raw.trim()) return 0
  if (/\.\d{3,}$/.test(raw.trim())) return null
  const n = readNumber(raw)
  if (n === null) return null
  const cents = Math.round(n * 100)
  return Number.isSafeInteger(cents) ? cents : null
}

/**
 * Share/unit count as typed, or null when it isn't a usable positive number.
 *
 * Null means "refuse": returning NaN here would serialise to `null` in the
 * request body and create a position with no quantity.
 */
export function parseQuantity(raw: string): number | null {
  const text = raw.trim()
  if (!text || text.startsWith('$')) return null
  // `1.500` reads as 1.5 here and as 1,500 in much of Europe; refuse it.
  if (/^\d{1,3}\.\d{3}$/.test(text)) return null
  const n = readNumber(text)
  return n !== null && n > 0 ? n : null
}
