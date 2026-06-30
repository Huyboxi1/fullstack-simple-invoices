import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../../../../components/layouts/AuthLayout'
import { SignInForm } from '../../components/SignInForm'
import type { SignInFormValues } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSuccess = async (data: SignInFormValues) => {
    setIsLoading(true)
    try {
      await signIn(data)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm isLoading={isLoading} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
