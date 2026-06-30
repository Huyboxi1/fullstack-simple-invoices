import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { View } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Invoice } from '../../../types'
import { useInvoiceStore } from '@/stores/invoiceStore'

type Props = {
  row: Row<Invoice>
}

export function DataTableRowActions({ row }: Props) {
  const { setInvoice, setIsOpen } = useInvoiceStore()
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setInvoice(row.original)
              setIsOpen('view')
            }}
          >
            Xem chi tiết
            <DropdownMenuShortcut>
              <View className="size-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setInvoice(row.original)
              setIsOpen('view')
            }}
            className="text-red-500!"
          >
            {row.original.status === 'Paid' ? 'Paid' : 'View'}
            <DropdownMenuShortcut>
              <View className="size-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
