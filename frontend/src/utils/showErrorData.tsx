import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export function showErrorData(title: string, error: unknown) {
  if (error && isAxiosError(error)) {
    toast.error(title, {
      description: error.response?.data.message || error.message,
    })
    return
  }
  toast.error(title)
}
