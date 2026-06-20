export interface AdminStaffApiResponse {
  id: string
  role: string
  password: string
  createdAt: string
  updatedAt: string
  adminProfile: {
    id: string
    fullName: string
    contactNumber: string
    email: string
    userId: string
  } | null
}

export interface AdminStaff {
  id: string
  adminProfileId: string
  fullName: string
  email: string
  contactNumber: string
}

export interface CreateAdminStaffData {
  fullName: string
  email: string
  contactNumber: string
  password: string
}

export interface UpdateAdminStaffData {
  fullName?: string
  email?: string
  contactNumber?: string
  password?: string
}
