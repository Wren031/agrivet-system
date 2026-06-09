import { useState, useEffect, useCallback } from "react";
import { Booking } from "../../../types";
import { historyApi } from "../services/historyApi";

export function useHistory() {
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await historyApi.getHistory();
      setHistory(data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
  };
}
