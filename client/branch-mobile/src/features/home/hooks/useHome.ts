import { useState, useCallback } from 'react';
import { Statistic, Booking } from '../../../types';
import { homeFeatureService } from '../services/homeFeature.service';

export function useHome() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [recentOrders, setRecentOrders] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [stats, orders] = await Promise.all([
        homeFeatureService.getStatistics(),
        homeFeatureService.getRecentOrders(),
      ]);
      setStatistics(stats);
      setRecentOrders(orders);
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { statistics, recentOrders, isLoading, error, loadData, refresh: loadData };
}
