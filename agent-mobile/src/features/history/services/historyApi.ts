import { bookingApi } from "../../bookings/services/bookingApi";
import { Booking, BookingHistoryEntry, BookingStatus } from "../../../types";

const entries: BookingHistoryEntry[] = [];
let initialized = false;

export const historyApi = {
  async init(): Promise<void> {
    if (initialized) return;
    try {
      const bookings = await bookingApi.getAll();
      for (const b of bookings) {
        const existing = entries.some((e) => e.bookingId === b.id);
        if (!existing) {
          entries.push({
            id: `h-${b.id}-created`,
            bookingId: b.id,
            fromStatus: null,
            toStatus: b.status,
            changedAt: b.createdAt,
            note: "Booking created",
          });
        }
      }
      initialized = true;
    } catch (e) {
      console.warn("historyApi.init failed:", e);
    }
  },

  async recordChange(
    bookingId: string,
    toStatus: BookingStatus,
    note?: string
  ): Promise<void> {
    const last = entries
      .filter((e) => e.bookingId === bookingId)
      .sort(
        (a, b) =>
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
      )[0];
    entries.push({
      id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      bookingId,
      fromStatus: last?.toStatus ?? null,
      toStatus,
      changedAt: new Date().toISOString(),
      note,
    });
  },

  async getBookingHistory(
    bookingId: string
  ): Promise<BookingHistoryEntry[]> {
    const bookingExists = await bookingApi.getById(bookingId);
    if (!bookingExists) return [];

    return entries
      .filter((e) => e.bookingId === bookingId)
      .sort(
        (a, b) =>
          new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
      );
  },

  async getHistory(): Promise<Booking[]> {
    return bookingApi.getAll();
  },

  async getAllHistory(): Promise<BookingHistoryEntry[]> {
    await this.init();
    return [...entries].sort(
      (a, b) =>
        new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );
  },
};
