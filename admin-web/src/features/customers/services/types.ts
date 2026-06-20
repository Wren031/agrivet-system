export interface CustomerApiResponse {
  id: string
  fullName: string
  phone: string
  email?: string
  address: string
  agentProfileId?: string
  agentProfile?: { id: string; fullName: string; contactNumber: string; email: string; userId: string }
  _count: { orders: number }
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  fullName: string
  phone: string
  address: string
  totalOrders: number
  agent?: string
}
