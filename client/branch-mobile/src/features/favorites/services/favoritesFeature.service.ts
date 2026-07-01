import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getImageUrl } from '../../../config/api.config';
import { FavoriteItem } from '../../../types';

interface FavoriteApiItem {
  id: string;
  branchProfileId: string;
  inventoryId: string;
  createdAt: string;
  inventory: {
    id: string;
    productName: string;
    unit: string;
    sellingPrice: number;
    stockLevel: number;
    imageUrl: string | null;
    category: { id: string; name: string } | null;
    subcategory: { id: string; name: string; categoryId: string } | null;
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

async function authHeaders() {
  const token = await AsyncStorage.getItem('@agrivet_token');
  return {
    'Content-Type': 'application/json',
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
    throw new Error(data?.message || 'Request failed');
  }
  return data as T;
}

function toFavoriteItem(item: FavoriteApiItem): FavoriteItem {
  return {
    id: item.id,
    inventoryId: item.inventoryId,
    createdAt: item.createdAt,
    productName: item.inventory.productName,
    productImage: getImageUrl(item.inventory.imageUrl ?? undefined) || '',
    price: Number(item.inventory.sellingPrice),
    stock: item.inventory.stockLevel,
    unit: item.inventory.unit,
    category: item.inventory.category?.name || 'Uncategorized',
  };
}

export const favoritesFeatureService = {
  async getAll(): Promise<FavoriteItem[]> {
    const res = await fetch(`${API_BASE_URL}/add-to-favorite`, {
      headers: await authHeaders(),
    });
    const data = await handleResponse<FavoriteApiItem[]>(res);
    return data.map(toFavoriteItem);
  },

  async add(inventoryId: string): Promise<FavoriteItem> {
    const res = await fetch(`${API_BASE_URL}/add-to-favorite`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ inventoryId }),
    });
    const data = await handleResponse<FavoriteApiItem>(res);
    return toFavoriteItem(data);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/add-to-favorite/${id}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    await handleResponse(res);
  },

  async removeByInventory(inventoryId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/add-to-favorite/inventory/${inventoryId}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    await handleResponse(res);
  },
};
