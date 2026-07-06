import { apiFetch } from '../../config/apiClient'
import { getImageUrl } from '../../config/api.config'
import type { Branch, BranchApiResponse, BranchStatus } from './types'

function fromApi(item: BranchApiResponse): Branch {
  return {
    id: item.id,
    fullName: item.fullName,
    storeBranch: item.storeBranch,
    email: item.email,
    address: item.address || '',
    contactNumber: item.contactNumber,
    status: item.status as BranchStatus,
    verificationImage: getImageUrl(item.verificationImage),
    verificationId: item.id,
    date: item.user.createdAt ? new Date(item.user.createdAt).toISOString().split('T')[0] : '',
  }
}

export async function fetchBranches(): Promise<Branch[]> {
  const data = await apiFetch<BranchApiResponse[]>('/branches')
  return data.map(fromApi)
}

export async function fetchBranch(id: string): Promise<Branch> {
  const data = await apiFetch<BranchApiResponse>(`/branches/${id}`)
  return fromApi(data)
}

export async function createBranch(data: {
  fullName: string
  storeBranch: string
  contactNumber: string
  email: string
  password: string
  status?: BranchStatus
  address?: string
  verificationImage?: string
}): Promise<Branch> {
  const res = await apiFetch<BranchApiResponse>('/branches', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
  const res = await apiFetch<BranchApiResponse>(`/branches/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function updateBranchStatus(id: string, status: BranchStatus): Promise<Branch> {
  const res = await apiFetch<BranchApiResponse>(`/branches/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return fromApi(res)
}

export async function deleteBranch(id: string): Promise<void> {
  await apiFetch<void>(`/branches/${id}`, { method: 'DELETE' })
}
