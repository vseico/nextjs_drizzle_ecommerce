"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export default function ClearCartOnSuccess() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  return null;
}
