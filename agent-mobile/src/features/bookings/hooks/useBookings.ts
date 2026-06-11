import { useState, useEffect, useCallback } from "react";
import { Booking, BookingItem, BookingStatus } from "../../../types";
import { bookingApi } from "../services/bookingApi";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getAll();
      setBookings(data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (data: {
    customerId: string;
    customerName: string;
    items: BookingItem[];
    notes?: string;
  }) => {
    const newBooking = await bookingApi.create(data);
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const updated = await bookingApi.updateStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };

  const updateBookingItems = async (id: string, items: BookingItem[]) => {
    const updated = await bookingApi.updateItems(id, items);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };

  const deleteBooking = async (id: string) => {
    await bookingApi.remove(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    updateBookingItems,
    deleteBooking,
  };
}
