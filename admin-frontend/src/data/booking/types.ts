export interface BookingItem {
  name: string
  quantity: number
  price: number
}

export interface Booking {
  id: string
  customer: string
  agent: string
  date: string
  amount: number
  status: 'Pending' | 'Completed' | 'Cancelled'
  items: BookingItem[]
}
