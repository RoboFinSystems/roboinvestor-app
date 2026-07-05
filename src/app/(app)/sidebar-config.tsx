import type { SidebarItemData } from '@/lib/core'
import {
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
  /** User has a roboinvestor entity graph (for Entity, Portfolio) */
  hasEntityGraph: boolean
  /** User has any usable graph including shared repositories like SEC (for Console) */
  hasAnyGraph: boolean
  /**
   * Repository id of the selected shared repository when it exposes the filing
   * viewer (i.e. the SEC repository), else null. Drives the "Reports" item, which
   * is contextual to that repository being the active graph.
   */
  reportsRepositoryId?: string | null
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
  reportsRepositoryId,
}: NavigationOptions): SidebarItemData[] => {
  const baseItems: SidebarItemData[] = [
    {
      icon: HiHome,
      label: 'Home',
      href: '/home',
    },
  ]

  const researchItems: SidebarItemData[] = [
    {
      icon: HiDocumentText,
      label: 'Research',
      href: '/research',
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

  // The filing viewer, shown only while its repository (SEC) is the active graph.
  const reportItems: SidebarItemData[] = reportsRepositoryId
    ? [
        {
          icon: HiDocumentReport,
          label: 'Reports',
          href: `/repositories/${reportsRepositoryId}/reports`,
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

  return [
    ...baseItems,
    ...entityItems,
    ...graphToolItems,
    ...reportItems,
    ...researchItems,
    ...alwaysVisibleItems,
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
