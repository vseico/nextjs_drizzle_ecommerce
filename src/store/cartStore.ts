"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import type { CartItemDTO } from "@/lib/cart";
import {
  addToCart as addToCartAction,
  getCart,
  removeFromCart as removeFromCartAction,
  updateCartQuantity as updateCartQuantityAction,
} from "@/server-actions/cart/cart";
import { useAuthModal } from "./authModalStore";

type CartActionResult = Awaited<ReturnType<typeof getCart>>;

type CartStore = {
  items: CartItemDTO[];
  loaded: boolean;
  loading: boolean;
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  fetchCart: () => Promise<void>;
  reset: () => void;
  addItem: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

function handleResult(
  result: CartActionResult,
  set: (state: Partial<CartStore>) => void,
) {
  if (!result.success && result.unauthorized) {
    set({ items: [], loaded: true });
    useAuthModal.getState().openLogin();
    toast.error(result.message);
    return false;
  }
  set({ items: result.items, loaded: true });
  if (!result.success) {
    toast.error(result.message);
    return false;
  }
  return true;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loaded: false,
  loading: false,
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  fetchCart: async () => {
    set({ loading: true });
    try {
      const result = await getCart();
      set({ items: result.items, loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ items: [], loaded: false }),

  addItem: async (productId, quantity = 1) => {
    set({ loading: true });
    try {
      const result = await addToCartAction(productId, quantity);
      const ok = handleResult(result, set);
      if (ok) toast.success("Added to cart");
      return ok;
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const previous = get().items;
    set({
      items:
        quantity <= 0
          ? previous.filter((item) => item.productId !== productId)
          : previous.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
    });
    const result = await updateCartQuantityAction(productId, quantity);
    handleResult(result, set);
  },

  removeItem: async (productId) => {
    const previous = get().items;
    set({ items: previous.filter((item) => item.productId !== productId) });
    const result = await removeFromCartAction(productId);
    handleResult(result, set);
  },
}));

export const selectCartCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
