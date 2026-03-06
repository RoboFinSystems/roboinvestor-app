'use client'

import { EntitySelectorDropdown } from '@/components/EntitySelectorDropdown'
import SupportModal from '@/components/app/SupportModal'
import {
  CoreNavbar,
  CoreSidebar,
  CURRENT_APP,
  GraphFilters,
  onlyRepositories,
  useGraphContext,
  useOrg,
} from '@/lib/core'
import { useMemo, useState } from 'react'
import { HiExclamationCircle, HiMail } from 'react-icons/hi'
import { LayoutContent } from './layout-content'
import { useRoboInvestorSidebarConfig } from './sidebar-config'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { state } = useGraphContext()
  const { currentOrg } = useOrg()
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const currentGraph =
    state.graphs.find((g) => g.graphId === state.currentGraphId) || null

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
          bottomMenuActions={[
            {
              label: 'Support',
              icon: HiMail,
              onClick: () => setIsSupportOpen(true),
              tooltip: 'Contact Support',
            },
            {
              label: 'Issues',
              icon: HiExclamationCircle,
              onClick: () =>
                window.open(
                  'https://github.com/RoboFinSystems/robosystems/issues',
                  '_blank'
                ),
              tooltip: 'Report an Issue',
            },
          ]}
          borderColorClass="dark:border-gray-800"
        />
        <LayoutContent>{children}</LayoutContent>
      </div>
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        metadata={{
          graphId: currentGraph?.graphId,
          graphName: currentGraph?.graphName,
          orgId: currentOrg?.id,
          orgName: currentOrg?.name,
          orgType: currentOrg?.org_type,
          userRole: currentGraph?.role,
        }}
      />
    </>
  )
}
