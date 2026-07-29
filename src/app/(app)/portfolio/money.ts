/**
 * Money and quantity parsing for the position form.
 *
 * Both values arrive as free text and are sent to the API as numbers, so a
 * parse that "succeeds" on garbage books a wrong position rather than raising
 * an error. Kept as a pure module (matching the convention of dedicated tests
 * for pure logic) so the contract can be tested without the page's SDK,
 * browser and flowbite dependencies.
 */

/**
 * Dollars as typed -> integer cents, the unit the API stores cost basis in.
 *
 * `Number` rather than `parseFloat` on purpose: `parseFloat` stops at the first
 * character it can't read, so a pasted '1,525.50' yields 1 and books $1.00 for
 * a $1,525.50 lot. `Number` rejects it outright, and anything not finite
 * becomes 0 — the same "no cost basis supplied" state as an empty field.
 */
export function parseMoneyToCents(raw: string): number {
  const n = Number(raw.trim())
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

/**
 * Share/unit count as typed, or null when it isn't a usable positive number.
 *
 * Null means "don't submit a position": returning NaN here would serialise to
 * `null` in the request body and create a position with no quantity.
 */
export function parseQuantity(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  return Number.isFinite(n) && n > 0 ? n : null
}
