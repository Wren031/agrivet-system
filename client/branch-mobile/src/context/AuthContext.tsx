import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";
import { authApi } from "../features/auth/services/auth.service";

interface AuthContextType  {
  user: User | null;
  isAuthenticated: boolean;
  isPendingApproval: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; message: string }>;

  register: (
    storeName: string,
    fullName: string,
    email: string,
    contactNumber: string,
    password: string,
    idVerificationUrl: string,
    address: string
  ) => Promise<{ success: boolean; message: string }>;

  logout: () => void;

  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "@agrivet_user";
const LEGACY_TOKEN_KEY = "@agrivet_token";
const SECURE_TOKEN_KEY = "auth_token";
const SECURE_MIGRATED_KEY = "@agrivet_token_migrated";

async function getSecureToken(): Promise<string | null> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      return await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
    }
  } catch {}
  return null;
}

async function setSecureToken(token: string): Promise<void> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    }
  } catch {}
}

async function deleteSecureToken(): Promise<void> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    }
  } catch {}
}

async function migrateLegacyToken(): Promise<void> {
  try {
    const migrated = await AsyncStorage.getItem(SECURE_MIGRATED_KEY);
    if (migrated) return;

    const legacy = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
    if (legacy && (await SecureStore.isAvailableAsync())) {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, legacy);
    }
    await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
    await AsyncStorage.setItem(SECURE_MIGRATED_KEY, "true");
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await migrateLegacyToken();
        const saved = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Failed to load user", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = true
    ) => {
      try {
        const { user: apiUser, token } = await authApi.login(
          email,
          password
        );

        const mappedUser: User = {
          id: apiUser.id,
          fullName: apiUser.fullName,
          storeName: apiUser.storeName,
          email: apiUser.email,
          contactNumber: apiUser.contactNumber || "",
          idVerificationUrl: apiUser.idVerificationUrl || "",
          role:
            apiUser.role?.toLowerCase() === "admin" ? "admin" : "user",

          address: apiUser.address ?? "",
          password: "",
          pending_admin_approval: false,
          isApproved: true,
          createdAt: new Date().toISOString(),

          branchProfileId: apiUser.branchProfileId ?? null,

          status: apiUser.status ?? "ACTIVE",
        };

        setUser(mappedUser);
        setPendingEmail(null);

        await setSecureToken(token ?? "");

        if (rememberMe) {
          await AsyncStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(mappedUser)
          );
        } else {
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }

        return {
          success: true,
          message: "Login successful",
        };
      } catch (error: any) {
        const message =
          error?.message || "Invalid email or password";

        if (message.toLowerCase().includes("not approved")) {
          setPendingEmail(email);
          return {
            success: false,
            message: "pending_approval",
          };
        }

        return {
          success: false,
          message,
        };
      }
    },
    []
  );

  const register = useCallback(
    async (
      storeName: string,
      fullName: string,
      email: string,
      contactNumber: string,
      password: string,
      idVerificationUrl: string,
      address: string
    ) => {
      try {
        const { user: apiUser, token } = await authApi.register(
          storeName,
          fullName,
          email,
          contactNumber,
          password,
          idVerificationUrl,
          address
        );

        if (apiUser.status === "PENDING") {
          setPendingEmail(apiUser.email);
          await setSecureToken(token ?? "");
          return {
            success: true,
            message: "pending_approval",
          };
        }

        const mappedUser: User = {
          id: apiUser.id,
          fullName: apiUser.fullName,
          storeName: apiUser.storeName,
          email: apiUser.email,
          contactNumber: apiUser.contactNumber || "",
          idVerificationUrl: apiUser.idVerificationUrl || "",
          role:
            apiUser.role?.toLowerCase() === "admin"
              ? "admin"
              : "user",

          address: apiUser.address || address,
          password: "",
          pending_admin_approval: false,
          isApproved: true,
          createdAt: new Date().toISOString(),

          branchProfileId: apiUser.branchProfileId ?? null,

          status: apiUser.status ?? "PENDING",
        };

        setUser(mappedUser);
        setPendingEmail(null);

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(mappedUser)
        );

        await setSecureToken(token ?? "");

        return {
          success: true,
          message: "Registration successful",
        };
      } catch (error: any) {
        return {
          success: false,
          message:
            error?.message || "Registration failed",
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setUser(null);
    setPendingEmail(null);

    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await deleteSecureToken();
  }, []);

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, ...data };
      });

      const saved =
        await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...parsed, ...data };

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(merged)
        );
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isPendingApproval: !!pendingEmail,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, pendingEmail, isLoading, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
