import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../config/api.config";

async function getSecureToken(): Promise<string | null> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      return await SecureStore.getItemAsync("auth_token");
    }
  } catch {}
  return null;
}

export const authApi = {

  async login(email: string, password: string) {
    const response = await fetch(
      `${API_BASE_URL}/auth/branches/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Invalid credentials"
      );
    }

    return {
      user: data.user,
      token: data.accessToken ?? data.token,
    };
  },

  async register(
    storeName: string,
    fullName: string,
    email: string,
    contactNumber: string,
    password: string,
    idVerificationUrl: string,
    address: string
  ) {
    const response = await fetch(
      `${API_BASE_URL}/auth/branches/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName,
          fullName,
          email,
          contactNumber,
          password,
          idVerificationUrl,
          address,
        }),
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Registration failed"
      );
    }

    return {
      user: data.user,
      token: data.accessToken ?? data.token,
    };
  },

  async uploadIdImage(imageUri: string) {
    const formData = new FormData();

    const filename =
      imageUri.split("/").pop() || "id.jpg";
    const ext =
      filename.split(".").pop() || "jpg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: `image/${ext}`,
    } as any);

    const response = await fetch(
      `${API_BASE_URL}/upload/public/id-verification`,
      {
        method: "POST",
        body: formData,
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Image upload failed"
      );
    }

    return data.url as string;
  },

  async forgotPassword(email: string) {
    const response = await fetch(
      `${API_BASE_URL}/auth/branches/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to send reset link"
      );
    }

    return data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ) {
    const token = await getSecureToken();

    const response = await fetch(
      `${API_BASE_URL}/auth/agent/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to change password"
      );
    }

    return data;
  },
};
