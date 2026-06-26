export type AgentStatus = "PENDING" | "APPROVED" | "ONLINE" | "OFFLINE";

export interface AgentLocation {
  latitude: number;
  longitude: number;
  updatedAt?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  idVerificationUrl: string;
  address: string;
  password: string;
  avatar?: string;
  role: "admin" | "user";
  pending_admin_approval: boolean;
  isApproved: boolean;
  createdAt: string;
  agentProfileId?: string;
  status?: AgentStatus;
  location?: AgentLocation;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  storeName: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  avatar?: string;
  agentProfileId?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  unit: string;
  costPrice: number;
  reorderPoint: number;
  categoryId?: string;
  subcategoryId?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "Pending" | "Approved" | "Delivered";

export interface BookingItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  items: BookingItem[];
  total: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingHistoryEntry {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus | null;
  toStatus: BookingStatus;
  changedAt: string;
  note?: string;
}

export type ThemeMode = "light" | "dark";
