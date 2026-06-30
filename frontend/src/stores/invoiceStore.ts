import { create } from 'zustand'
import type { Invoice } from '@/features/invoice/types'

type ModalType = 'view' | 'status' | null

interface InvoiceStore {
  // State
  invoice: Invoice | null
  isOpen: ModalType

  // Actions
  setInvoice: (invoice: Invoice | null) => void
  setIsOpen: (isOpen: ModalType) => void
}

export const useInvoiceStore = create<InvoiceStore>(set => ({
  invoice: null,
  isOpen: null,

  setInvoice: invoice => set({ invoice }),
  setIsOpen: isOpen => set({ isOpen }),
}))
