import { ConfirmDialog } from '@/components/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import type { Invoice } from '@/features/invoice/types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export function InvoiceViewDialog({ open, onOpenChange, invoice }: Props) {
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

  if (!invoice) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => onOpenChange(false)}
      title={<span>Invoice Information</span>}
      desc={
        <div className="flex flex-col gap-3 text-sm text-left">
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

          <div className="grid grid-cols-2 gap-2 border-b pb-2">
            <div>
              <span className="block font-semibold">Invoice Date</span>
              <span className="text-muted-foreground">
                {invoice.invoiceDate}
              </span>
            </div>
            <div>
              <span className="block font-semibold">Due Date</span>
              <span className="text-muted-foreground">{invoice.dueDate}</span>
            </div>
          </div>

          <div>
            <span className="block mb-1 font-semibold">Items Included</span>
            <div className="max-h-40 overflow-y-auto space-y-1 rounded bg-muted/40 p-2">
              {invoice.items?.map(item => (
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
              ))}
            </div>
          </div>

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
      }
    />
  )
}
