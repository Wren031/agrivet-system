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
  fullName: string
  storeBranch: string
  email: string
  address: string
  contactNumber: string
  status: string
  verificationId: string
  date: string
}

export type VerificationTab = 'agents' | 'branches'
