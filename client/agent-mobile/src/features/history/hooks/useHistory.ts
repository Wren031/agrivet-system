import { useState, useEffect, useCallback } from "react";
import { Booking, BookingHistoryEntry, BookingStatus } from "../../../types";
import { historyApi } from "../services/historyApi";

export function useHistory() {
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await historyApi.getHistory();
      setHistory(data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getBookingHistory = useCallback(
    async (bookingId: string): Promise<BookingHistoryEntry[]> => {
      return historyApi.getBookingHistory(bookingId);
    },
    []
  );

  const recordChange = useCallback(
    async (
      bookingId: string,
      status: BookingStatus,
      note?: string
    ): Promise<void> => {
      await historyApi.recordChange(bookingId, status, note);
    },
    []
  );

  return {
    history,
    loading,
    error,
    fetchHistory,
    getBookingHistory,
    recordChange,
  };
}
