import type { Customer, CustomerApiResponse } from './types'
import { apiFetch } from '../../../config/apiClient'

function fromApi(item: CustomerApiResponse): Customer {
  return {
    id: item.id,
    fullName: item.fullName,
    phone: item.phone,
    storeName: item.storeName ?? undefined,
    address: item.address,
    totalOrders: item._count?.orders ?? 0,
    agent: item.agentProfile?.fullName ?? undefined,
  }
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const data = await apiFetch<CustomerApiResponse>(`/customers/${id}`)
  return fromApi(data)
}

export async function fetchCustomers(): Promise<Customer[]> {
  const data = await apiFetch<CustomerApiResponse[]>('/customers')
  return data.map(fromApi)
}

export async function createCustomer(customer: { fullName: string; phone: string; storeName?: string; address?: string }): Promise<Customer> {
  const data = await apiFetch<CustomerApiResponse>('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  })
  return fromApi(data)
}

export async function updateCustomer(id: string, updates: { fullName?: string; phone?: string; storeName?: string; address?: string }): Promise<Customer> {
  const data = await apiFetch<CustomerApiResponse>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  return fromApi(data)
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiFetch<void>(`/customers/${id}`, { method: 'DELETE' })
}

export async function updateCustomerStatus(id: string, status: string): Promise<Customer> {
  const data = await apiFetch<CustomerApiResponse>(`/customers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return fromApi(data)
}

export async function sendAnnouncement(data: { title: string; message: string; customerIds: string[] }): Promise<void> {
  await apiFetch<void>('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
