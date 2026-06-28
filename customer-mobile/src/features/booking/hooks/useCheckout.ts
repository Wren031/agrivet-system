import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { bookingFeatureService } from '../services/bookingFeature.service';
import { Booking, CartItem } from '../../../types';

export function useCheckout() {
  const user = useAuthStore((s) => s.user);
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const serviceFee = 150;
  const subtotal = getSubtotal();
  const totalAmount = subtotal + serviceFee;

  const submitBooking = async (data: {
    pickupMethod: 'pickup' | 'delivery';
    preferredBranch: string;
    preferredDate: string;
    preferredTime: string;
    specialInstructions?: string;
    paymentMethod: 'cash' | 'gcash';
  }) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const booking = await bookingFeatureService.createBooking({
        products: items,
        subtotal,
        totalAmount,
        serviceFee,
        ...data,
        specialInstructions: data.specialInstructions || '',
        customerId: user.id,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phoneNumber,
        customerAddress: user.address,
      });
      setCreatedBooking(booking);
      clearCart();
      return booking;
    } catch (e: any) {
      setError(e.message || 'Failed to create booking');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items, subtotal, serviceFee, totalAmount, isLoading, error, createdBooking,
    submitBooking, clearCart,
  };
}
