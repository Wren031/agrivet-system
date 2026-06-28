import { Booking } from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const mockBookings: Booking[] = [
  {
    id: 'bk-001', bookingNumber: 'BK-2026-000123', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-001', productName: 'Chicken Feeds Starter', productImage: 'https://images.unsplash.com/photo-1568043210943-0e8aacf3e4f8?w=400', quantity: 5, price: 850, subtotal: 4250 },
      { productId: 'prod-003', productName: 'Organic Fertilizer', productImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', quantity: 2, price: 450, subtotal: 900 },
    ],
    totalAmount: 5300, subtotal: 5150, serviceFee: 150,
    status: 'completed', pickupMethod: 'pickup', preferredBranch: 'Agrivet Main Branch',
    preferredDate: '2026-06-20', preferredTime: '09:00', specialInstructions: '',
    paymentMethod: 'cash', createdAt: daysAgo(7), updatedAt: daysAgo(1),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(7), completed: true },
      { status: 'approved', label: 'Order Approved', date: daysAgo(6), completed: true },
      { status: 'processing', label: 'Preparing Order', date: daysAgo(5), completed: true },
      { status: 'ready', label: 'Ready for Pickup', date: daysAgo(3), completed: true },
      { status: 'completed', label: 'Order Completed', date: daysAgo(1), completed: true },
    ],
  },
  {
    id: 'bk-002', bookingNumber: 'BK-2026-000124', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-005', productName: 'Rice Seeds - Hybrid', productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', quantity: 10, price: 320, subtotal: 3200 },
    ],
    totalAmount: 3350, subtotal: 3200, serviceFee: 150,
    status: 'processing', pickupMethod: 'delivery', preferredBranch: 'Agrivet North Branch',
    preferredDate: '2026-06-25', preferredTime: '14:00', specialInstructions: 'Please deliver to the farm gate.',
    paymentMethod: 'cash', createdAt: daysAgo(3), updatedAt: daysAgo(2),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(3), completed: true },
      { status: 'approved', label: 'Order Approved', date: daysAgo(2), completed: true },
      { status: 'processing', label: 'Preparing Order', date: daysAgo(1), completed: true },
      { status: 'ready', label: 'Ready for Pickup', date: '', completed: false },
      { status: 'completed', label: 'Order Completed', date: '', completed: false },
    ],
  },
  {
    id: 'bk-003', bookingNumber: 'BK-2026-000125', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-009', productName: 'Garden Tool Set', productImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', quantity: 1, price: 1500, subtotal: 1500 },
      { productId: 'prod-013', productName: 'Pruning Shears', productImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', quantity: 2, price: 450, subtotal: 900 },
    ],
    totalAmount: 2550, subtotal: 2400, serviceFee: 150,
    status: 'pending', pickupMethod: 'pickup', preferredBranch: 'Agrivet Main Branch',
    preferredDate: '2026-06-28', preferredTime: '10:00', specialInstructions: '',
    paymentMethod: 'gcash', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(1), completed: true },
      { status: 'approved', label: 'Order Approved', date: '', completed: false },
      { status: 'processing', label: 'Preparing Order', date: '', completed: false },
      { status: 'ready', label: 'Ready for Pickup', date: '', completed: false },
      { status: 'completed', label: 'Order Completed', date: '', completed: false },
    ],
  },
  {
    id: 'bk-004', bookingNumber: 'BK-2026-000126', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-002', productName: 'Pig Feeds Grower', productImage: 'https://images.unsplash.com/photo-1604848698035-8c1b5bc5b36f?w=400', quantity: 8, price: 1200, subtotal: 9600 },
    ],
    totalAmount: 9750, subtotal: 9600, serviceFee: 150,
    status: 'approved', pickupMethod: 'delivery', preferredBranch: 'Agrivet South Branch',
    preferredDate: '2026-06-22', preferredTime: '11:00', specialInstructions: 'Call upon arrival.',
    paymentMethod: 'cash', createdAt: daysAgo(2), updatedAt: daysAgo(1),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(2), completed: true },
      { status: 'approved', label: 'Order Approved', date: daysAgo(1), completed: true },
      { status: 'processing', label: 'Preparing Order', date: '', completed: false },
      { status: 'ready', label: 'Ready for Pickup', date: '', completed: false },
      { status: 'completed', label: 'Order Completed', date: '', completed: false },
    ],
  },
  {
    id: 'bk-005', bookingNumber: 'BK-2026-000127', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-007', productName: 'Herbicide Pro', productImage: 'https://images.unsplash.com/photo-1585829365295-5ccd20c0cabc?w=400', quantity: 3, price: 550, subtotal: 1650 },
      { productId: 'prod-008', productName: 'Pesticide Shield', productImage: 'https://images.unsplash.com/photo-1585829365295-5ccd20c0cabc?w=400', quantity: 2, price: 620, subtotal: 1240 },
      { productId: 'prod-016', productName: 'Fungicide Guard', productImage: 'https://images.unsplash.com/photo-1585829365295-5ccd20c0cabc?w=400', quantity: 1, price: 720, subtotal: 720 },
    ],
    totalAmount: 3760, subtotal: 3610, serviceFee: 150,
    status: 'ready', pickupMethod: 'pickup', preferredBranch: 'Agrivet Main Branch',
    preferredDate: '2026-06-21', preferredTime: '08:00', specialInstructions: '',
    paymentMethod: 'gcash', createdAt: daysAgo(5), updatedAt: daysAgo(1),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(5), completed: true },
      { status: 'approved', label: 'Order Approved', date: daysAgo(4), completed: true },
      { status: 'processing', label: 'Preparing Order', date: daysAgo(3), completed: true },
      { status: 'ready', label: 'Ready for Pickup', date: daysAgo(1), completed: true },
      { status: 'completed', label: 'Order Completed', date: '', completed: false },
    ],
  },
  {
    id: 'bk-006', bookingNumber: 'BK-2026-000128', customerId: 'usr-001',
    customerName: 'John Doe', customerEmail: 'customer@agrivet.com',
    customerPhone: '+63 912 345 6789', customerAddress: '123 Farmville St., Manila',
    products: [
      { productId: 'prod-004', productName: 'Veterinary Multivitamins', productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', quantity: 4, price: 680, subtotal: 2720 },
    ],
    totalAmount: 2870, subtotal: 2720, serviceFee: 150,
    status: 'cancelled', pickupMethod: 'pickup', preferredBranch: 'Agrivet East Branch',
    preferredDate: '2026-06-15', preferredTime: '15:00', specialInstructions: '',
    paymentMethod: 'cash', createdAt: daysAgo(10), updatedAt: daysAgo(8),
    timeline: [
      { status: 'pending', label: 'Order Placed', date: daysAgo(10), completed: true },
      { status: 'cancelled', label: 'Order Cancelled', date: daysAgo(8), completed: true },
    ],
  },
];

export const statusLabels: Record<string, string> = {
  pending: 'Pending', approved: 'Approved', processing: 'Processing',
  ready: 'Ready', completed: 'Completed', cancelled: 'Cancelled',
};
