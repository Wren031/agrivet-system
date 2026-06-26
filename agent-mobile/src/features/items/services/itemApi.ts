import { Item } from "../../../types";
import { API_BASE_URL } from "../../../config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InventoryResponse {
  id: string;
  productName: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  reorderPoint: number;
  categoryId?: string | null;
  subcategoryId?: string | null;
  expiryDate?: string | null;
  imageUrl?: string | null;
  category?: { id: string; name: string } | null;
  subcategory?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemData {
  productName: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  reorderPoint: number;
  categoryId?: string;
  subcategoryId?: string;
  expiryDate?: string;
  imageUrl?: string;
}

export interface UpdateItemData {
  productName?: string;
  unit?: string;
  costPrice?: number;
  sellingPrice?: number;
  stockLevel?: number;
  reorderPoint?: number;
  categoryId?: string | null;
  subcategoryId?: string | null;
  expiryDate?: string | null;
  imageUrl?: string | null;
}

function mapItem(inventory: InventoryResponse): Item {
  return {
    id: inventory.id,
    name: inventory.productName,
    description: "",
    price: inventory.sellingPrice,
    stock: inventory.stockLevel,
    category: inventory.category?.name || "",
    image: inventory.imageUrl ?? undefined,
    unit: inventory.unit,
    costPrice: inventory.costPrice,
    reorderPoint: inventory.reorderPoint,
    categoryId: inventory.categoryId ?? undefined,
    subcategoryId: inventory.subcategoryId ?? undefined,
    expiryDate: inventory.expiryDate ?? undefined,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
  };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem("@agrivet_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const itemApi = {
  async getAll(): Promise<Item[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory`, { headers });
    const data: InventoryResponse[] = await handleResponse(response);
    return data.map(mapItem);
  },

  async getById(id: string): Promise<Item> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, { headers });
    const data: InventoryResponse = await handleResponse(response);
    return mapItem(data);
  },

  async create(dto: CreateItemData): Promise<Item> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    const data: InventoryResponse = await handleResponse(response);
    return mapItem(data);
  },

  async update(id: string, dto: UpdateItemData): Promise<Item> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });
    const data: InventoryResponse = await handleResponse(response);
    return mapItem(data);
  },

  async remove(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Failed to delete item");
    }
  },

  async search(query: string): Promise<Item[]> {
    const allItems = await this.getAll();
    const lower = query.toLowerCase();
    return allItems.filter(
      (i) =>
        i.name.toLowerCase().includes(lower) ||
        i.category.toLowerCase().includes(lower) ||
        i.description.toLowerCase().includes(lower)
    );
  },
};
