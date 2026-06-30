import SignIn from '@/features/auth/pages/SignIn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
})
