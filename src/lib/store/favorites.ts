'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];
  hydrated: boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  count: () => number;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,

      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),

      remove: (productId) => set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),

      clear: () => set({ ids: [] }),

      has: (productId) => get().ids.includes(productId),
      count: () => get().ids.length,
    }),
    {
      name: 'ef-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);

if (typeof window !== 'undefined') {
  queueMicrotask(() => useFavorites.setState({ hydrated: true }));
}
