import { Notification } from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const mockNotifications: Notification[] = [
  { id: 'notif-001', title: 'Booking Approved', message: 'Your booking BK-2026-000124 has been approved and is being processed.', type: 'booking_approved', read: false, createdAt: daysAgo(1), bookingId: 'bk-002' },
  { id: 'notif-002', title: 'Booking Ready for Pickup', message: 'Your order BK-2026-000127 is now ready for pickup at Agrivet Main Branch.', type: 'booking_ready', read: false, createdAt: daysAgo(1), bookingId: 'bk-005' },
  { id: 'notif-003', title: 'Booking Completed', message: 'Your booking BK-2026-000123 has been completed. Thank you for choosing Agrivet!', type: 'booking_approved', read: true, createdAt: daysAgo(2), bookingId: 'bk-001' },
  { id: 'notif-004', title: 'New Products Available', message: 'Check out our new range of organic fertilizers and veterinary supplies!', type: 'new_product', read: false, createdAt: daysAgo(3) },
  { id: 'notif-005', title: 'Summer Sale!', message: 'Get up to 20% off on all feeds and fertilizers this summer. Limited offer!', type: 'promo', read: false, createdAt: daysAgo(4) },
  { id: 'notif-006', title: 'Booking Cancelled', message: 'Your booking BK-2026-000128 has been cancelled as per your request.', type: 'booking_cancelled', read: true, createdAt: daysAgo(5), bookingId: 'bk-006' },
  { id: 'notif-007', title: 'Weekly Promo', message: 'Buy 2 get 1 free on selected veterinary products this week only!', type: 'promo', read: true, createdAt: daysAgo(6) },
  { id: 'notif-008', title: 'Order Processing', message: 'Your order BK-2026-000125 is now being processed.', type: 'booking_approved', read: true, createdAt: daysAgo(7), bookingId: 'bk-003' },
];
