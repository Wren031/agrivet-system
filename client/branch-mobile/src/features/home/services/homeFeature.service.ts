import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getImageUrl } from "../../../config/api.config";
import { Statistic, Booking, BookingProduct } from "../../../types";

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

export const homeFeatureService = {
  async getStatistics(): Promise<Statistic[]> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      headers: await authHeaders(),
    });
    const orders = await handleResponse<BranchOrderApiItem[]>(res);
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;
    const totalQty = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    return [
      {
        id: "1",
        title: "Total Orders",
        value: totalOrders,
        icon: "Package",
        color: "#059669",
      },
      {
        id: "2",
        title: "Pending",
        value: pending,
        icon: "Clock",
        color: "#D97706",
      },
      {
        id: "3",
        title: "Completed",
        value: completed,
        icon: "CheckCircle",
        color: "#2563EB",
      },
      {
        id: "4",
        title: "Items Ordered",
        value: totalQty,
        icon: "ShoppingCart",
        color: "#7C3AED",
      },
    ];
  },

  async getRecentOrders(limit: number = 5): Promise<Booking[]> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem[]>(res);
    return data.slice(0, limit).map(toBooking);
  },

  async getLatestBooking(): Promise<Booking | null> {
    const res = await fetch(`${API_BASE_URL}/branch-orders`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<BranchOrderApiItem[]>(res);
    if (data.length === 0) return null;
    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return toBooking(sorted[0]);
  },
};
