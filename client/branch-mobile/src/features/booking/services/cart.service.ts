import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getImageUrl } from "../../../config/api.config";

export interface CartItemResponse {
  id: string;
  branchProfileId: string;
  inventoryId: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  inventory: {
    id: string;
    productName: string;
    unit: string;
    sellingPrice: number;
    imageUrl: string | null;
    stockLevel: number;
  };
  branchProfile: {
    id: string;
    fullName: string;
    storeBranch: string;
    contactNumber: string;
    email: string;
    address: string | null;
  };
}

export interface CreateCartItemPayload {
  inventoryId: string;
  quantity: number;
  status: string;
}

export interface UpdateCartItemPayload {
  inventoryId?: string;
  quantity?: number;
  status?: string;
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

export const cartService = {
  async getAll(): Promise<CartItemResponse[]> {
    const res = await fetch(`${API_BASE_URL}/cart-items`, {
      headers: await authHeaders(),
    });
    return handleResponse<CartItemResponse[]>(res);
  },

  async getById(id: string): Promise<CartItemResponse> {
    const res = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      headers: await authHeaders(),
    });
    return handleResponse<CartItemResponse>(res);
  },

  async create(payload: CreateCartItemPayload): Promise<CartItemResponse> {
    const res = await fetch(`${API_BASE_URL}/cart-items`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<CartItemResponse>(res);
  },

  async update(id: string, payload: UpdateCartItemPayload): Promise<CartItemResponse> {
    const res = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<CartItemResponse>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    await handleResponse<void>(res);
  },

  async clearCart(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cart-items`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    await handleResponse<void>(res);
  },
};
