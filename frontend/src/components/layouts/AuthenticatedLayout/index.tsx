import { useAuth } from '@/features/auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '../AppSidebar'
import { Header } from '../Header'
import SkipToMain from '../SkipToMain'
import { ThemeSwitch } from '../ThemeSwitch'
import { ProfileDropdown } from '../ProfileDropdown'

export default function AuthenticatedLayout() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const [defaultOpen, setDefaultOpen] = useState(true)

  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={setDefaultOpen}>
      <SkipToMain />
      <AppSidebar />
      <SidebarInset
        className={cn(
          // Set content container, so we can use container queries
          '@container/content',

          // If layout is fixed, set the height
          // to 100svh to prevent overflow
          'has-[[data-layout=fixed]]:h-svh',

          // If layout is fixed and sidebar is inset,
          // set the height to 100svh - spacing (total margins) to prevent overflow
          'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
        )}
      >
        <Header>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
