import { useState, useCallback } from 'react';
import { Booking, BookingStatus } from '../../../types';
import { historyFeatureService } from '../services/historyFeature.service';

export function useBookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async (status: BookingStatus | 'all' = activeTab) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await historyFeatureService.getByStatus(status);
      setBookings(result);
    } catch (e: any) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const changeTab = useCallback(async (tab: BookingStatus | 'all') => {
    setActiveTab(tab);
    setIsLoading(true);
    setError(null);
    try {
      const result = await historyFeatureService.getByStatus(tab);
      setBookings(result);
    } catch (e: any) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      await historyFeatureService.cancelBooking(bookingId);
      await loadBookings();
      return true;
    } catch {
      return false;
    }
  }, [loadBookings]);

  return { bookings, activeTab, isLoading, error, loadBookings, changeTab, cancelBooking };
}
