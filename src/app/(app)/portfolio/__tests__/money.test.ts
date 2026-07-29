import { describe, expect, it } from 'vitest'
import { parseMoneyToCents, parseQuantity } from '../money'

describe('parseMoneyToCents', () => {
  it('converts dollars to integer cents', () => {
    expect(parseMoneyToCents('1525.50')).toBe(152550)
  })

  it('rounds rather than truncates', () => {
    expect(parseMoneyToCents('10.005')).toBe(1001)
    expect(parseMoneyToCents('10.004')).toBe(1000)
  })

  it('absorbs float drift on values that are not exactly representable', () => {
    // 1.15 * 100 is 114.99999999999999 in IEEE 754.
    expect(parseMoneyToCents('1.15')).toBe(115)
    expect(parseMoneyToCents('8.87')).toBe(887)
  })

  it('rejects a thousands separator instead of silently truncating it', () => {
    // parseFloat('1,525.50') returns 1 — booking $1.00 for a $1,525.50 lot.
    expect(parseMoneyToCents('1,525.50')).toBe(0)
  })

  it('treats non-numeric and empty input as no cost basis', () => {
    expect(parseMoneyToCents('')).toBe(0)
    expect(parseMoneyToCents('abc')).toBe(0)
    expect(parseMoneyToCents('$100')).toBe(0)
  })

  it('tolerates surrounding whitespace', () => {
    expect(parseMoneyToCents('  42.00 ')).toBe(4200)
  })

  it('handles zero and fractional cents at the bottom of the range', () => {
    expect(parseMoneyToCents('0')).toBe(0)
    expect(parseMoneyToCents('0.01')).toBe(1)
  })
})

describe('parseQuantity', () => {
  it('accepts whole and fractional share counts', () => {
    expect(parseQuantity('100')).toBe(100)
    expect(parseQuantity('0.5')).toBe(0.5)
  })

  it('returns null for input that is not a usable number', () => {
    // NaN would serialise to null and create a position with no quantity.
    expect(parseQuantity('abc')).toBeNull()
    expect(parseQuantity('1,000')).toBeNull()
    expect(parseQuantity('')).toBeNull()
    expect(parseQuantity('   ')).toBeNull()
  })

  it('returns null for zero and negative quantities', () => {
    expect(parseQuantity('0')).toBeNull()
    expect(parseQuantity('-5')).toBeNull()
  })
})
