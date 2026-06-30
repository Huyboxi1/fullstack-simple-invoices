import { useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import type { SignInReq } from '../types'
import { clearTokens, hasTokens, setTokens } from '@/utils/authTokens'
import { useNavigate } from '@tanstack/react-router'
import { showErrorData } from '@/utils/showErrorData'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    resetAuthStore,
  } = useAuthStore()
  const navigate = useNavigate()
  const signIn = useCallback(
    async (req: SignInReq) => {
      setLoading(true)
      try {
        const signInRes = await authService.signIn(req)
        setAuthenticated(true)
        console.log('signInRes', signInRes)
        setTokens(signInRes.data.accessToken)
        navigate({ to: '/invoices', replace: true })
      } catch (error) {
        showErrorData('Login Failed', error)
      } finally {
        setLoading(false)
      }
    },
    [navigate, setAuthenticated, setLoading, setUser]
  )

  const signOut = useCallback(() => {
    resetAuthStore()
    clearTokens()
    navigate({ to: '/sign-in', replace: true })
  }, [navigate, resetAuthStore])

  const checkAuth = useCallback(async () => {
    if (!hasTokens()) {
      resetAuthStore()
      navigate({ to: '/sign-in', replace: true })
      return
    }

    if (isAuthenticated && user) {
      return
    }

    setLoading(true)
    try {
      const getMeRes = await authService.getMe()
      setUser(getMeRes.data)
      setAuthenticated(true)
    } catch {
      resetAuthStore()
      navigate({ to: '/sign-in', replace: true })
    } finally {
      setLoading(false)
    }
  }, [
    isAuthenticated,
    user,
    setLoading,
    resetAuthStore,
    navigate,
    setUser,
    setAuthenticated,
  ])

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    // Actions
    signIn,
    signOut,
    checkAuth,
  }
}
