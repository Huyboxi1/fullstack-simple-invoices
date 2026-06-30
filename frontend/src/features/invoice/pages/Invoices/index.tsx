import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { FilePlus2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Main } from '@/components/layouts/Main'
import { PAGINATION } from '@/constants/pagination'
import { QUERY } from '@/constants/query'

import {
  invoiceService,
  type GetInvoicesQueryReq,
} from '@/services/invoiceService'
import { DataTableToolbar } from '../../components/DataTableToolbar'
import { InvoicesTable } from '../../components/InvoicesTable'
import { DataTablePagination } from '@/features/share/components/DataTablePagination'
import { InvoiceViewDialog } from '../../components/InvoiceViewDialog'
import { createInvoiceColumns } from '../../components/InvoiceColumns'

import { useInvoiceStore } from '@/stores/invoiceStore'

export function Invoices() {
  const [req, setReq] = useState<GetInvoicesQueryReq>({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined,
  })

  const { isOpen, invoice, setIsOpen } = useInvoiceStore()
  const navigate = useNavigate()

  const invoiceColumns = useMemo(() => createInvoiceColumns(), [])

  const { data } = useQuery({
    queryKey: [QUERY.GET_INVOICES, req],
    queryFn: () => invoiceService.getInvoices(req),
  })

  const handleChangeToolbar = (newReqValues: GetInvoicesQueryReq) => {
    setReq(prev => ({
      ...prev,
      ...newReqValues,
      page: 1,
    }))
  }

  const handleChangeStatusFilter = (statusValue: string | undefined) => {
    setReq(prev => ({
      ...prev,
      page: 1,
      status: statusValue || undefined,
    }))
  }

  const totalPages =
    data?.paging?.total && data?.paging?.pageSize
      ? Math.ceil(data.paging.total / data.paging.pageSize)
      : 1

  const currentPage = data?.paging?.page ?? 1

  return (
    <Main>
      <div className="mb-4 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoice List</h2>
          <p className="text-muted-foreground text-sm">
            Manage client invoices, monitor statuses and overdue actions.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate({ to: '/invoices/create' })}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            <span>Create Invoice</span>
          </Button>
        </div>
      </div>

      {data && (
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 flex flex-col gap-4">
          <DataTableToolbar onChange={handleChangeToolbar} request={req} />

          <div className="flex gap-2 border-b pb-2">
            {[
              { label: 'All Invoices', value: undefined },
              { label: 'Draft', value: 'Draft' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Overdue', value: 'Overdue' },
            ].map(item => (
              <Button
                key={item.label}
                onClick={() => handleChangeStatusFilter(item.value)}
                variant={req.status === item.value ? 'secondary' : 'ghost'}
                size="sm"
              >
                {item.label}
              </Button>
            ))}
          </div>

          <InvoicesTable data={data.data} columns={invoiceColumns} />

          <DataTablePagination
            metaData={{
              pages_count: totalPages,
              total_count: data.paging?.total ?? 0,
              page: currentPage,
              per_page: data.paging?.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
              next_page: currentPage < totalPages ? currentPage + 1 : null,
              previous_page: currentPage > 1 ? currentPage - 1 : null,
            }}
            onChange={(pageIndex, pageSize) =>
              setReq(prev => ({
                ...prev,
                page: pageIndex,
                pageSize: pageSize,
              }))
            }
          />
        </div>
      )}

      {invoice && isOpen === 'view' && (
        <InvoiceViewDialog
          open={isOpen === 'view'}
          onOpenChange={open => {
            if (!open) {
              setIsOpen(null)
              // FIX TẠI ĐÂY: Ép body mở lại pointer-events và scroll ngay khi đóng dialog
              setTimeout(() => {
                document.body.style.pointerEvents = 'auto'
                document.body.style.overflow = 'auto'
              }, 100)
            }
          }}
          invoiceId={invoice.invoiceId}
        />
      )}
    </Main>
  )
}
