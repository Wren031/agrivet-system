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
const TOKEN_STORAGE_KEY = "@agrivet_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored user
  useEffect(() => {
    (async () => {
      try {
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

  // ---------------- LOGIN ----------------
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

        await AsyncStorage.setItem(
          TOKEN_STORAGE_KEY,
          token ?? ""
        );

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

  // ---------------- REGISTER ----------------
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

        // Pending approval
        if (apiUser.status === "PENDING") {
          setPendingEmail(apiUser.email);

          await AsyncStorage.setItem(
            TOKEN_STORAGE_KEY,
            token ?? ""
          );

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

        await AsyncStorage.setItem(
          TOKEN_STORAGE_KEY,
          token ?? ""
        );

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

  // ---------------- LOGOUT ----------------
  const logout = useCallback(async () => {
    setUser(null);
    setPendingEmail(null);

    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  // ---------------- UPDATE USER ----------------
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

  // ---------------- CONTEXT VALUE ----------------
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

// ---------------- HOOK ----------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}