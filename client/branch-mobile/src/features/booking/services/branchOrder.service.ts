import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getImageUrl } from "../../../config/api.config";
import { Booking, BookingProduct } from "../../../types";

export interface BranchOrderItemApi {
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
}

export interface BranchOrderApiItem {
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
  items: BranchOrderItemApi[];
}

export interface CreateBranchOrderPayload {
  items: { inventoryId: string; quantity: number; subtotal: number }[];
  notes?: string;
}

export interface UpdateBranchOrderPayload {
  notes?: string;
}

export interface CreateBranchOrderItemPayload {
  inventoryId: string;
  quantity: number;
  subtotal: number;
}

export interface UpdateBranchOrderItemPayload {
  inventoryId?: string;
  quantity?: number;
  subtotal?: number;
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

export const branchOrderService = {
  async create(payload: CreateBranchOrderPayload): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const created = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(created);
  },

  async findAll(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem[]>(res);
    return data.map(toBooking);
  },

  async findById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(data);
  },

  async update(id: string, payload: UpdateBranchOrderPayload): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(data);
  },

  async updateStatus(id: string, status: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}/status`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(data);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    await handleResponse<void>(res);
  },

  async addItem(orderId: string, payload: CreateBranchOrderItemPayload): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${orderId}/items`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    await handleResponse(res);
  },

  async updateItem(orderId: string, itemId: string, payload: UpdateBranchOrderItemPayload): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${orderId}/items/${itemId}`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    await handleResponse(res);
  },

  async removeItem(orderId: string, itemId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${orderId}/items/${itemId}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    await handleResponse(res);
  },
};
