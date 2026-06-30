import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { type GetInvoicesQueryReq } from '@/services/invoiceService'

interface DataTableToolbarProps {
  request: GetInvoicesQueryReq
  onChange: (values: GetInvoicesQueryReq) => void
}

export function DataTableToolbar({ request, onChange }: DataTableToolbarProps) {
  const [searchTerm, setSearchTerm] = useState(request?.keyword || '')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const handleReset = () => {
    setSearchTerm('')
    onChange({
      ...request,
      page: 1,
      keyword: '',
    })
  }

  useEffect(() => {
    onChange({
      ...request,
      page: 1,
      keyword: debouncedSearchTerm || '',
    })
  }, [debouncedSearchTerm])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Search by invoice number or client name..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          className="h-9 w-[150px] lg:w-[300px]"
        />
        {request?.keyword && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
