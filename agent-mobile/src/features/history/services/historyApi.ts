import { bookingApi } from "../../bookings/services/bookingApi";
import { Booking } from "../../../types";

export const historyApi = {
  async getHistory(): Promise<Booking[]> {
    return bookingApi.getCompletedOrCancelled();
  },
};
