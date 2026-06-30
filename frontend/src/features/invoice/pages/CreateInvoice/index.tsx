import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import { Main } from '@/components/layouts/Main'
import { showErrorData } from '@/utils/showErrorData'

import { type CreateInvoiceFormSchema } from '../../constants'

import { invoiceService } from '../../../../services/invoiceService'
import CreateInvoiceForm from '../../components/components/CreateInvoiceForm'

export function CreateInvoice() {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateInvoiceFormSchema) =>
      invoiceService.createInvoice(data),
    onSuccess: () => {
      toast.success('Create Invoice Successfully')
      navigate({ to: '/invoices' })
    },
    onError: error => {
      showErrorData('Create Invoice Failed', error)
    },
  })

  const handleInvoiceSubmit = (values: CreateInvoiceFormSchema) => {
    mutate(values)
  }

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create new invoice
          </h2>
        </div>
      </div>

      <CreateInvoiceForm onSubmit={handleInvoiceSubmit} isLoading={isPending} />
    </Main>
  )
}
