'use client'

import type { SidebarItemData } from '@/lib/core'
import { useRouter } from 'next/navigation'
import { HiHome, HiOutlineOfficeBuilding, HiTerminal } from 'react-icons/hi'
import { TbTrendingUp } from 'react-icons/tb'

export const roboInvestorNavigationItems: SidebarItemData[] = [
  {
    icon: HiHome,
    label: 'Home',
    href: '/home',
  },
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
  {
    icon: HiTerminal,
    label: 'Console',
    href: '/console',
  },
]

export function useRoboInvestorSidebarConfig() {
  const router = useRouter()

  const bottomMenuActions = [
    {
      label: 'Console',
      icon: HiTerminal,
      onClick: () => router.push('/console'),
      tooltip: 'Open Investment Console',
    },
  ]

  return {
    navigationItems: roboInvestorNavigationItems,
    features: {
      aiChat: false,
      companyDropdown: false, // RoboInvestor doesn't need company selection
      showOrgSection: false, // Hide My Org in sidebar
    },
    bottomMenuActions,
  }
}
