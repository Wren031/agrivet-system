export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: 'Active' | 'Inactive'
}
