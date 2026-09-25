import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

const written = vi.hoisted(() => ({ value: null as unknown }))
vi.mock('@robosystems/core/lib', () => ({
  sidebarCookie: {
    // Resolves on a later tick, like the real `cookies()`-backed setter.
    set: vi.fn(
      (value: unknown) =>
        new Promise<void>((resolve) =>
          setTimeout(() => {
            written.value = value
            resolve()
          }, 5)
        )
    ),
  },
}))

import { POST } from '../route'

describe('POST /api/session/sidebar', () => {
  it('writes the cookie before it responds', async () => {
    const res = await POST(
      new NextRequest('https://roboinvestor.ai/api/session/sidebar', {
        method: 'POST',
        body: JSON.stringify({ isCollapsed: true }),
      })
    )
    expect(res.status).toBe(200)
    expect(written.value).toEqual({ isCollapsed: true })
  })
})
