export interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  totalOrders: number
  status: 'Active' | 'Terminated'
}
