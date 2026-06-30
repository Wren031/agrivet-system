import { useState, useEffect, useCallback } from "react";
import { bookingApi } from "../../bookings/services/bookingApi";
import { homeApi, HomeData } from "../services/homeApi";
import { Booking } from "../../../types";

export function useHomeData() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [data, bookings] = await Promise.all([
      homeApi.getHomeData(),
      bookingApi.getAll(),
    ]);
    setHomeData(data);
    setRecentBookings(bookings.slice(0, 5));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return { homeData, recentBookings, loading, refreshing, onRefresh };
}
