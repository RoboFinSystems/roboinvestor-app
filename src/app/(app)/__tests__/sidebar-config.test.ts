import { describe, expect, it } from 'vitest'
import { getNavigationItems } from '../sidebar-config'

const states = [
  ['no graph', { hasEntityGraph: false, hasAnyGraph: false }],
  ['a repository only', { hasEntityGraph: false, hasAnyGraph: true }],
  ['an entity graph', { hasEntityGraph: true, hasAnyGraph: true }],
] as const

describe('getNavigationItems', () => {
  it('ends with Repositories', () => {
    const labels = getNavigationItems(states[2][1]).map((item) => item.label)

    expect(labels[labels.length - 1]).toBe('Repositories')
  })

  // The docs are reached from the user menu (core's CoreNavbar) and from the page
  // each guide explains; the sidebar carries none.
  it.each(states)('links no docs page with %s', (_, options) => {
    const hrefs = getNavigationItems(options).flatMap((item) => [
      item.href,
      ...(item.items ?? []).map((child) => child.href),
    ])

    expect(hrefs.some((href) => href?.includes('/docs'))).toBe(false)
  })
})
