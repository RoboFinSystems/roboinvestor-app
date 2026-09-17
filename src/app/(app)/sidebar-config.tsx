import type { SidebarItemData } from '@robosystems/core'
import {
  HiBookOpen,
  HiDocumentReport,
  HiDocumentText,
  HiGlobeAlt,
  HiHome,
  HiOutlineOfficeBuilding,
  HiSearch,
  HiTerminal,
} from 'react-icons/hi'
import { TbTrendingUp } from 'react-icons/tb'

interface NavigationOptions {
  /** The currently selected graph is a roboinvestor entity graph (for Entity, Portfolio) */
  hasEntityGraph: boolean
  /** User has any usable graph including shared repositories like SEC (for Console) */
  hasAnyGraph: boolean
}

/**
 * Get navigation items based on graph availability.
 *
 * - Console is available if the user has ANY graph (including shared repositories)
 * - Entity/Portfolio require a roboinvestor entity graph
 */
export const getNavigationItems = ({
  hasEntityGraph,
  hasAnyGraph,
}: NavigationOptions): SidebarItemData[] => {
  const baseItems: SidebarItemData[] = [
    {
      icon: HiHome,
      label: 'Home',
      href: '/home',
    },
  ]

  // Company research: every listed filer's filings, rendered from the public
  // filing catalog on the CDN. No graph is read, so it is never gated. The
  // public research pages on roboinvestor.ai stay external and link out from it.
  const researchItems: SidebarItemData[] = [
    {
      icon: HiDocumentText,
      label: 'Research',
      href: '/companies',
    },
  ]

  const entityItems: SidebarItemData[] = hasEntityGraph
    ? [
        {
          icon: HiOutlineOfficeBuilding,
          label: 'Entity',
          items: [
            { href: '/entity', label: 'Entity Info' },
            { href: '/entities', label: 'All Entities' },
          ],
        },
        {
          icon: TbTrendingUp,
          label: 'Portfolio',
          href: '/portfolio',
        },
        // Reports the fund *received* — distinct from Company Research, which
        // reads the public filing catalog. These live on the fund's own graph,
        // put there by a portfolio company's share, so they belong with the
        // other investor-graph items rather than under Repositories.
        {
          icon: HiDocumentReport,
          label: 'Portfolio Reports',
          href: '/reports',
        },
      ]
    : []

  const graphToolItems: SidebarItemData[] = hasAnyGraph
    ? [
        {
          icon: HiTerminal,
          label: 'Console',
          href: '/console',
        },
        {
          icon: HiSearch,
          label: 'Search',
          href: '/search',
        },
      ]
    : []

  const alwaysVisibleItems: SidebarItemData[] = [
    {
      icon: HiGlobeAlt,
      label: 'Repositories',
      href: '/repositories',
    },
  ]

  // This app has no docs of its own: the platform guides live on robosystems.ai,
  // so the link leaves in a new tab and the app keeps its place. There is no
  // blog here either; the public research pages are reached through Research.
  const tailItems: SidebarItemData[] = [
    {
      icon: HiBookOpen,
      label: 'Docs',
      href: 'https://robosystems.ai/docs/guides',
      target: '_blank',
    },
  ]

  return [
    ...baseItems,
    ...entityItems,
    ...graphToolItems,
    ...researchItems,
    ...alwaysVisibleItems,
    ...tailItems,
  ]
}

// Default export for backward compatibility
export const roboInvestorNavigationItems = getNavigationItems({
  hasEntityGraph: true,
  hasAnyGraph: true,
})

export function useRoboInvestorSidebarConfig(options: NavigationOptions) {
  return {
    navigationItems: getNavigationItems(options),
    features: {
      aiChat: false,
      companyDropdown: false, // RoboInvestor doesn't need company selection
      showOrgSection: false, // Hide My Org in sidebar
    },
  }
}
