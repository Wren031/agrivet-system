import { apiFetch } from '../../config/apiClient'
import type { BranchOrder } from './types'

export async function fetchBranchOrders(): Promise<BranchOrder[]> {
  return apiFetch<BranchOrder[]>('/branch-orders')
}

export async function fetchBranchOrderById(id: string): Promise<BranchOrder> {
  return apiFetch<BranchOrder>(`/branch-orders/${id}`)
}

export async function assignBranchOrder(id: string, adminProfileId: string): Promise<BranchOrder> {
  return apiFetch<BranchOrder>(`/branch-orders/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ adminProfileId }),
  })
}
