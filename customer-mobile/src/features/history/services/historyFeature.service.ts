import { historyService } from '../../../services/history.service';
import { bookingService } from '../../../services/booking.service';
import { Booking, BookingStatus } from '../../../types';

export const historyFeatureService = {
  getAll: historyService.getAll,
  getByStatus: historyService.getByStatus,
  getById: historyService.getById,
  cancelBooking: bookingService.cancelBooking,
};
