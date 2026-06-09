import { Booking, BookingItem, BookingStatus, Customer, Item } from "../../types";

let bookings: Booking[] = [
  {
    id: "b1",
    customerId: "c1",
    customerName: "Pedro Garcia",
    items: [
      { itemId: "i1", name: "Premium Chicken Feed", price: 2850, quantity: 2, subtotal: 5700 },
      { itemId: "i3", name: "Dewormer Solution", price: 320, quantity: 3, subtotal: 960 },
    ],
    total: 6660,
    status: "Success",
    notes: "Delivered on time",
    createdAt: "2025-05-10T09:00:00Z",
    updatedAt: "2025-05-12T14:00:00Z",
  },
  {
    id: "b2",
    customerId: "c2",
    customerName: "Ana Reyes",
    items: [
      { itemId: "i6", name: "Pig Grower Mix", price: 2100, quantity: 1, subtotal: 2100 },
    ],
    total: 2100,
    status: "Ongoing",
    createdAt: "2025-06-01T11:00:00Z",
    updatedAt: "2025-06-01T11:00:00Z",
  },
  {
    id: "b3",
    customerId: "c3",
    customerName: "Carlos Mendoza",
    items: [
      { itemId: "i2", name: "Vitamin Premix", price: 450, quantity: 4, subtotal: 1800 },
      { itemId: "i7", name: "Electrolyte Powder", price: 180, quantity: 10, subtotal: 1800 },
      { itemId: "i8", name: "Calcium Supplement", price: 220, quantity: 5, subtotal: 1100 },
    ],
    total: 4700,
    status: "Pending",
    createdAt: "2025-06-05T08:30:00Z",
    updatedAt: "2025-06-05T08:30:00Z",
  },
  {
    id: "b4",
    customerId: "c4",
    customerName: "Sofia Cruz",
    items: [
      { itemId: "i4", name: "Fish Meal Pellets", price: 1950, quantity: 2, subtotal: 3900 },
    ],
    total: 3900,
    status: "Cancelled",
    notes: "Customer cancelled - no longer needed",
    createdAt: "2025-05-20T10:00:00Z",
    updatedAt: "2025-05-21T09:00:00Z",
  },
  {
    id: "b5",
    customerId: "c1",
    customerName: "Pedro Garcia",
    items: [
      { itemId: "i5", name: "Corn Gluten Feed", price: 1200, quantity: 3, subtotal: 3600 },
      { itemId: "i9", name: "Goat Mineral Block", price: 150, quantity: 6, subtotal: 900 },
    ],
    total: 4500,
    status: "Success",
    createdAt: "2025-04-15T13:00:00Z",
    updatedAt: "2025-04-18T16:00:00Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingApi = {
  async getAll(): Promise<Booking[]> {
    await delay(600);
    return [...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getCompletedOrCancelled(): Promise<Booking[]> {
    await delay(500);
    return bookings
      .filter((b) => b.status === "Success" || b.status === "Cancelled")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getById(id: string): Promise<Booking | undefined> {
    await delay(400);
    return bookings.find((b) => b.id === id);
  },

  async create(data: {
    customerId: string;
    customerName: string;
    items: BookingItem[];
    notes?: string;
  }): Promise<Booking> {
    await delay(800);
    const total = data.items.reduce((sum, i) => sum + i.subtotal, 0);
    const newBooking: Booking = {
      id: "b" + Date.now(),
      ...data,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings = [newBooking, ...bookings];
    return newBooking;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    await delay(500);
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    bookings = bookings.map((b) =>
      b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
    );
    return bookings[index];
  },

  async remove(id: string): Promise<void> {
    await delay(500);
    bookings = bookings.filter((b) => b.id !== id);
  },
};
