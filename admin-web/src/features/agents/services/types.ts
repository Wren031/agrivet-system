export interface AgentApiResponse {
  id: string
  fullName: string
  contactNumber: string
  email: string
  idVerificationUrl: string | null
  status: string
  userId: string
  user: {
    id: string
    role: string
    createdAt: string
  }
}

export interface Agent {
  id: string
  fullName: string
  contactNumber: string
  email: string
  idVerificationUrl?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt?: string
}

export interface CreateAgentData {
  fullName: string
  contactNumber: string
  email: string
  password: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  idVerificationUrl?: string
}

export interface UpdateAgentData {
  fullName?: string
  contactNumber?: string
  email?: string
  password?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  idVerificationUrl?: string
}

export interface UpdateAgentStatusData {
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}
