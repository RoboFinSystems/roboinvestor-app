'use client'

import type { SidebarItemData } from '@/lib/core'
import type { GraphInfo } from '@robosystems/client'
import {
  HiChartBar,
  HiChip,
  HiCode,
  HiCreditCard,
  HiDatabase,
  HiGlobeAlt,
  HiHome,
  HiTable,
  HiTerminal,
  HiViewGrid,
} from 'react-icons/hi'

/**
 * Get navigation items based on the current graph selection.
 *
 * Some features are disabled for shared repositories:
 * - Schema (read-only, managed internally)
 * - Subgraphs (not applicable)
 * - Data Lake (Duckdb tables and files in S3)
 *
 * Features that work for repositories:
 * - Console (can query shared repository data!)
 * - Usage (shows credit consumption)
 * - Dashboard (limited view)
 * - Backups (download system-generated backups)
 */
export const getNavigationItems = (
  currentGraph: GraphInfo | null
): SidebarItemData[] => {
  const baseItems: SidebarItemData[] = [
    {
      icon: HiHome,
      label: 'Home',
      href: '/home',
    },
  ]

  const hasSelectedGraph = !!currentGraph
  const isRepository = currentGraph?.isRepository ?? false

  // Only show graph-dependent items if a graph is selected
  const graphDependentItems: SidebarItemData[] = hasSelectedGraph
    ? [
        {
          icon: HiViewGrid,
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          icon: HiTerminal,
          label: 'Console',
          href: '/console',
        },
        // Hide these items for repositories (except Backups for downloads)
        ...(!isRepository
          ? [
              {
                icon: HiTable,
                label: 'Data Lake',
                href: '/tables',
              },
              {
                icon: HiCode,
                label: 'Schema',
                href: '/schema',
              },
              {
                icon: HiChip,
                label: 'Subgraphs',
                href: '/subgraphs',
              },
            ]
          : []),
        // Backups available for all graphs (repositories have download-only access)
        {
          icon: HiDatabase,
          label: 'Backups',
          href: '/backups',
        },
        {
          icon: HiChartBar,
          label: 'Usage',
          href: '/usage',
        },
      ]
    : []

  // Always show these items
  const alwaysVisibleItems: SidebarItemData[] = [
    {
      icon: HiGlobeAlt,
      label: 'Repositories',
      href: '/repositories',
    },
    {
      icon: HiCreditCard,
      label: 'Billing',
      href: '/billing',
    },
  ]

  return [...baseItems, ...graphDependentItems, ...alwaysVisibleItems]
}

// Default export for backward compatibility
export const roboSystemsNavigationItems = getNavigationItems(null)
