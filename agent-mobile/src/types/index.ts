export interface User {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  idVerificationUrl?: string;
  address: string;
  password: string;
  avatar?: string;
  role: "admin" | "user";
  pending_admin_approval: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  avatar?: string;
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
}

export type BookingStatus = "Pending" | "Accepted" | "Ongoing" | "Success" | "Cancelled";

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

export type ThemeMode = "light" | "dark";
