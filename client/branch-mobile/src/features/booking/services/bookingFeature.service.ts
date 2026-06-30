import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getImageUrl } from "../../../config/api.config";
import { Product, Booking, BookingProduct } from "../../../types";

interface InventoryApiItem {
  id: string;
  productName: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  reorderPoint: number;
  expiryDate: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  subcategoryId: string | null;
  category: { id: string; name: string } | null;
  subcategory: { id: string; name: string; categoryId: string } | null;
}

interface BranchOrderApiItem {
  id: string;
  branchProfileId: string;
  branchProfile: {
    id: string;
    fullName: string;
    storeBranch: string;
    contactNumber: string;
    email: string;
    address: string | null;
  };
  totalAmount: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    branchOrderId: string;
    inventoryId: string;
    quantity: number;
    subtotal: number;
    inventory: {
      id: string;
      productName: string;
      unit: string;
      sellingPrice: number;
      imageUrl: string | null;
      stockLevel: number;
    };
  }[];
}

function toProduct(item: InventoryApiItem): Product {
  return {
    id: item.id,
    name: item.productName,
    description: item.productName,
    category: item.category?.name || "Uncategorized",
    price: Number(item.sellingPrice),
    stock: item.stockLevel,
    rating: 0,
    imageUrl: getImageUrl(item.imageUrl ?? undefined) || "",
    unit: item.unit,
    reviews: 0,
  };
}

function generateBookingNumber(id: string): string {
  return "#" + id.slice(0, 8).toUpperCase();
}

function toBooking(item: BranchOrderApiItem): Booking {
  const products: BookingProduct[] = item.items.map((i) => ({
    productId: i.inventory.id,
    productName: i.inventory.productName,
    productImage: getImageUrl(i.inventory.imageUrl ?? undefined) || "",
    quantity: i.quantity,
    price: Number(i.inventory.sellingPrice),
    subtotal: Number(i.subtotal),
  }));
  return {
    id: item.id,
    bookingNumber: generateBookingNumber(item.id),
    customerId: item.branchProfileId,
    customerName: item.branchProfile.fullName,
    customerEmail: item.branchProfile.email,
    customerPhone: item.branchProfile.contactNumber,
    customerAddress: item.branchProfile.address || "",
    products,
    totalAmount: Number(item.totalAmount),
    subtotal: products.reduce((s, p) => s + p.subtotal, 0),
    serviceFee: 0,
    status: (item.status?.toLowerCase() || "pending") as Booking["status"],
    pickupMethod: "pickup",
    preferredBranch: item.branchProfile.storeBranch,
    preferredDate: "",
    preferredTime: "",
    specialInstructions: item.notes || "",
    paymentMethod: "cash",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    timeline: [
      { status: "pending", label: "Order Placed", date: item.createdAt, completed: true },
      { status: "approved", label: "Approved", date: "", completed: item.status === "APPROVED" || item.status === "COMPLETED" },
      { status: "completed", label: "Completed", date: "", completed: item.status === "COMPLETED" },
    ],
  };
}

async function authHeaders() {
  const token = await AsyncStorage.getItem("@agrivet_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  let data: any = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data as T;
}

export const bookingFeatureService = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/inventory`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<InventoryApiItem[]>(res);
    return data.map(toProduct);
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<InventoryApiItem>(res);
    return toProduct(data);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  },

  async searchProducts(query: string): Promise<Product[]> {
    const all = await this.getProducts();
    const q = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  getCategories(): string[] {
    return [];
  },

  async createBooking(data: {
    items: { inventoryId: string; quantity: number; subtotal: number }[];
    notes?: string;
  }): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    const created = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(created);
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(data);
  },
};
