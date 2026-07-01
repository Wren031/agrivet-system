import { useState, useCallback } from 'react';
import { FavoriteItem } from '../../../types';
import { favoritesFeatureService } from '../services/favoritesFeature.service';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await favoritesFeatureService.getAll();
      setFavorites(items);
    } catch (e: any) {
      setError(e.message || 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (inventoryId: string) => {
    const item = await favoritesFeatureService.add(inventoryId);
    setFavorites((prev) => [item, ...prev]);
    return item;
  }, []);

  const removeFavorite = useCallback(async (id: string) => {
    await favoritesFeatureService.remove(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const removeByInventory = useCallback(async (inventoryId: string) => {
    await favoritesFeatureService.removeByInventory(inventoryId);
    setFavorites((prev) => prev.filter((f) => f.inventoryId !== inventoryId));
  }, []);

  const isFavorite = useCallback(
    (inventoryId: string) => favorites.some((f) => f.inventoryId === inventoryId),
    [favorites],
  );

  return {
    favorites,
    isLoading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
    removeByInventory,
    isFavorite,
  };
}
