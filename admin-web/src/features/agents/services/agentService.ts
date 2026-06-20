import type { Agent, AgentApiResponse, CreateAgentData, UpdateAgentData, UpdateAgentStatusData, AgentCustomer } from './types'
import { apiFetch } from '../../../config/apiClient'
import { fetchOrders } from '../../orders/services/orderService'

function fromApi(item: AgentApiResponse): Agent {
  return {
    id: item.id,
    fullName: item.fullName,
    contactNumber: item.contactNumber,
    email: item.email,
    idVerificationUrl: item.idVerificationUrl || undefined,
    status: item.status as Agent['status'],
    createdAt: item.user.createdAt,
  }
}

export async function fetchAgents(): Promise<Agent[]> {
  const data = await apiFetch<AgentApiResponse[]>('/agents')
  return data.map(fromApi)
}

export async function fetchAgent(id: string): Promise<Agent> {
  const data = await apiFetch<AgentApiResponse>(`/agents/${id}`)
  return fromApi(data)
}

export async function createAgent(data: CreateAgentData): Promise<Agent> {
  const res = await apiFetch<AgentApiResponse>('/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function updateAgent(id: string, data: UpdateAgentData): Promise<Agent> {
  const res = await apiFetch<AgentApiResponse>(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function updateStatus(id: string, data: UpdateAgentStatusData): Promise<Agent> {
  const res = await apiFetch<AgentApiResponse>(`/agents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function deleteAgent(id: string): Promise<void> {
  await apiFetch<void>(`/agents/${id}`, { method: 'DELETE' })
}

export async function fetchAgentCustomers(id: string): Promise<AgentCustomer[]> {
  return apiFetch<AgentCustomer[]>(`/agents/${id}/customers`)
}

export async function fetchAgentCustomersWithOrders(id: string): Promise<AgentCustomer[]> {
  const [customers, orders] = await Promise.all([
    fetchAgentCustomers(id),
    fetchOrders(),
  ])

  return customers.map(customer => {
    const customerOrders = orders.filter(
      o => o.customerName.toLowerCase() === customer.fullName.toLowerCase()
    )
    return {
      ...customer,
      totalOrders: customerOrders.length,
      totalOrderAmount: customerOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    }
  })
}
