import { LOCAL_STORAGE_KEY } from '@/constants/localStorageKey'

export const setTokens = (accessToken: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
}

export const clearTokens = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
}

export const hasTokens = (): boolean => {
  return !!getAccessToken()
}
