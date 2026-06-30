export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  agentName: string
  date: string
  totalAmount: number
  status: 'Pending' | 'Completed' | 'Cancelled'
  items: OrderItem[]
}
