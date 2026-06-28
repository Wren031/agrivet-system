import { productService } from '../../../services/product.service';
import { bookingService } from '../../../services/booking.service';
import { Product, CartItem, Booking } from '../../../types';

export const bookingFeatureService = {
  getProducts: productService.getAll,
  getProductById: productService.getById,
  getProductsByCategory: productService.getByCategory,
  searchProducts: productService.search,
  getCategories: productService.getCategories,
  createBooking: bookingService.create,
  getBookingById: bookingService.getById,
};
