import { API_BASE_URL } from "@/config/api.config";

export const authApi = {
  
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/agent/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }
    return {
      user: data.user,
      token: data.accessToken,
    };
  },

  async register(fullName: string, email: string, contactNumber: string, password: string, idVerificationUrl?: string) {
    const response = await fetch(`${API_BASE_URL}/auth/agent/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, contactNumber, password, idVerificationUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return {
      user: data.user,
      token: data.accessToken,
    };
  },
};
