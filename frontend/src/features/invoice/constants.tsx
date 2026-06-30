import z from 'zod'

export const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  // Changed to strict z.number()
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0.01, 'Rate must be greater than 0'),
})

export const createInvoiceSchema = z
  .object({
    customerFullname: z.string().min(1, 'Customer name is required'),
    customerEmail: z.string().email('Invalid email format'),
    customerMobileNumber: z.string().optional(),
    customerAddress: z.string().optional(),
    invoiceNumber: z.string().min(1, 'Invoice number is required'),
    invoiceDate: z.string().min(1, 'Invoice date is required'),
    dueDate: z.string().min(1, 'Due date is required'),

    // Removed .default() since useForm handles defaultValues
    currency: z.string().min(1, 'Required'),
    currencySymbol: z.string().min(1, 'Required'),

    // Changed to strict z.number()
    tax: z.number().min(0, 'Cannot be negative'),
    discount: z.number().min(0, 'Cannot be negative'),

    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  })
  .refine(
    data => {
      return new Date(data.dueDate) >= new Date(data.invoiceDate)
    },
    {
      message: 'Due date must be on or after invoice date',
      path: ['dueDate'],
    }
  )

export type CreateInvoiceFormSchema = z.infer<typeof createInvoiceSchema>
