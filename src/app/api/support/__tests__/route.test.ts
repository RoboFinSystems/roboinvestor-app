import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// SNS is the delivery path for both forms; a failed publish must reach the
// user as an error, never as "sent".
const publishContactForm = vi.hoisted(() => vi.fn())
vi.mock('@/lib/sns', () => ({ snsService: { publishContactForm } }))
vi.mock('@/lib/turnstile-server', async () => ({
  ...(await vi.importActual('@/lib/turnstile-server')),
  isCaptchaRequired: () => false,
}))

let ipCounter = 0
function post(path: string, body: unknown, ip?: string): NextRequest {
  return new NextRequest(`https://roboinvestor.ai${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip ?? `198.51.100.${++ipCounter}`,
    },
    body: JSON.stringify(body),
  })
}

const supportBody = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Help',
  message: 'Something broke',
}
const contactBody = {
  name: 'Ada',
  email: 'ada@example.com',
  company: 'Acme',
  message: 'Hello',
  type: 'general',
}

describe('support and contact delivery', () => {
  beforeEach(() => {
    vi.resetModules()
    publishContactForm.mockReset()
    publishContactForm.mockResolvedValue(true)
  })

  it('support answers 503 when the message was not delivered', async () => {
    publishContactForm.mockResolvedValue(false)
    const { POST } = await import('../route')
    const res = await POST(post('/api/support', supportBody))
    expect(res.status).toBe(503)
    expect((await res.json()).code).toBe('SUBMISSION_NOT_DELIVERED')
  })

  it('contact answers 503 when the message was not delivered', async () => {
    publishContactForm.mockResolvedValue(false)
    const { POST } = await import('../../contact/route')
    const res = await POST(post('/api/contact', contactBody))
    expect(res.status).toBe(503)
  })

  it('support answers 200 when delivered', async () => {
    const { POST } = await import('../route')
    const res = await POST(post('/api/support', supportBody))
    expect(res.status).toBe(200)
  })

  it('bounds and types the support metadata it forwards', async () => {
    const { POST } = await import('../route')
    await POST(
      post('/api/support', {
        ...supportBody,
        metadata: {
          orgName: 'Acme',
          graphId: { nested: 'object' },
          graphName: 'x'.repeat(10_000),
          userRole: ['admin'],
        },
      })
    )
    const { message, company } = publishContactForm.mock.calls[0][0]
    expect(company).toBe('Acme')
    expect(message).toContain('Organization: Acme')
    expect(message).not.toContain('[object Object]')
    expect(message).not.toContain('admin')
    expect(message).not.toContain('x'.repeat(201))
  })

  it('gives support its own limit, untouched by contact submissions', async () => {
    const contact = (await import('../../contact/route')).POST
    const support = (await import('../route')).POST
    const ip = '203.0.113.50'
    for (let i = 0; i < 6; i++) {
      await contact(post('/api/contact', contactBody, ip))
    }
    const res = await support(post('/api/support', supportBody, ip))
    expect(res.status).toBe(200)
  })
})
