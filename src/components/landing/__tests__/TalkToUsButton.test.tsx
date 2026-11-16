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

import TalkToUsButton from '../TalkToUsButton'

describe('TalkToUsButton', () => {
  it('opens the contact form as a RoboInvestor conversation', () => {
    render(<TalkToUsButton />)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Talk to us' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Talk to us about RoboInvestor')
    expect(dialog).toHaveAttribute('data-form-type', 'roboinvestor')
  })
})
