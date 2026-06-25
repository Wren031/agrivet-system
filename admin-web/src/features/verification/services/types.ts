export interface VerificationAgent {
  id: string
  fullName: string
  email: string
  contactNumber: string
  idVerificationUrl?: string
  status: string
  createdAt?: string
}

export interface VerificationBranch {
  id: string
  name: string
  email: string
  address: string
  contactNumber: string
  status: 'Active' | 'Inactive'
  date: string
}

export type VerificationTab = 'agents' | 'branches'
