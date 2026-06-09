import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import { MOCK_USERS } from "../features/auth/services/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPendingApproval: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, address: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  approveUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isPendingApproval: false,
  login: async () => ({ success: false, message: "" }),
  register: async () => ({ success: false, message: "" }),
  logout: () => {},
  approveUser: () => {},
});

const USER_STORAGE_KEY = "@agrivet_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

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

  const login = async (email: string, password: string) => {
    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, message: "Invalid email or password" };
    }
    if (found.pending_admin_approval && !found.isApproved) {
      setUser(found);
      return { success: false, message: "pending_approval" };
    }
    setUser(found);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
    return { success: true, message: "Login successful" };
  };

  const register = async (fullName: string, email: string, address: string, password: string) => {
    const exists = allUsers.find((u) => u.email === email);
    if (exists) {
      return { success: false, message: "Email already registered" };
    }
    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      email,
      address,
      password,
      role: "user",
      pending_admin_approval: true,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: "Registration successful" };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const approveUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, pending_admin_approval: false, isApproved: true } : u
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPendingApproval: !!user?.pending_admin_approval && !user?.isApproved,
        login,
        register,
        logout,
        approveUser,
      }}
    >
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
