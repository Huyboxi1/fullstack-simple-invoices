import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Import Type và Store
import type { Invoice } from '@/features/invoice/types'
import { useInvoiceStore } from '@/stores/invoiceStore'

export const createInvoiceColumns = (): ColumnDef<Invoice>[] => [
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice #',
    cell: ({ row }) => (
      <span className="font-semibold text-primary">
        {row.getValue('invoiceNumber')}
      </span>
    ),
  },
  {
    accessorKey: 'customerFullname',
    header: 'Customer',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.getValue('customerFullname')}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.customerEmail}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'invoiceDate',
    header: 'Dates',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col text-sm">
          <span>
            <span className="font-medium text-muted-foreground">Inv:</span>{' '}
            {row.original.invoiceDate}
          </span>
          <span>
            <span className="font-medium text-muted-foreground">Due:</span>{' '}
            {row.original.dueDate}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.original.currency || 'USD',
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      let variant: 'default' | 'destructive' | 'secondary' | 'outline' =
        'outline'
      if (status === 'Paid') variant = 'default'
      if (status === 'Overdue') variant = 'destructive'
      if (status === 'Pending') variant = 'secondary'

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original

      const { setInvoice, setIsOpen } = useInvoiceStore()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                setInvoice(invoice)
                setIsOpen('view')
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
