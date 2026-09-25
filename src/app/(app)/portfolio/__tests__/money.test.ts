import { describe, expect, it } from 'vitest'
import { parseMoneyToCents, parseQuantity } from '../money'

describe('parseMoneyToCents', () => {
  it('converts dollars to integer cents', () => {
    expect(parseMoneyToCents('1525.50')).toBe(152550)
  })

  it('refuses more than two decimal places rather than guessing', () => {
    // `1.525` is a European thousands group as often as it is dollars.
    expect(parseMoneyToCents('10.005')).toBeNull()
    expect(parseMoneyToCents('1.525')).toBeNull()
  })

  it('absorbs float drift on values that are not exactly representable', () => {
    // 1.15 * 100 is 114.99999999999999 in IEEE 754.
    expect(parseMoneyToCents('1.15')).toBe(115)
    expect(parseMoneyToCents('8.87')).toBe(887)
  })

  it('reads US thousands separators and a leading dollar sign', () => {
    // parseFloat('1,525.50') returns 1 — booking $1.00 for a $1,525.50 lot.
    expect(parseMoneyToCents('1,525.50')).toBe(152550)
    expect(parseMoneyToCents('$150,000')).toBe(15000000)
    expect(parseMoneyToCents('$100')).toBe(10000)
  })

  it('treats only an empty field as no cost basis', () => {
    expect(parseMoneyToCents('')).toBe(0)
    expect(parseMoneyToCents('   ')).toBe(0)
  })

  it('refuses input it cannot read one way only', () => {
    expect(parseMoneyToCents('abc')).toBeNull()
    expect(parseMoneyToCents('1.525,50')).toBeNull()
    expect(parseMoneyToCents('1 525,50')).toBeNull()
    expect(parseMoneyToCents('15,25')).toBeNull()
    expect(parseMoneyToCents('1,52,500')).toBeNull()
    expect(parseMoneyToCents('USD 1,525')).toBeNull()
    expect(parseMoneyToCents('1e17')).toBeNull()
  })

  it('refuses a negative cost basis', () => {
    expect(parseMoneyToCents('-1500')).toBeNull()
  })

  it('refuses an amount past the integer range the API stores', () => {
    expect(parseMoneyToCents('99999999999999999999')).toBeNull()
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
    expect(parseQuantity('10,5')).toBeNull()
    expect(parseQuantity('1.000,5')).toBeNull()
    expect(parseQuantity('$10')).toBeNull()
    expect(parseQuantity('')).toBeNull()
    expect(parseQuantity('   ')).toBeNull()
  })

  it('reads US thousands separators', () => {
    expect(parseQuantity('10,000')).toBe(10000)
  })

  it('returns null for zero and negative quantities', () => {
    expect(parseQuantity('0')).toBeNull()
    expect(parseQuantity('-5')).toBeNull()
  })
})
