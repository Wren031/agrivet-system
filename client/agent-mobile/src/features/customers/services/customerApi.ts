import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../config/api.config";
import { Customer } from "../../../types";

const TOKEN_KEY = "@agrivet_token";
const ADDR_DELIMITER = "||";

interface CustomerResponse {
  id: string;
  fullName: string;
  phone: string;
  storeName: string | null;
  address: string;
  agentProfileId: string | null;
  createdAt: string;
  updatedAt: string;
}

function getHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function getToken(): Promise<string | undefined> {
  try {
    return (await AsyncStorage.getItem(TOKEN_KEY)) ?? undefined;
  } catch {
    return undefined;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status}. Could not parse response.`);
  }
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data;
}

function toBackendAddress(c: {
  region: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
}): string {
  return [c.region, c.province, c.city, c.barangay, c.address].join(ADDR_DELIMITER);
}

function fromBackendCustomer(raw: CustomerResponse): Customer {
  const parts = (raw.address || "").split(ADDR_DELIMITER);
  return {
    id: raw.id,
    name: raw.fullName,
    phone: raw.phone,
    storeName: raw.storeName ?? "",
    region: parts[0] ?? "",
    province: parts[1] ?? "",
    city: parts[2] ?? "",
    barangay: parts[3] ?? "",
    address: parts[4] ?? raw.address ?? "",
    agentProfileId: raw.agentProfileId ?? undefined,
    createdAt: raw.createdAt,
  };
}

export const customerApi = {
  async getAll(): Promise<Customer[]> {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/customers`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse<CustomerResponse[]>(res);
    return (data ?? []).map(fromBackendCustomer);
  },

  async getById(id: string): Promise<Customer | undefined> {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse<CustomerResponse>(res);
    return fromBackendCustomer(data);
  },

  async create(data: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    const token = await getToken();
    const body: Record<string, any> = {
      fullName: data.name,
      phone: data.phone,
      storeName: data.storeName || undefined,
      address: toBackendAddress(data),
    };
    if (data.agentProfileId) body.agentProfileId = data.agentProfileId;
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    const raw = await handleResponse<CustomerResponse>(res);
    return fromBackendCustomer(raw);
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const token = await getToken();
    const body: Record<string, any> = {};
    if (data.name) body.fullName = data.name;
    if (data.phone) body.phone = data.phone;
    if (data.storeName !== undefined) body.storeName = data.storeName || undefined;
    if (data.region || data.province || data.city || data.barangay || data.address) {
      body.address = toBackendAddress({
        region: data.region ?? "",
        province: data.province ?? "",
        city: data.city ?? "",
        barangay: data.barangay ?? "",
        address: data.address ?? "",
      });
    }
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    const raw = await handleResponse<CustomerResponse>(res);
    return fromBackendCustomer(raw);
  },

  async remove(id: string): Promise<void> {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    await handleResponse<any>(res);
  },
};
