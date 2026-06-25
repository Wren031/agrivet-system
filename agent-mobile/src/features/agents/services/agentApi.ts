import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../config/api.config";
import { AgentStatus } from "../../../types";

const TOKEN_KEY = "@agrivet_token";

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

interface BackendLocation {
  id: string;
  agentId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export const agentApi = {
  async updateStatus(agentId: string, status: AgentStatus): Promise<{ id: string; status: AgentStatus }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async updateLocation(agentId: string, latitude: number, longitude: number): Promise<BackendLocation> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}/location`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ latitude, longitude }),
    });
    return handleResponse(res);
  },

  async getLocation(agentId: string): Promise<BackendLocation | { message: string }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}/location`, { headers });
    return handleResponse(res);
  },

  async getAgent(agentId: string): Promise<{ id: string; status: AgentStatus }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}`, { headers });
    return handleResponse(res);
  },
};
