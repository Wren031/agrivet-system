import { useState, useCallback } from 'react';
import { Notification } from '../../../types';
import { mockNotifications } from '../../../mock/notifications';
import { simulateApiCall } from '../../../utils/helpers';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await simulateApiCall([...mockNotifications], 600);
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
