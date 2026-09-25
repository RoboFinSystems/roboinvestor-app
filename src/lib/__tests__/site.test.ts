import { describe, expect, it } from 'vitest'
import { landingMetadata } from '../../app/(landing)/metadata'
import { SITE_DESCRIPTION, SITE_TITLE } from '../site'
import { siteJsonLd, softwareJsonLd, websiteJsonLd } from '../structured-data'

describe('homepage identity', () => {
  it('says one thing everywhere, short enough to show whole', () => {
    expect(landingMetadata.title).toBe(SITE_TITLE)
    expect(landingMetadata.description).toBe(SITE_DESCRIPTION)
    expect(websiteJsonLd.description).toBe(SITE_DESCRIPTION)
    expect(softwareJsonLd.description).toBe(SITE_DESCRIPTION)
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160)
  })

  // A price of 0 told search engines the app was free. It is not.
  it('does not advertise a price', () => {
    expect(softwareJsonLd).not.toHaveProperty('offers')
  })

  // robosystems.ai declares this @id; every Robo* site names it as publisher.
  it('is published by the RoboSystems organization', () => {
    const orgId = 'https://robosystems.ai/#organization'
    expect(siteJsonLd['@graph'][0]['@id']).toBe(orgId)
    expect(websiteJsonLd.publisher['@id']).toBe(orgId)
    expect(softwareJsonLd.publisher['@id']).toBe(orgId)
  })
})
