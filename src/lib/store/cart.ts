'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppliedPromo, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  promo: AppliedPromo | null;
  /** Стало true после восстановления состояния из localStorage. */
  hydrated: boolean;

  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  setPromo: (promo: AppliedPromo | null) => void;

  has: (productId: string) => boolean;
  quantityOf: (productId: string) => number;
  count: () => number;
}

const MAX_QUANTITY = 99;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      hydrated: false,

      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }
              : i,
          ),
        })),

      increment: (productId) => get().setQuantity(productId, get().quantityOf(productId) + 1),

      // Ниже единицы не опускаемся — вместо этого пользователю предлагается удалить позицию.
      decrement: (productId) => get().setQuantity(productId, get().quantityOf(productId) - 1),

      clear: () => set({ items: [], promo: null }),

      setPromo: (promo) => set({ promo }),

      has: (productId) => get().items.some((i) => i.productId === productId),
      quantityOf: (productId) => get().items.find((i) => i.productId === productId)?.quantity ?? 0,
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'ef-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, promo: state.promo }),
      onRehydrateStorage: () => () => {
        useCart.setState({ hydrated: true });
      },
    },
  ),
);

// На случай, если хранилище пустое и onRehydrateStorage не вызовется вовремя.
if (typeof window !== 'undefined') {
  queueMicrotask(() => useCart.setState({ hydrated: true }));
}
