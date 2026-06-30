import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { branchOrderService } from '../services/branchOrder.service';
import { cartService, CartItemResponse } from '../services/cart.service';
import { Booking } from '../../../types';

export function useCheckout() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await cartService.getAll();
        setItems(data);
      } catch {} finally {
        setCartLoaded(true);
      }
    })();
  }, []);

  const subtotal = items.reduce((sum, i) => sum + Number(i.inventory.sellingPrice) * i.quantity, 0);
  const totalAmount = subtotal;

  const submitBooking = async (data: {
    specialInstructions?: string;
  }) => {
    if (!user) {
      setError('User not authenticated. Please login again.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (items.length === 0) {
        throw new Error('Cart is empty. Add items before booking.');
      }
      const booking = await branchOrderService.create({
        items: items.map((i) => ({
          inventoryId: i.inventoryId,
          quantity: i.quantity,
          subtotal: Number(i.inventory.sellingPrice) * i.quantity,
        })),
        notes: data.specialInstructions || undefined,
      });
      if (!booking || !booking.id) {
        throw new Error('Booking was not created. Please try again.');
      }
      setCreatedBooking(booking);
      await cartService.clearCart();
      return booking;
    } catch (e: any) {
      setError(e.message || 'Failed to create booking');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items, subtotal, totalAmount, isLoading, error, createdBooking,
    cartLoaded, submitBooking,
  };
}
