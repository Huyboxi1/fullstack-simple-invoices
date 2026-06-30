export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  rate: number
}

export interface InvoiceResponse {
  data: {
    invoiceId: string
    invoiceNumber: string
    invoiceReference: string | null
    invoiceDate: string
    dueDate: string
    currency: string
    currencySymbol: string
    description: string | null
    status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | string
    invoiceSubTotal: number
    totalTax: number
    totalDiscount: number
    totalAmount: number
    totalPaid: number
    balanceAmount: number
    customerFullname: string
    customerEmail: string
    customerMobileNumber: string | null
    customerAddress: string | null
    createdAt: string
    createdBy: string
    items: InvoiceItem[]
  }
}

export interface Invoice {
  invoiceId: string
  invoiceNumber: string
  invoiceReference: string | null
  invoiceDate: string
  dueDate: string
  currency: string
  currencySymbol: string
  description: string | null
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | string
  invoiceSubTotal: number
  totalTax: number
  totalDiscount: number
  totalAmount: number
  totalPaid: number
  balanceAmount: number
  customerFullname: string
  customerEmail: string
  customerMobileNumber: string | null
  customerAddress: string | null
  createdAt: string
  createdBy: string
  items: InvoiceItem[]
}
