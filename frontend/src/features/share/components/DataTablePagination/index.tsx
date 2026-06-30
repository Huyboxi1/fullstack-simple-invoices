import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MetaData } from '../../types'

interface DataTablePaginationProps {
  metaData: MetaData
  onChange: (pageIndex: number, pageSize: number) => void
}

export function DataTablePagination({
  metaData,
  onChange,
}: DataTablePaginationProps) {
  const {
    pages_count: totalPage = 1,
    total_count: totalItem = 0,
    page: pageIndex = 1,
    per_page: pageSize = 10,
  } = metaData || {}

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between overflow-clip px-2"
        style={{ overflowClipMargin: 1 }}
      >
        <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
          Tổng số bản ghi: {totalItem}
        </div>
        <div className="flex items-center sm:space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="hidden text-sm font-medium sm:block">
              Số bản ghi / trang
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={value => {
                onChange(1, Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map(size => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {pageIndex} của {Math.max(totalPage, 1)}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onChange(1, pageSize)}
              disabled={pageIndex <= 1}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onChange(pageIndex - 1, pageSize)}
              disabled={pageIndex <= 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onChange(pageIndex + 1, pageSize)}
              disabled={pageIndex >= totalPage || totalPage === 0}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onChange(totalPage, pageSize)}
              disabled={pageIndex >= totalPage || totalPage === 0}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
