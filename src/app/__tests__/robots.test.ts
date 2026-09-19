import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import robots from '../robots'

// Every page in the (app) route group sits behind sign-in, so each top-level segment
// belongs in the disallow list. Reading the route group rather than a hand-kept list
// means a new signed-in page fails here until robots.ts names it: /companies and
// /reports shipped without an entry.
const appGroup = join(dirname(fileURLToPath(import.meta.url)), '..', '(app)')

const appSegments = readdirSync(appGroup, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== '__tests__')
  .map((entry) => entry.name)

describe('robots', () => {
  const disallow = [robots().rules]
    .flat()
    .flatMap((rule) => [rule.disallow ?? []].flat())

  it.each(appSegments)(
    'keeps crawlers off the signed-in /%s route',
    (segment) => {
      expect(disallow).toContain(`/${segment}/`)
    }
  )

  it('leaves the public research pages crawlable', () => {
    expect(disallow.some((path) => path.startsWith('/research'))).toBe(false)
  })
})
