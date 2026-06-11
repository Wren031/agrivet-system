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
  date: string
  amount: number
  status: 'Pending' | 'Process' | 'Completed' | 'Cancelled'
  items: BookingItem[]
}
