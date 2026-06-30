export type BranchStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'TERMINATED' | 'ONLINE' | 'OFFLINE'

export interface BranchApiResponse {
  id: string
  fullName: string
  storeBranch: string
  contactNumber: string
  email: string
  address: string | null
  status: string
  verificationImage: string | null
  userId: string
  user: {
    id: string
    role: string
    createdAt: string
  }
}

export interface Branch {
  id: string
  fullName: string
  storeBranch: string
  email: string
  address: string
  contactNumber: string
  status: BranchStatus
  verificationImage?: string
  verificationId: string
  date: string
}
