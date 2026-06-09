import { useState, useEffect, useCallback } from "react";
import { Item } from "../../../types";
import { itemApi } from "../services/itemApi";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await itemApi.getAll();
      setItems(data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const searchItems = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchItems();
      return;
    }
    try {
      setLoading(true);
      const data = await itemApi.search(query);
      setItems(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    searchQuery,
    searchItems,
    fetchItems,
  };
}
