import { mockStatistics } from '../../../mock/statistics';
import { bookingService } from '../../../services/booking.service';
import { Statistic, Booking } from '../../../types';
import { simulateApiCall } from '../../../utils/helpers';

export const homeFeatureService = {
  async getStatistics(): Promise<Statistic[]> {
    return simulateApiCall([...mockStatistics], 800);
  },

  async getRecentOrders(): Promise<Booking[]> {
    return bookingService.getRecentOrders(5);
  },
};
