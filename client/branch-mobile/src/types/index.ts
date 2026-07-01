export type BranchStatus = "PENDING" | "APPROVED" | "ONLINE" | "OFFLINE";

export interface User {
  id: string;
  storeName: string;
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
  branchProfileId?: string;
  status?: BranchStatus;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  imageUrl: string;
  unit: string;
  reviews: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  products: BookingProduct[];
  totalAmount: number;
  subtotal: number;
  serviceFee: number;
  status: BookingStatus;
  pickupMethod: 'pickup' | 'delivery';
  preferredBranch: string;
  preferredDate: string;
  preferredTime: string;
  specialInstructions: string;
  paymentMethod: 'cash' | 'gcash';
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface BookingProduct {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface TimelineEntry {
  status: BookingStatus;
  label: string;
  date: string;
  completed: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Statistic {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking_approved' | 'booking_ready' | 'booking_cancelled' | 'new_product' | 'promo';
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface FavoriteItem {
  id: string;
  inventoryId: string;
  createdAt: string;
  productName: string;
  productImage: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  contactNumber: string;
  storeOwner: string;
  operatingHours: string;
  imageUrl?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  BookingConfirmationScreen: { bookingId: string };
  OrdersScreen: undefined;
  NotificationsScreen: undefined;
  BranchesScreen: undefined;
  ProductDetail: { productId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Items: undefined;
  Favorites: undefined;
  History: undefined;
  Settings: undefined;
};

export type BookingStackParamList = {
  Catalog: undefined;
  ProductDetail: { productId: string };
};

export type HistoryStackParamList = {
  BookingHistory: undefined;
  BookingDetail: { bookingId: string };
};

export type HomeStackParamList = {
  HomeDashboard: undefined;
  BookingDetail: { bookingId: string };
};
