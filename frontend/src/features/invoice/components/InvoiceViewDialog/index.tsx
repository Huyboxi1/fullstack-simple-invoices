import { ConfirmDialog } from '@/components/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { QUERY } from '@/constants/query'
import { invoiceService } from '@/services/invoiceService'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId: string
}

export function InvoiceViewDialog({ open, onOpenChange, invoiceId }: Props) {
  // 1. Gọi API lấy chi tiết
  const {
    data: invoice,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY.GET_INVOICE_DETAIL, invoiceId],
    queryFn: () => invoiceService.getInvoice(invoiceId),
    enabled: open && !!invoiceId,
  })

  console.log(invoice)
  // 2. Logic hiển thị Badge
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success'
      case 'Overdue':
        return 'destructive'
      case 'Pending':
        return 'warning'
      default:
        return 'outline'
    }
  }

  // 3. Render nội dung an toàn
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          Loading invoice details...
        </div>
      )
    }
    if (error) {
      return (
        <div className="py-8 text-center text-destructive">
          Error loading invoice details.
        </div>
      )
    }
    if (!invoice) {
      return <></>
    }

    return (
      <div className="flex flex-col gap-3 text-sm text-left">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 border-b pb-2">
          <div>
            <span className="block font-semibold">Invoice Number</span>
            <span className="text-muted-foreground">
              {invoice.invoiceNumber}
            </span>
          </div>
          <div>
            <span className="block font-semibold">Status</span>
            <Badge variant={getStatusBadgeVariant(invoice.status) as any}>
              {invoice.status}
            </Badge>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-2 border-b pb-2">
          <div>
            <span className="block font-semibold">Client Name</span>
            <span className="text-muted-foreground">
              {invoice.customerFullname}
            </span>
          </div>
          <div>
            <span className="block font-semibold">Client Email</span>
            <span className="text-muted-foreground">
              {invoice.customerEmail}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 border-b pb-2">
          <div>
            <span className="block font-semibold">Invoice Date</span>
            <span className="text-muted-foreground">{invoice.invoiceDate}</span>
          </div>
          <div>
            <span className="block font-semibold">Due Date</span>
            <span className="text-muted-foreground">{invoice.dueDate}</span>
          </div>
        </div>

        {/* Items */}
        <div>
          <span className="block mb-1 font-semibold">Items Included</span>
          <div className="max-h-40 overflow-y-auto space-y-1 rounded bg-muted/40 p-2">
            {invoice.items?.length > 0 ? (
              invoice.items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-1 text-xs last:border-0"
                >
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="font-medium">
                    {invoice.currencySymbol}
                    {item.rate * item.quantity}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground italic">
                No items found
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end gap-1 rounded bg-muted/20 p-2 font-medium">
          <div className="text-xs">
            Subtotal: {invoice.currencySymbol}
            {invoice.invoiceSubTotal}
          </div>
          <div className="text-xs">
            Tax: {invoice.currencySymbol}
            {invoice.totalTax}
          </div>
          <div className="text-base font-bold text-primary">
            Total Amount: {invoice.currencySymbol}
            {invoice.totalAmount}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => onOpenChange(false)}
      title={<span>Invoice Information</span>}
      desc={renderContent()}
    />
  )
}
