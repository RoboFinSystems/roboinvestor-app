/** 25 MB — holons are well under this; a hard cap bounds the proxy. */
export const MAX_HOLON_BYTES = 25 * 1024 * 1024

/** Key prefix report bundles live under inside the bundle bucket. */
const BUNDLE_PREFIX = 'report-bundles/'

/**
 * Artifact suffixes this proxy serves, and the content type each is returned
 * with. The response type is derived from the suffix alone — never from the
 * upstream response.
 */
const SUFFIX_CONTENT_TYPES: ReadonlyArray<readonly [string, string]> = [
  ['.holon.jsonld', 'application/ld+json; charset=utf-8'],
]

export function contentTypeForPath(pathname: string): string | null {
  for (const [suffix, type] of SUFFIX_CONTENT_TYPES) {
    if (pathname.endsWith(suffix)) return type
  }
  return null
}

/** The bucket report bundles are presigned from (server env, never public). */
function bundleBucket(): string | null {
  const bucket = process.env.REPORT_BUNDLE_BUCKET?.trim().toLowerCase()
  return bucket ? bucket : null
}

/**
 * The S3 endpoint override (LocalStack in local development), if any. Read per
 * call rather than at module load so a runtime env change (and tests) take
 * effect without a rebuild.
 */
function overrideHost(): string | null {
  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT_URL
  if (!endpoint) return null
  try {
    return new URL(endpoint).hostname.toLowerCase()
  } catch {
    return null
  }
}

const REGION = '[a-z0-9-]+'
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * The key (path without the leading slash) the URL addresses inside the bundle
 * bucket, or null when the host/path pair is not that bucket. Virtual-hosted
 * (`<bucket>.s3[.<region>].amazonaws.com/<key>`) and path-style
 * (`s3[.<region>].amazonaws.com/<bucket>/<key>`) are both accepted.
 */
function bucketKey(
  host: string,
  pathname: string,
  bucket: string
): string | null {
  const b = escapeRe(bucket)
  if (new RegExp(`^${b}\\.s3(\\.${REGION})?\\.amazonaws\\.com$`).test(host)) {
    return pathname.slice(1)
  }
  if (new RegExp(`^s3(\\.${REGION})?\\.amazonaws\\.com$`).test(host)) {
    const prefix = `/${bucket}/`
    return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : null
  }
  return null
}

/**
 * Key inside the LocalStack endpoint: path-style, so `/<bucket>/<key>`. With a
 * configured bucket the segment must match it; without one (development only)
 * any single bucket segment is accepted.
 */
function overrideKey(pathname: string, bucket: string | null): string | null {
  if (bucket) {
    const prefix = `/${bucket}/`
    return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : null
  }
  const match = /^\/[^/]+\/(.*)$/.exec(pathname)
  return match ? match[1] : null
}

/**
 * Guard for the holon proxy: accept a URL only if it addresses a report-bundle
 * artifact in the bundle bucket and carries a non-empty presigned signature.
 * Returns the parsed URL when allowed, else null.
 *
 * Fails closed: in production an unset `REPORT_BUNDLE_BUCKET` accepts nothing;
 * outside production it accepts only the configured endpoint override.
 */
export function allowedHolonUrl(raw: string): URL | null {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  if (u.username || u.password) return null

  const host = u.hostname.toLowerCase()
  const bucket = bundleBucket()
  const override = overrideHost()
  const isProduction = process.env.NODE_ENV === 'production'

  let key: string | null = null
  if (override && host === override) {
    if (isProduction && !bucket) return null
    key = overrideKey(u.pathname, bucket)
  } else {
    // Plaintext is tolerated only for the explicitly configured endpoint.
    if (u.protocol !== 'https:' || !bucket) return null
    key = bucketKey(host, u.pathname, bucket)
  }
  if (key === null) return null

  if (!key.startsWith(BUNDLE_PREFIX)) return null
  if (key.split('/').some((seg) => seg === '..' || seg === '.')) return null
  if (!contentTypeForPath(u.pathname)) return null

  // The signature is the caller's actual capability, so require real values —
  // `?X-Amz-Signature=` with an empty value must not count as signed.
  const q = u.searchParams
  const present = (...keys: string[]) =>
    keys.some((k) => (q.get(k) ?? '') !== '')
  const signed =
    present('Signature', 'X-Amz-Signature') &&
    present('Expires', 'X-Amz-Expires') &&
    present('AWSAccessKeyId', 'X-Amz-Credential')
  if (!signed) return null

  return u
}
