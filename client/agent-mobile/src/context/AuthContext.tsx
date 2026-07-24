import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import { authApi } from "../features/auth/services/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPendingApproval: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, contactNumber: string, password: string, idVerificationUrl: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isPendingApproval: false,
  login: async () => ({ success: false, message: "" }),
  register: async () => ({ success: false, message: "" } as any),
  logout: () => {},
  updateUser: async () => {},
});

const USER_STORAGE_KEY = "@agrivet_user";
const TOKEN_STORAGE_KEY = "@agrivet_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const saved = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
  };

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const { user: apiUser, token } = await authApi.login(email, password);
      const loggedInUser: User = {
        id: apiUser.id,
        fullName: apiUser.fullName,
        email: apiUser.email,
        contactNumber: apiUser.contactNumber || "",
        idVerificationUrl: apiUser.idVerificationUrl,
        role: apiUser.role?.toLowerCase() === "admin" ? "admin" : "user",
        address: "",
        password: "",
        pending_admin_approval: false,
        isApproved: true,
        createdAt: new Date().toISOString(),
        agentProfileId: apiUser.agentProfile?.id || apiUser.agentProfileId,
        status: apiUser.agentProfile?.status || apiUser.status,
      };
      setUser(loggedInUser);
      setPendingEmail(null);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (rememberMe !== false) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      const message = error.message || "Invalid email or password";
      if (message.toLowerCase().includes("not approved")) {
        setPendingEmail(email);
        return { success: false, message: "pending_approval" };
      }
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (fullName: string, email: string, contactNumber: string, password: string, idVerificationUrl: string) => {
    try {
      const { user: apiUser, token } = await authApi.register(fullName, email, contactNumber, password, idVerificationUrl);

      if (apiUser.status === 'PENDING') {
        setPendingEmail(apiUser.email);
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        return { success: true, message: "pending_approval" };
      }

      const newUser: User = {
        id: apiUser.id,
        fullName: apiUser.fullName,
        email: apiUser.email,
        contactNumber: apiUser.contactNumber || contactNumber,
        idVerificationUrl: apiUser.idVerificationUrl || idVerificationUrl,
        role: apiUser.role?.toLowerCase() === "admin" ? "admin" : "user",
        address: "",
        password: "",
        pending_admin_approval: false,
        isApproved: true,
        createdAt: new Date().toISOString(),
        agentProfileId: apiUser.agentProfile?.id || apiUser.agentProfileId,
        status: apiUser.agentProfile?.status || apiUser.status,
      };
      setUser(newUser);
      setPendingEmail(null);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      return { success: true, message: "Registration successful" };
    } catch (error: any) {
      return { success: false, message: error.message || "Registration failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setPendingEmail(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
    const saved = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const merged = { ...JSON.parse(saved), ...data };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isPendingApproval: !!pendingEmail,
    login,
    register,
    logout,
    updateUser,
  }), [user, pendingEmail, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
