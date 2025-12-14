'use client'

import { EntitySelectorDropdown } from '@/components/EntitySelectorDropdown'
import { CoreNavbar, CoreSidebar } from '@/lib/core'
import { LayoutContent } from './layout-content'
import { useRoboInvestorSidebarConfig } from './sidebar-config'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const sidebarConfig = useRoboInvestorSidebarConfig()

  return (
    <>
      <CoreNavbar
        appName="RoboInvestor"
        currentApp="roboinvestor"
        borderColorClass="dark:border-gray-800"
        additionalComponents={<EntitySelectorDropdown />}
      />
      <div className="mt-16 flex items-start">
        <CoreSidebar
          navigationItems={sidebarConfig.navigationItems}
          features={sidebarConfig.features}
          bottomMenuActions={sidebarConfig.bottomMenuActions}
          borderColorClass="dark:border-gray-800"
        />
        <LayoutContent>{children}</LayoutContent>
      </div>
    </>
  )
}
