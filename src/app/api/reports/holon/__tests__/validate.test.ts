import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { allowedHolonUrl, contentTypeForPath } from '../validate'

// A realistic LocalStack presigned holon URL (shape mirrors the live one).
const VALID =
  'http://localhost:4566/robosystems-user/report-bundles/kg19f333/rpt_01ABC/g1.holon.jsonld' +
  '?response-content-type=application%2Fld%2Bjson&AWSAccessKeyId=test&Signature=abc%3D&Expires=1783315210'

const SIG = 'X-Amz-Credential=cred&X-Amz-Signature=sig&X-Amz-Expires=300'
const BUCKET = 'robosystems-123456789012-user-prod'
const KEY = 'report-bundles/g/r/g1.holon.jsonld'

describe('allowedHolonUrl', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('REPORT_BUNDLE_BUCKET', BUCKET)
    vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('the bundle bucket', () => {
    it.each([
      ['virtual-hosted, global', `https://${BUCKET}.s3.amazonaws.com/${KEY}`],
      [
        'virtual-hosted, regional',
        `https://${BUCKET}.s3.us-east-1.amazonaws.com/${KEY}`,
      ],
      ['path-style, global', `https://s3.amazonaws.com/${BUCKET}/${KEY}`],
      [
        'path-style, regional',
        `https://s3.us-east-1.amazonaws.com/${BUCKET}/${KEY}`,
      ],
    ])('accepts the %s form', (_label, url) => {
      expect(allowedHolonUrl(`${url}?${SIG}`)).not.toBeNull()
    })

    it('accepts legacy (SigV2) signature params', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.amazonaws.com/${KEY}?AWSAccessKeyId=a&Signature=s&Expires=1`
        )
      ).not.toBeNull()
    })
  })

  describe('the fetch target', () => {
    it('refuses a regional host outside the deployment region', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.eu-west-1.amazonaws.com/${KEY}?${SIG}`
        )
      ).toBeNull()
    })

    it('follows AWS_REGION for the regional host', () => {
      vi.stubEnv('AWS_REGION', 'eu-west-1')
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.eu-west-1.amazonaws.com/${KEY}?${SIG}`
        )
      ).not.toBeNull()
    })

    it.each([
      `https://${BUCKET}.s3.amazonaws.com/${KEY}?${SIG}`,
      `https://s3.us-east-1.amazonaws.com/${BUCKET}/${KEY}?${SIG}`,
    ])('returns the URL unchanged so its signature still holds: %s', (url) => {
      expect(allowedHolonUrl(url)?.toString()).toBe(url)
    })
  })

  describe('host pinning', () => {
    it.each([
      [
        'an API Gateway host',
        `https://abc.execute-api.us-east-1.amazonaws.com/${KEY}`,
      ],
      [
        'an internal load balancer host',
        `https://internal-x.us-east-1.elb.amazonaws.com/${KEY}`,
      ],
      [
        'another bucket, virtual-hosted',
        `https://other-bucket.s3.amazonaws.com/${KEY}`,
      ],
      [
        'another bucket, path-style',
        `https://s3.amazonaws.com/other-bucket/${KEY}`,
      ],
      [
        'a bucket that only starts with the configured name',
        `https://${BUCKET}-evil.s3.amazonaws.com/${KEY}`,
      ],
      [
        'a host that nests the bucket host',
        `https://${BUCKET}.s3.amazonaws.com.evil.test/${KEY}`,
      ],
      ['the instance metadata endpoint', `http://169.254.169.254/${KEY}`],
      ['an arbitrary host', `https://evil.test/${KEY}`],
    ])('rejects %s', (_label, url) => {
      expect(allowedHolonUrl(`${url}?${SIG}`)).toBeNull()
    })

    it('rejects plaintext to the bucket', () => {
      expect(
        allowedHolonUrl(`http://${BUCKET}.s3.amazonaws.com/${KEY}?${SIG}`)
      ).toBeNull()
    })

    it('rejects an explicit port on the bucket host', () => {
      expect(
        allowedHolonUrl(`https://${BUCKET}.s3.amazonaws.com:8443/${KEY}?${SIG}`)
      ).toBeNull()
    })

    it('rejects a trailing-dot host', () => {
      expect(
        allowedHolonUrl(`https://${BUCKET}.s3.amazonaws.com./${KEY}?${SIG}`)
      ).toBeNull()
    })

    it('rejects a dot-segment walk out of the prefix', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.amazonaws.com/report-bundles/%2e%2e/user-staging/g1.holon.jsonld?${SIG}`
        )
      ).toBeNull()
    })

    it('rejects credentials embedded in the URL', () => {
      expect(
        allowedHolonUrl(`https://u:p@${BUCKET}.s3.amazonaws.com/${KEY}?${SIG}`)
      ).toBeNull()
    })
  })

  describe('key pinning', () => {
    it('rejects an object outside the report-bundles prefix', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.amazonaws.com/user-staging/x/g1.holon.jsonld?${SIG}`
        )
      ).toBeNull()
      expect(
        allowedHolonUrl(
          `https://s3.amazonaws.com/${BUCKET}/graph-backups/report-bundles/x.holon.jsonld?${SIG}`
        )
      ).toBeNull()
    })

    it('rejects a non-holon suffix', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.amazonaws.com/report-bundles/g/r/secrets.env?${SIG}`
        )
      ).toBeNull()
    })

    it('rejects a URL without a signature', () => {
      expect(
        allowedHolonUrl(`https://${BUCKET}.s3.amazonaws.com/${KEY}`)
      ).toBeNull()
    })

    it('rejects a signature param present but empty', () => {
      expect(
        allowedHolonUrl(
          `https://${BUCKET}.s3.amazonaws.com/${KEY}?X-Amz-Credential=c&X-Amz-Signature=&X-Amz-Expires=300`
        )
      ).toBeNull()
    })

    it('rejects non-http(s) protocols and garbage', () => {
      expect(allowedHolonUrl(`file:///${KEY}?${SIG}`)).toBeNull()
      expect(allowedHolonUrl('not a url')).toBeNull()
      expect(allowedHolonUrl('')).toBeNull()
    })
  })

  describe('fail closed', () => {
    it('accepts no AWS host when the bucket is unset', () => {
      vi.stubEnv('REPORT_BUNDLE_BUCKET', '')
      expect(
        allowedHolonUrl(`https://${BUCKET}.s3.amazonaws.com/${KEY}?${SIG}`)
      ).toBeNull()
    })

    it('accepts the endpoint override in a production build with the bucket unset', () => {
      // `next build` bakes NODE_ENV=production into server code, so the local
      // compose stack and the Docker Hub image run as production against
      // LocalStack. A real deployment carries no override.
      vi.stubEnv('REPORT_BUNDLE_BUCKET', '')
      vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', 'http://localhost:4566')
      expect(allowedHolonUrl(VALID)).not.toBeNull()
    })

    it('accepts only the endpoint override in development when the bucket is unset', () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('REPORT_BUNDLE_BUCKET', '')
      vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', 'http://localhost:4566')
      expect(allowedHolonUrl(VALID)).not.toBeNull()
      expect(
        allowedHolonUrl(`https://${BUCKET}.s3.amazonaws.com/${KEY}?${SIG}`)
      ).toBeNull()
    })

    it('pins the override path to the bucket when one is configured', () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('REPORT_BUNDLE_BUCKET', 'robosystems-user')
      vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', 'http://localhost:4566')
      expect(allowedHolonUrl(VALID)).not.toBeNull()
      expect(
        allowedHolonUrl(
          `http://localhost:4566/other/report-bundles/g/r/g1.holon.jsonld?${SIG}`
        )
      ).toBeNull()
    })

    it('pins the override to its port and protocol', () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_S3_ENDPOINT_URL', 'http://localhost:4566')
      expect(allowedHolonUrl(VALID.replace(':4566', ':3001'))).toBeNull()
      expect(allowedHolonUrl(VALID.replace('http:', 'https:'))).toBeNull()
    })

    it('rejects loopback when no endpoint override is configured', () => {
      vi.stubEnv('NODE_ENV', 'development')
      expect(allowedHolonUrl(VALID)).toBeNull()
    })
  })
})

describe('contentTypeForPath', () => {
  it('derives the type from the suffix', () => {
    expect(contentTypeForPath('/report-bundles/g/r/g1.holon.jsonld')).toBe(
      'application/ld+json; charset=utf-8'
    )
    expect(contentTypeForPath('/report-bundles/g/r/g1.html')).toBeNull()
  })
})
