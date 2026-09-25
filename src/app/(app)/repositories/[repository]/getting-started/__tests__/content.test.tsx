import { createUserApiKey } from '@robosystems/client/sdk'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiKeysContent } from '../content'

const showError = vi.hoisted(() => vi.fn())
const showSuccess = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    useGraphContext: () => ({ setCurrentGraph: vi.fn() }),
    useServiceOfferings: () => ({ offerings: null }),
    useToast: () => ({
      showSuccess,
      showError,
      showWarning: vi.fn(),
      ToastContainer: () => null,
    }),
  }
})

describe('ApiKeysContent key generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('shows the API’s refusal detail', async () => {
    // The SDK resolves an HTTP error rather than rejecting.
    vi.mocked(createUserApiKey).mockResolvedValueOnce({
      data: undefined,
      error: { detail: 'API key limit reached' },
      response: { status: 400 },
    } as never)

    render(<ApiKeysContent repository="sec" />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate API Key' }))

    await waitFor(() =>
      expect(showError).toHaveBeenCalledWith(
        'Failed to create API key: API key limit reached'
      )
    )
    expect(showSuccess).not.toHaveBeenCalled()
  })
})
