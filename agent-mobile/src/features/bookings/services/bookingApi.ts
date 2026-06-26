import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../config/api.config";
import { Booking, BookingItem, BookingStatus } from "../../../types";

const TOKEN_KEY = "@agrivet_token";

interface BackendOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  orderId: string;
  inventoryId: string | null;
  inventory: { id: string; productName: string; sellingPrice: number } | null;
}

interface BackendCustomer {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
}

interface BackendOrder {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "COMPLETED";
  notes: string | null;
  customerId: string;
  agentProfileId: string | null;
  customer: BackendCustomer;
  items: BackendOrderItem[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_MAP: Record<string, BookingStatus> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  COMPLETED: "Delivered",
};

const STATUS_MAP_REVERSE: Record<BookingStatus, string> = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Delivered: "COMPLETED",
};

function mapStatus(status: string): BookingStatus {
  return STATUS_MAP[status] || "Pending";
}

let _historyApi: any = null;
async function getHistoryApi() {
  if (!_historyApi) {
    const mod = await import("../../history/services/historyApi");
    _historyApi = mod.historyApi;
  }
  return _historyApi;
}

function mapItem(item: BackendOrderItem): BookingItem {
  return {
    itemId: item.inventoryId || item.id,
    name: item.inventory?.productName ?? "Unknown Item",
    price: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
  };
}

function fromBackendOrder(order: BackendOrder): Booking {
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: order.customer?.fullName ?? "Unknown",
    items: (order.items ?? []).map(mapItem),
    total: order.totalAmount,
    status: mapStatus(order.status),
    notes: order.notes ?? undefined,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned ${response.status}: ${text}`);
  }
  if (!response.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg || `Request failed (${response.status})`);
  }
  return data;
}

export const bookingApi = {
  async getAll(): Promise<Booking[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders`, { headers });
    const data: BackendOrder[] = await handleResponse(res);
    return (data ?? []).map(fromBackendOrder);
  },

  async getCompleted(): Promise<Booking[]> {
    const all = await this.getAll();
    return all
      .filter((b) => b.status === "Delivered")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  async getById(id: string): Promise<Booking | undefined> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, { headers });
    const data: BackendOrder = await handleResponse(res);
    return fromBackendOrder(data);
  },

  async create(data: {
    customerId: string;
    customerName: string;
    items: BookingItem[];
    notes?: string;
  }): Promise<Booking> {
    const headers = await getAuthHeaders();
    const body: Record<string, any> = {
      customerId: data.customerId,
    };
    if (data.notes) body.notes = data.notes;
    if (data.items && data.items.length > 0) {
      body.items = data.items.map((item) => {
        const entry: Record<string, any> = {
          quantity: Math.floor(Number(item.quantity)) || 1,
          unitPrice: Number(item.price) || 0,
        };
        if (item.itemId) entry.inventoryId = item.itemId;
        return entry;
      });
    }
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const order: BackendOrder = await handleResponse(res);
    const booking = fromBackendOrder(order);
    getHistoryApi().then((api) => api.recordChange(booking.id, "Pending"));
    return booking;
  },

  async updateStatus(
    id: string,
    status: BookingStatus
  ): Promise<Booking> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: STATUS_MAP_REVERSE[status] }),
    });
    const order: BackendOrder = await handleResponse(res);
    const booking = fromBackendOrder(order);
    getHistoryApi().then((api) => api.recordChange(id, status));
    return booking;
  },

  async updateItems(id: string, items: BookingItem[]): Promise<Booking> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        items: items.map((item) => {
          const entry: Record<string, any> = {
            quantity: Math.floor(Number(item.quantity)) || 1,
            unitPrice: Number(item.price) || 0,
          };
          if (item.itemId) entry.inventoryId = item.itemId;
          return entry;
        }),
      }),
    });
    const updated: BackendOrder = await handleResponse(res);
    return fromBackendOrder(updated);
  },

  async remove(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to delete booking");
    }
  },
};
