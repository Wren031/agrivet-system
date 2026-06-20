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
  date: string
  amount: number
  status: 'Pending' | 'Process' | 'Approved' | 'Completed' | 'Cancelled'
  items: BookingItem[]
}
