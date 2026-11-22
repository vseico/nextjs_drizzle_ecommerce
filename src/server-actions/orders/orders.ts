"use server";

import { db } from "@/db/db";
import { address, cartItem, order, orderItem, product } from "@/db/schema";
import { loadCartItems } from "@/lib/cart";
import {
  createCheckoutSessionForOrder,
  fulfillCheckoutSession,
  generateOrderNumber,
} from "@/lib/orders";
import { calculateTotals } from "@/lib/pricing";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/getCurrentUser";

type PlaceOrderResult =
  | { success: true; redirectUrl: string }
  | { success: false; message: string };

class OrderError extends Error {}

export async function placeOrder(input: {
  addressId: string;
  paymentMethod: "COD" | "STRIPE";
}): Promise<PlaceOrderResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, message: "Please login first." };

  const paymentMethod = input.paymentMethod === "STRIPE" ? "STRIPE" : "COD";
  if (paymentMethod === "STRIPE" && !process.env.STRIPE_SECRET_KEY) {
    return { success: false, message: "Online payment is not configured yet." };
  }

  try {
    const [deliveryAddress] = await db
      .select({ id: address.id })
      .from(address)
      .where(and(eq(address.id, input.addressId), eq(address.userId, currentUser.id)))
      .limit(1);
    if (!deliveryAddress) {
      return { success: false, message: "Please select a delivery address." };
    }

    const items = await loadCartItems(currentUser.id);
    if (items.length === 0) return { success: false, message: "Your cart is empty." };

    const outOfStock = items.find((item) => item.quantity > item.stock);
    if (outOfStock) {
      return {
        success: false,
        message:
          outOfStock.stock === 0
            ? `${outOfStock.name} is out of stock.`
            : `Only ${outOfStock.stock} of ${outOfStock.name} left in stock.`,
      };
    }

    const totals = calculateTotals(items);
    const id = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(order).values({
        id,
        orderId: generateOrderNumber(),
        userId: currentUser.id,
        addressId: deliveryAddress.id,
        subtotal: totals.subtotal.toFixed(2),
        shippingFee: totals.shippingFee.toFixed(2),
        tax: totals.tax.toFixed(2),
        totalAmount: totals.total.toFixed(2),
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
      });

      await tx.insert(orderItem).values(
        items.map((item) => ({
          id: crypto.randomUUID(),
          orderId: id,
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
      );

      if (paymentMethod === "COD") {
        for (const item of items) {
          const updated = await tx
            .update(product)
            .set({ stock: sql`${product.stock} - ${item.quantity}` })
            .where(and(eq(product.id, item.productId), gte(product.stock, item.quantity)))
            .returning({ id: product.id });
          if (updated.length === 0) {
            throw new OrderError(`${item.name} just went out of stock.`);
          }
        }
        await tx.delete(cartItem).where(eq(cartItem.userId, currentUser.id));
      }
    });

    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    if (paymentMethod === "COD") {
      return { success: true, redirectUrl: "/orders?placed=1" };
    }

    const session = await createCheckoutSessionForOrder(id, currentUser.email);
    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { success: true, redirectUrl: session.url };
  } catch (error) {
    if (error instanceof OrderError) return { success: false, message: error.message };
    console.error("PLACE_ORDER_ERROR:", error);
    return { success: false, message: "Failed to place order. Please try again." };
  }
}

export async function payForOrder(orderId: string): Promise<PlaceOrderResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, message: "Please login first." };

  const [dbOrder] = await db
    .select()
    .from(order)
    .where(and(eq(order.id, orderId), eq(order.userId, currentUser.id)))
    .limit(1);
  if (!dbOrder) return { success: false, message: "Order not found." };
  if (dbOrder.paymentMethod !== "STRIPE" || dbOrder.paymentStatus === "paid") {
    return { success: false, message: "This order does not need payment." };
  }
  if (dbOrder.orderStatus === "cancelled") {
    return { success: false, message: "This order was cancelled." };
  }

  try {
    const session = await createCheckoutSessionForOrder(dbOrder.id, currentUser.email);
    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { success: true, redirectUrl: session.url };
  } catch (error) {
    console.error("PAY_FOR_ORDER_ERROR:", error);
    return { success: false, message: "Could not start payment. Please try again." };
  }
}

export async function confirmCheckoutSession(sessionId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !sessionId || !process.env.STRIPE_SECRET_KEY) return { paid: false };

  const [dbOrder] = await db
    .select({ id: order.id })
    .from(order)
    .where(and(eq(order.stripeCheckoutSessionId, sessionId), eq(order.userId, currentUser.id)))
    .limit(1);
  if (!dbOrder) return { paid: false };

  try {
    const result = await fulfillCheckoutSession(sessionId);
    return { paid: result.paid };
  } catch (error) {
    console.error("CONFIRM_CHECKOUT_ERROR:", error);
    return { paid: false };
  }
}

export async function getMyOrders() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];
  return db.query.order.findMany({
    where: eq(order.userId, currentUser.id),
    with: { items: true, address: true },
    orderBy: desc(order.createdAt),
  });
}
