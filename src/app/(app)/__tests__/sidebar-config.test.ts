import { describe, expect, it } from 'vitest'
import { getNavigationItems } from '../sidebar-config'

describe('getNavigationItems', () => {
  it.each([
    ['no graph', { hasEntityGraph: false, hasAnyGraph: false }],
    ['a shared repository only', { hasEntityGraph: false, hasAnyGraph: true }],
    ['an entity graph', { hasEntityGraph: true, hasAnyGraph: true }],
  ])('ends with the platform Docs in a new tab with %s', (_, options) => {
    const items = getNavigationItems(options)
    const docs = items.at(-1)

    expect(docs).toMatchObject({
      label: 'Docs',
      href: 'https://robosystems.ai/docs/guides',
      target: '_blank',
    })
    expect(docs?.icon).toBeDefined()
  })

  it('keeps Repositories directly above Docs and links no blog', () => {
    const labels = getNavigationItems({
      hasEntityGraph: true,
      hasAnyGraph: true,
    }).map((item) => item.label)

    expect(labels.slice(-2)).toEqual(['Repositories', 'Docs'])
    expect(labels).not.toContain('Blog')
  })
})
