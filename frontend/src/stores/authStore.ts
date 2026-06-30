import type { User } from '@/features/auth/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (isLoading: boolean) => void
  resetAuthStore: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: user => set({ user }),

      setAuthenticated: isAuthenticated => set({ isAuthenticated }),

      setLoading: isLoading => set({ isLoading }),

      resetAuthStore: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
