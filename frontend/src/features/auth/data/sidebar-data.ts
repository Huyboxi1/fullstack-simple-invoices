import { IconLayoutDashboard } from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Managment',
      items: [
        {
          title: 'Invoices',
          url: '/invoices',
          icon: IconLayoutDashboard,
        },
      ],
    },
  ],
}
