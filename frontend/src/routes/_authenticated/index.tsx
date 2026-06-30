import { Invoices } from '@/features/invoice/pages/Invoices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Invoices,
})
