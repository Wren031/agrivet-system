import { create } from 'zustand';
import { FavoriteItem } from '../types';
import { favoritesFeatureService } from '../features/favorites/services/favoritesFeature.service';

interface FavoritesState {
  favorites: FavoriteItem[];
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (inventoryId: string) => boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (inventoryId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  favoriteIds: [],
  isLoading: false,

  isFavorite: (inventoryId: string) => get().favoriteIds.includes(inventoryId),

  loadFavorites: async () => {
    set({ isLoading: true });
    try {
      const items = await favoritesFeatureService.getAll();
      set({ favorites: items, favoriteIds: items.map((f) => f.inventoryId), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (inventoryId: string) => {
    const exists = get().favoriteIds.includes(inventoryId);
    try {
      if (exists) {
        await favoritesFeatureService.removeByInventory(inventoryId);
        set({
          favorites: get().favorites.filter((f) => f.inventoryId !== inventoryId),
          favoriteIds: get().favoriteIds.filter((id) => id !== inventoryId),
        });
      } else {
        const item = await favoritesFeatureService.add(inventoryId);
        set({
          favorites: [item, ...get().favorites],
          favoriteIds: [item.inventoryId, ...get().favoriteIds],
        });
      }
    } catch {
      // silently fail — the UI will still toggle locally on next load
    }
  },
}));
