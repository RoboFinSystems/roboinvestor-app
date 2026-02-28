'use client'

import { EntitySelectorDropdown } from '@/components/EntitySelectorDropdown'
import {
  CoreNavbar,
  CoreSidebar,
  CURRENT_APP,
  GraphFilters,
  onlyRepositories,
  useGraphContext,
} from '@/lib/core'
import { useMemo } from 'react'
import { LayoutContent } from './layout-content'
import { useRoboInvestorSidebarConfig } from './sidebar-config'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { state } = useGraphContext()

  // Roboinvestor entity graphs (for Entity, Portfolio)
  const hasEntityGraph = useMemo(
    () => state.graphs.filter(GraphFilters.roboinvestor).length > 0,
    [state.graphs]
  )

  // Roboinvestor graphs OR shared repositories like SEC (for Console)
  const hasAnyGraph = useMemo(
    () =>
      state.graphs.filter(GraphFilters.roboinvestor).length > 0 ||
      state.graphs.filter(onlyRepositories).length > 0,
    [state.graphs]
  )

  const sidebarConfig = useRoboInvestorSidebarConfig({
    hasEntityGraph,
    hasAnyGraph,
  })

  return (
    <>
      <CoreNavbar
        appName="RoboInvestor"
        currentApp={CURRENT_APP}
        borderColorClass="dark:border-gray-800"
        additionalComponents={<EntitySelectorDropdown />}
      />
      <div className="mt-16 flex items-start">
        <CoreSidebar
          navigationItems={sidebarConfig.navigationItems}
          features={sidebarConfig.features}
          borderColorClass="dark:border-gray-800"
        />
        <LayoutContent>{children}</LayoutContent>
      </div>
    </>
  )
}
