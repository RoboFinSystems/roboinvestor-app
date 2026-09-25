import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AppError from '../(app)/error'
import RootError from '../error'

describe('error boundaries', () => {
  it.each([
    ['root', RootError],
    ['app', AppError],
  ])('the %s boundary offers a retry', (_name, Boundary) => {
    const reset = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<Boundary error={new Error('boom')} reset={reset} />)
    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }))
    expect(reset).toHaveBeenCalled()
  })
})
