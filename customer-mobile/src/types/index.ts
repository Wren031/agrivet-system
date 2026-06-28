export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: string;
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

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Booking: undefined;
  History: undefined;
  Settings: undefined;
};

export type BookingStackParamList = {
  Catalog: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  BookingConfirmation: { bookingId: string };
};

export type HistoryStackParamList = {
  BookingHistory: undefined;
  BookingDetail: { bookingId: string };
};

export type HomeStackParamList = {
  HomeDashboard: undefined;
  BookingDetail: { bookingId: string };
};
