import { axiosClient } from '@/configs/axios'
import type { CreateInvoiceFormSchema } from '../features/invoice/constants'
import type { Invoice, InvoiceResponse } from '@/features/invoice/types'
import qs from 'qs'

export interface GetInvoicesQueryReq {
  page?: number
  pageSize?: number
  sortBy?: string
  ordering?: 'ASC' | 'DESC'
  status?: string
  keyword?: string
  fromDate?: string
  toDate?: string
}

export interface GetInvoicesRes {
  data: {
    data: Invoice[]
    paging: {
      page: number
      pageSize: number
      total: number
    }
  }
}

export const invoiceService = {
  async getInvoices(req: GetInvoicesQueryReq) {
    const stringified = qs.stringify(req, { skipNulls: true })

    const res = await axiosClient.get<GetInvoicesRes>(
      `/invoices?${stringified}`
    )
    return res.data.data
  },

  async getInvoice(id: string) {
    const res = await axiosClient.get<InvoiceResponse>(`/invoices/${id}`)
    return res.data.data
  },

  async createInvoice(data: CreateInvoiceFormSchema) {
    const res = await axiosClient.post<Invoice>(`/invoices`, data)
    return res.data
  },
}
