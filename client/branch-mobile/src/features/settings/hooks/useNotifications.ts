import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../config/api.config';
import { Notification } from '../../../types';

async function fetchNotifications(): Promise<Notification[]> {
  const token = await AsyncStorage.getItem('@agrivet_token');
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = [];
  }
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to load notifications');
  }
  return data as Notification[];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchNotifications();
      setNotifications(result);
    } catch (e: any) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, isLoading, error, loadNotifications, markAsRead, markAllAsRead };
}
