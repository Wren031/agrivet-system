export interface BookingItem {
  name: string
  quantity: number
  price: number
}

export interface Booking {
  id: string
  customer: string
  agent: string
  assignedStaff?: string
  adminProfileId?: string
  assigned_by_admin: boolean
  date: string
  amount: number
  status: 'Pending' | 'Process' | 'Approved' | 'Completed' | 'Cancelled'
  items: BookingItem[]
  updatedAt: string
}

/** Server API response shapes */
export interface OrderItemApiResponse {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  inventoryId?: string
  inventory?: { productName: string; sellingPrice: string }
}

export interface OrderApiResponse {
  id: string
  orderDate: string
  totalAmount: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  customerId: string
  customer: {
    id: string
    fullName: string
    phone: string
    email?: string
    address: string
    agentProfile?: { fullName: string }
  }
  agentProfileId?: string
  agentProfile?: { fullName: string }
  adminProfileId?: string
  adminProfile?: { id: string; fullName: string }
  items: OrderItemApiResponse[]
  createdAt: string
  updatedAt: string
}
