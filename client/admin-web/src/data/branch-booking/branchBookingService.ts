import { apiFetch } from '../../config/apiClient'
import type { BranchOrder } from './types'

// ✅ Get all branch orders
export async function fetchBranchOrders(): Promise<BranchOrder[]> {
  return apiFetch<BranchOrder[]>('/branch-orders')
}

// ✅ Get single order
export async function fetchBranchOrderById(id: string): Promise<BranchOrder> {
  return apiFetch<BranchOrder>(`/branch-orders/${id}`)
}

// ✅ Assign order
export async function assignBranchOrder(
  id: string,
  adminProfileId: string,
): Promise<BranchOrder> {
  return apiFetch<BranchOrder>(`/branch-orders/${id}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adminProfileId }),
  })
}

// ✅ Update general fields (NOT status)
export async function updateBranchOrder(
  id: string,
  updates: Partial<BranchOrder>,
): Promise<BranchOrder> {
  const body: Record<string, unknown> = {}

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      body[key] = value
    }
  })

  return apiFetch<BranchOrder>(`/branch-orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function updateBranchOrderStatus(
  id: string,
  status: string,
): Promise<BranchOrder> {
  return apiFetch(`/branch-orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
}

// ✅ Delete order
export async function deleteBranchOrder(id: string): Promise<void> {
  await apiFetch<void>(`/branch-orders/${id}`, {
    method: 'DELETE',
  })
}