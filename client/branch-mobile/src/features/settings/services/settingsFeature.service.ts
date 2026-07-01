import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../config/api.config";
import { User } from "../../../types";

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

export const settingsFeatureService = {
  async getProfile(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/branches/profile`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateProfile(data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/branches/profile`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    await handleResponse(res);
  },
};
