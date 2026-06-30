import { bookingApi } from "../../bookings/services/bookingApi";
import { customerApi } from "../../customers/services/customerApi";
import { itemApi } from "../../items/services/itemApi";

export interface HomeData {
  bookingCount: number;
  customerCount: number;
  productCount: number;
  todayBookingCount: number;
}

export const homeApi = {
  async getHomeData(): Promise<HomeData> {
    const [bookings, customers, products] = await Promise.all([
      bookingApi.getAll(),
      customerApi.getAll(),
      itemApi.getAll(),
    ]);

    const today = new Date().toDateString();
    const todayBookingCount = bookings.filter(
      (b) => new Date(b.createdAt).toDateString() === today
    ).length;

    return {
      bookingCount: bookings.length,
      customerCount: customers.length,
      productCount: products.length,
      todayBookingCount,
    };
  },
};
