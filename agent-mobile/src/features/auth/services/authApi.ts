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

  async uploadIdImage(imageUri: string) {
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "id.jpg";
    const ext = filename.split(".").pop() || "jpg";
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: `image/${ext}`,
    } as any);

    const response = await fetch(`${API_BASE_URL}/upload/public/id-verification`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }
    return data.url as string;
  },

  async register(fullName: string, email: string, contactNumber: string, password: string, idVerificationUrl: string) {
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
