"use server";

import { db } from "@/db/db";
import { cartItem, product } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "../auth/getCurrentUser";
import { loadCartItems, type CartItemDTO } from "@/lib/cart";

type CartResult =
  | { success: true; items: CartItemDTO[] }
  | { success: false; items: CartItemDTO[]; message: string; unauthorized?: boolean };

async function withUser(
  fn: (userId: string) => Promise<string | void>,
): Promise<CartResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      items: [],
      message: "Please login to use the cart.",
      unauthorized: true,
    };
  }
  try {
    const errorMessage = await fn(currentUser.id);
    const items = await loadCartItems(currentUser.id);
    if (errorMessage) {
      return { success: false, items, message: errorMessage };
    }
    return { success: true, items };
  } catch (error) {
    console.error("CART_ERROR:", error);
    return { success: false, items: [], message: "Something went wrong with your cart." };
  }
}

export async function getCart(): Promise<CartResult> {
  return withUser(async () => {});
}

export async function addToCart(productId: string, quantity = 1): Promise<CartResult> {
  return withUser(async (userId) => {
    const qty = Math.max(1, Math.floor(quantity));
    const [dbProduct] = await db
      .select({ stock: product.stock })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);
    if (!dbProduct) return "Product not found.";

    const [existing] = await db
      .select()
      .from(cartItem)
      .where(and(eq(cartItem.userId, userId), eq(cartItem.productId, productId)))
      .limit(1);

    const newQuantity = (existing?.quantity ?? 0) + qty;
    if (newQuantity > dbProduct.stock) {
      return dbProduct.stock === 0
        ? "This product is out of stock."
        : `Only ${dbProduct.stock} left in stock.`;
    }

    if (existing) {
      await db
        .update(cartItem)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cartItem.id, existing.id));
    } else {
      await db.insert(cartItem).values({
        id: crypto.randomUUID(),
        userId,
        productId,
        quantity: qty,
      });
    }
  });
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<CartResult> {
  return withUser(async (userId) => {
    const qty = Math.floor(quantity);
    const where = and(eq(cartItem.userId, userId), eq(cartItem.productId, productId));

    if (qty <= 0) {
      await db.delete(cartItem).where(where);
      return;
    }

    const [dbProduct] = await db
      .select({ stock: product.stock })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);
    if (!dbProduct) return "Product not found.";
    if (qty > dbProduct.stock) return `Only ${dbProduct.stock} left in stock.`;

    await db.update(cartItem).set({ quantity: qty, updatedAt: new Date() }).where(where);
  });
}

export async function removeFromCart(productId: string): Promise<CartResult> {
  return withUser(async (userId) => {
    await db
      .delete(cartItem)
      .where(and(eq(cartItem.userId, userId), eq(cartItem.productId, productId)));
  });
}
