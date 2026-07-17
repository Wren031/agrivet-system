export interface AgentOrderItem {
  id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export interface AgentOrder {
  id: string
  orderDate: string
  totalAmount: number
  status: string
  customerName: string
  customerPhone: string
  customerAddress: string
  agentName: string
  assignedStaff: string | null
  adminProfileId: string | null
  items: AgentOrderItem[]
  createdAt: string
  updatedAt: string
}

export interface BranchOrder {
  id: string
  branchName: string
  address: string
  branchContact: string
  totalAmount: number
  status: string
  assignedStaff: string | null
  notes: string | null
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface OrderApiResponse {
  id: string
  orderDate: string
  totalAmount: string
  status: string
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
  items: {
    id: string
    quantity: number
    unitPrice: string
    subtotal: string
    inventoryId?: string
    inventory?: { productName: string; sellingPrice: string }
  }[]
  createdAt: string
  updatedAt: string
}

export interface BranchOrderApiResponse {
  id: string
  branchProfileId: string
  adminProfileId: string | null
  status: string
  totalAmount: string
  notes: string | null
  createdAt: string
  updatedAt: string
  branchProfile: {
    id: string
    fullName: string
    storeBranch: string
    location: string
    contactNumber: string
    address: string | null
  }
  adminProfile: { id: string; fullName: string; contactNumber: string; email: string } | null
  items: {
    id: string
    inventoryId: string
    quantity: number
    subtotal: string
    inventory?: { id: string; productName: string; sellingPrice: string }
  }[]
}
