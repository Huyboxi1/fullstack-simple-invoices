import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

import {
  createInvoiceSchema,
  type CreateInvoiceFormSchema,
} from '../../../constants'

interface Props {
  onSubmit: (values: CreateInvoiceFormSchema) => void
  isLoading?: boolean
}

const CreateInvoiceForm = ({ onSubmit, isLoading }: Props) => {
  const form = useForm<CreateInvoiceFormSchema>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerFullname: '',
      customerEmail: '',
      customerMobileNumber: '',
      customerAddress: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0], // Defaults to today (YYYY-MM-DD)
      dueDate: new Date().toISOString().split('T')[0],
      currency: 'USD',
      currencySymbol: '$',
      tax: 10,
      discount: 0,
      items: [{ name: '', quantity: 1, rate: 0 }],
    },
  })

  // useFieldArray handles dynamic lists (adding/removing invoice items)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        {/* --- CUSTOMER & INVOICE DETAILS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Customer Details
            </h3>
            <FormField
              control={form.control}
              name="customerFullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Invoice Info
            </h3>
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-2026-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e =>
                          field.onChange(
                            isNaN(e.target.valueAsNumber)
                              ? 0
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e =>
                          field.onChange(
                            isNaN(e.target.valueAsNumber)
                              ? 0
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* --- DYNAMIC LINE ITEMS --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Line Items *</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', quantity: 1, rate: 0 })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          {/* Validation message if items array is empty */}
          {form.formState.errors.items?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.items.root.message}
            </p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 items-end bg-muted/30 p-4 rounded-lg border"
              >
                <div className="col-span-12 md:col-span-6">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? 'md:sr-only' : ''}>
                          Item Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Web Design Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-5 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? 'md:sr-only' : ''}>
                          Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={e =>
                              field.onChange(
                                isNaN(e.target.valueAsNumber)
                                  ? 0
                                  : e.target.valueAsNumber
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-5 md:col-span-3">
                  <FormField
                    control={form.control}
                    name={`items.${index}.rate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? 'md:sr-only' : ''}>
                          Rate/Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={e =>
                              field.onChange(
                                isNaN(e.target.valueAsNumber)
                                  ? 0
                                  : e.target.valueAsNumber
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 md:col-span-1 flex justify-end pb-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1} // Prevent deleting the very last item to satisfy the assignment
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Processing...' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateInvoiceForm
