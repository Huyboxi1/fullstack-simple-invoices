import { createFileRoute } from '@tanstack/react-router'
import { CreateInvoice } from '@/features/invoice/pages/CreateInvoice'

export const Route = createFileRoute('/_authenticated/invoices/create')({
  component: CreateInvoice,
})
