import { AppProvider } from '@/providers/AppProvider'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <AppProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </AppProvider>
  ),
})
