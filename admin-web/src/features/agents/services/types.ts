export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: 'Pending' | 'Approved' | 'Rejected'
  idVerificationUrl?: string
}
