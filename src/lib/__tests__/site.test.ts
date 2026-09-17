import { describe, expect, it } from 'vitest'
import { landingMetadata } from '../../app/(landing)/metadata'
import { SITE_DESCRIPTION, SITE_TITLE } from '../site'
import { organizationJsonLd, softwareJsonLd } from '../structured-data'

describe('homepage identity', () => {
  it('says one thing everywhere, short enough to show whole', () => {
    expect(landingMetadata.title).toBe(SITE_TITLE)
    expect(landingMetadata.description).toBe(SITE_DESCRIPTION)
    expect(organizationJsonLd.description).toBe(SITE_DESCRIPTION)
    expect(softwareJsonLd.description).toBe(SITE_DESCRIPTION)
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160)
  })

  // A price of 0 told search engines the app was free. It is not.
  it('does not advertise a price', () => {
    expect(softwareJsonLd).not.toHaveProperty('offers')
  })
})
