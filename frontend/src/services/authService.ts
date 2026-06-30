import { axiosClient } from '@/configs/axios'
import type { User, SignInReq, SignInRes } from '@/features/auth/types'

export const authService = {
  async signIn(req: SignInReq) {
    const res = await axiosClient.post<{ data: SignInRes }>('/auth/login', req)
    return res.data
  },
  async getMe() {
    const res = await axiosClient.get<{ data: User }>('/auth/me')
    return res.data
  },
}
