import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../ContactModal', () => ({
  default: (props: { isOpen: boolean; title?: string; formType?: string }) =>
    props.isOpen ? (
      <div role="dialog" data-form-type={props.formType}>
        {props.title}
      </div>
    ) : null,
}))

import EarlyAccessButton from '../EarlyAccessButton'

describe('EarlyAccessButton', () => {
  it('opens the contact form as an early-access request', () => {
    render(<EarlyAccessButton />)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(
      screen.getByRole('button', { name: 'Talk to us about early access' })
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Early access to RoboInvestor')
    expect(dialog).toHaveAttribute('data-form-type', 'early-access')
  })
})
