import type { NextRequest } from 'next/server'
import {
  allowedHolonUrl,
  contentTypeForPath,
  MAX_HOLON_BYTES,
} from './validate'

/**
 * Same-origin proxy for a Report's holon JSON-LD bundle.
 *
 * The holon is served only as a presigned S3 *attachment* URL from a bucket
 * with no CORS, so a browser `fetch()` of it is blocked cross-origin. The
 * client obtains that presigned URL via the authenticated SDK
 * (`getReportDownloadUrl`, format `HOLON_JSONLD`) and hands it here; the
 * server fetches it (server→S3 isn't subject to browser CORS) and streams the
 * body back same-origin so `parseJsonld` can consume it.
 *
 * The proxy is deliberately narrow: the caller must send JSON with an
 * Authorization header, `allowedHolonUrl` pins the target to the report-bundle bucket (see
 * ./validate), redirects are not followed, the body is capped while streaming,
 * and the response type comes from the artifact suffix, never from upstream.
 */

/**
 * Read the body while counting bytes, aborting as soon as the cap is exceeded
 * so an oversized (or endless) upstream can't be buffered into memory. Returns
 * null when the cap is hit.
 */
async function readCapped(
  upstream: Response,
  maxBytes: number
): Promise<string | null> {
  if (!upstream.body) return ''
  const reader = upstream.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const joined = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    joined.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(joined)
}

/** Headers every response from this route carries, success or refusal. */
const SAFE_HEADERS = {
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'; sandbox",
  'cache-control': 'private, no-store',
} as const

function refuse(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: SAFE_HEADERS })
}

function isJsonRequest(req: NextRequest): boolean {
  const type = req.headers.get('content-type') ?? ''
  return type.split(';')[0].trim().toLowerCase() === 'application/json'
}

/**
 * Whether the request carries a Bearer Authorization header. The token is not
 * validated here: a cross-site form cannot set this header, which is all this
 * guards. The presigned signature is the access control.
 */
function hasBearerHeader(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? ''
  return /^Bearer\s+\S+/i.test(auth)
}

export async function POST(req: NextRequest) {
  if (!isJsonRequest(req)) {
    return refuse('Content-Type must be application/json', 415)
  }
  if (!hasBearerHeader(req)) {
    return refuse('Bearer Authorization header required', 401)
  }

  let body: { url?: unknown }
  try {
    body = (await req.json()) as { url?: unknown }
  } catch {
    return refuse('Invalid request body', 400)
  }

  if (typeof body?.url !== 'string' || !body.url) {
    return refuse('Missing url', 400)
  }

  const target = allowedHolonUrl(body.url)
  const contentType = target ? contentTypeForPath(target.pathname) : null
  if (!target || !contentType) {
    return refuse('URL is not an allowed holon bundle URL', 400)
  }

  let upstream: Response
  try {
    // `manual` keeps a redirect from relocating the fetch to a host that
    // allowedHolonUrl never vetted; a 3xx simply fails the !ok check below.
    upstream = await fetch(target.toString(), { redirect: 'manual' })
  } catch {
    return refuse('Upstream fetch failed', 502)
  }

  if (!upstream.ok) {
    return refuse(`Upstream returned ${upstream.status}`, 502)
  }

  const declaredLen = Number(upstream.headers.get('content-length') ?? '0')
  if (declaredLen > MAX_HOLON_BYTES) {
    return refuse('Holon exceeds size limit', 413)
  }

  const text = await readCapped(upstream, MAX_HOLON_BYTES)
  if (text === null) {
    return refuse('Holon exceeds size limit', 413)
  }

  return new Response(text, {
    status: 200,
    headers: { ...SAFE_HEADERS, 'content-type': contentType },
  })
}
