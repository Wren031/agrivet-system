import type { AdminStaff, AdminStaffApiResponse, CreateAdminStaffData, UpdateAdminStaffData } from './types'
import { apiFetch } from '../../../config/apiClient'

function fromApi(item: AdminStaffApiResponse): AdminStaff {
  return {
    id: item.id,
    adminProfileId: item.adminProfile?.id ?? '',
    fullName: item.adminProfile?.fullName ?? '',
    email: item.adminProfile?.email ?? '',
    contactNumber: item.adminProfile?.contactNumber ?? '',
  }
}

export async function fetchStaff(): Promise<AdminStaff[]> {
  const data = await apiFetch<AdminStaffApiResponse[]>('/admin/staff')
  return data.map(fromApi)
}

export async function fetchStaffById(id: string): Promise<AdminStaff> {
  const data = await apiFetch<AdminStaffApiResponse>(`/admin/staff/${id}`)
  return fromApi(data)
}

export async function createStaff(data: CreateAdminStaffData): Promise<AdminStaff> {
  const res = await apiFetch<AdminStaffApiResponse>('/admin/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function updateStaff(id: string, data: UpdateAdminStaffData): Promise<AdminStaff> {
  const res = await apiFetch<AdminStaffApiResponse>(`/admin/staff/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return fromApi(res)
}

export async function deleteStaff(id: string): Promise<void> {
  await apiFetch<void>(`/admin/staff/${id}`, { method: 'DELETE' })
}
