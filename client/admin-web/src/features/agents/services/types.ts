export type AgentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'TERMINATED' | 'ONLINE' | 'OFFLINE'

export interface AgentApiResponse {
  id: string
  fullName: string
  contactNumber: string
  email: string
  address: string | null
  idVerificationUrl: string | null
  status: AgentStatus
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
  address?: string
  idVerificationUrl?: string
  status: AgentStatus
  createdAt?: string
}

export interface AgentWithLocation extends Agent {
  location: {
    latitude: number
    longitude: number
    address: string | null
    updatedAt: string
  }
}

export interface CreateAgentData {
  fullName: string
  contactNumber: string
  email: string
  password: string
  status?: AgentStatus
  idVerificationUrl?: string
}

export interface UpdateAgentData {
  fullName?: string
  contactNumber?: string
  email?: string
  password?: string
  status?: AgentStatus
  idVerificationUrl?: string
}

export interface UpdateAgentStatusData {
  status: AgentStatus
}

export interface AgentCustomer {
  id: string
  fullName: string
  phone: string
  email: string | null
  address: string
  createdAt: string
  totalOrders: number
  totalOrderAmount: number
}
