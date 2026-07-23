import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

const SECURE_TOKEN_KEY = 'auth_token';
const USER_STORAGE_KEY = '@agrivet_user';

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

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: async (user: User, token: string) => {
    await setSecureToken(token);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await deleteSecureToken();
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = await getSecureToken();
      const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateUser: async (user: User) => {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set({ user });
  },
}));
