import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '../route'

const BUCKET = 'robosystems-123456789012-user-prod'
const URL_OK =
  `https://${BUCKET}.s3.amazonaws.com/report-bundles/g/r/g1.holon.jsonld` +
  '?X-Amz-Credential=c&X-Amz-Signature=s&X-Amz-Expires=300'

function post(
  body: string,
  headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: 'Bearer tok',
  }
): NextRequest {
  return new NextRequest('https://roboinvestor.ai/api/reports/holon', {
    method: 'POST',
    headers,
    body,
  })
}

function expectSafeHeaders(res: Response) {
  expect(res.headers.get('x-content-type-options')).toBe('nosniff')
  expect(res.headers.get('content-security-policy')).toBe(
    "default-src 'none'; sandbox"
  )
}

describe('POST /api/reports/holon', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('REPORT_BUNDLE_BUCKET', BUCKET)
    vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', '')
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('refuses a non-JSON request with 415', async () => {
    const res = await POST(
      post(JSON.stringify({ url: URL_OK }), {
        'content-type': 'text/plain',
        authorization: 'Bearer tok',
      })
    )
    expect(res.status).toBe(415)
    expectSafeHeaders(res)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a request without a Bearer Authorization header with 401', async () => {
    const res = await POST(
      post(JSON.stringify({ url: URL_OK }), {
        'content-type': 'application/json',
      })
    )
    expect(res.status).toBe(401)
    expectSafeHeaders(res)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a URL outside the bundle bucket', async () => {
    const res = await POST(
      post(
        JSON.stringify({
          url: URL_OK.replace(`${BUCKET}.s3`, 'abc.execute-api.us-east-1'),
        })
      )
    )
    expect(res.status).toBe(400)
    expectSafeHeaders(res)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('serves the bundle with a suffix-derived type, never upstream’s', async () => {
    fetchMock.mockResolvedValue(
      new Response('{"@graph":[]}', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      })
    )
    const res = await POST(post(JSON.stringify({ url: URL_OK })))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe(
      'application/ld+json; charset=utf-8'
    )
    expectSafeHeaders(res)
    expect(await res.text()).toBe('{"@graph":[]}')
    expect(fetchMock).toHaveBeenCalledWith(URL_OK, { redirect: 'manual' })
  })

  it('does not follow an upstream redirect', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { location: 'https://evil.test/' },
      })
    )
    const res = await POST(post(JSON.stringify({ url: URL_OK })))
    expect(res.status).toBe(502)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('carries the safe headers on an upstream failure', async () => {
    fetchMock.mockResolvedValue(new Response('no', { status: 403 }))
    const res = await POST(post(JSON.stringify({ url: URL_OK })))
    expect(res.status).toBe(502)
    expectSafeHeaders(res)
  })
})
