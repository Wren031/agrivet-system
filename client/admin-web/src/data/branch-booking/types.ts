export interface BranchOrderItem {
  id: string
  inventoryId: string
  quantity: number
  subtotal: string
  inventory?: {
    id: string
    productName: string
    sellingPrice: string
  }
}

export interface BranchOrder {
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
  adminProfile: {
    id: string
    fullName: string
    contactNumber: string
    email: string
  } | null
  items: BranchOrderItem[]
}
