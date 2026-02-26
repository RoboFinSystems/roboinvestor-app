import type { SidebarItemData } from '@/lib/core'
import {
  HiGlobeAlt,
  HiHome,
  HiOutlineOfficeBuilding,
  HiTerminal,
} from 'react-icons/hi'
import { TbTrendingUp } from 'react-icons/tb'

interface NavigationOptions {
  /** User has a roboinvestor entity graph (for Entity, Portfolio) */
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

  const consoleItem: SidebarItemData[] = hasAnyGraph
    ? [
        {
          icon: HiTerminal,
          label: 'Console',
          href: '/console',
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

  return [...baseItems, ...entityItems, ...consoleItem, ...alwaysVisibleItems]
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
