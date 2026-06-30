import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getImageUrl } from "../../../config/api.config";
import { Booking, BookingStatus, BookingProduct } from "../../../types";

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
      { status: "processing", label: "Processing", date: "", completed: item.status === "PROCESSING" || item.status === "COMPLETED" },
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

const statusMap: Record<string, BookingStatus | "all"> = {
  all: "all",
  pending: "pending",
  approved: "approved",
  processing: "processing",
  ready: "ready",
  completed: "completed",
  cancelled: "cancelled",
};

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

export const historyFeatureService = {
  async getAll(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem[]>(res);
    return data.map(toBooking);
  },

  async getByStatus(status: BookingStatus | "all"): Promise<Booking[]> {
    const all = await this.getAll();
    if (status === "all") return all;
    return all.filter((b) => b.status === status);
  },

  async getById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${id}`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem>(res);
    return toBooking(data);
  },

  async cancelBooking(bookingId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/branch-orders/${bookingId}/status`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    await handleResponse(res);
  },
};
