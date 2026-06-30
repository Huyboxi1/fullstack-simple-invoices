import { createFileRoute } from '@tanstack/react-router'
import { Invoices } from '@/features/invoice/pages/Invoices'

export const Route = createFileRoute('/_authenticated/invoices/')({
  component: Invoices,
})
