import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],

  isFavorite: (productId: string) => get().favoriteIds.includes(productId),

  toggleFavorite: (productId: string) => {
    const exists = get().favoriteIds.includes(productId);
    if (exists) {
      set({ favoriteIds: get().favoriteIds.filter((id) => id !== productId) });
    } else {
      set({ favoriteIds: [...get().favoriteIds, productId] });
    }
  },
}));
