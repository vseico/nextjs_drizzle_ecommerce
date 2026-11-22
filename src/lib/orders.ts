import { db } from "@/db/db";
import { cartItem, order, orderItem, product } from "@/db/schema";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { getAppUrl, getStripe, STRIPE_CURRENCY } from "./stripe";

export function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${time}${random}`;
}

const toCents = (value: string | number) => Math.round(Number(value) * 100);

export async function createCheckoutSessionForOrder(orderId: string, customerEmail: string) {
  const dbOrder = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: { items: true },
  });
  if (!dbOrder) throw new Error("Order not found");

  const appUrl = getAppUrl();
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = dbOrder.items.map(
    (item) => ({
      quantity: item.quantity,
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: toCents(item.price),
        product_data: {
          name: item.productName || "Product",
          ...(item.productImage ? { images: [item.productImage] } : {}),
        },
      },
    }),
  );
  if (Number(dbOrder.tax) > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: toCents(dbOrder.tax),
        product_data: { name: "Tax" },
      },
    });
  }
  if (Number(dbOrder.shippingFee) > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: toCents(dbOrder.shippingFee),
        product_data: { name: "Shipping" },
      },
    });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail,
    client_reference_id: dbOrder.id,
    metadata: { orderId: dbOrder.id, orderNumber: dbOrder.orderId },
    payment_intent_data: {
      metadata: { orderId: dbOrder.id, orderNumber: dbOrder.orderId },
    },
    success_url: `${appUrl}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/orders?canceled=${dbOrder.orderId}`,
  });

  await db
    .update(order)
    .set({ stripeCheckoutSessionId: session.id, updatedAt: new Date() })
    .where(eq(order.id, dbOrder.id));

  return session;
}

export async function fulfillCheckoutSession(sessionOrId: string | Stripe.Checkout.Session) {
  const session =
    typeof sessionOrId === "string"
      ? await getStripe().checkout.sessions.retrieve(sessionOrId)
      : sessionOrId;

  if (session.payment_status !== "paid") {
    return { paid: false as const };
  }
  const orderId = session.metadata?.orderId || session.client_reference_id;
  if (!orderId) return { paid: false as const };

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(order)
      .set({
        paymentStatus: "paid",
        stripePaymentIntentId: paymentIntentId,
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(and(eq(order.id, orderId), ne(order.paymentStatus, "paid")))
      .returning({ id: order.id, userId: order.userId });

    if (!updated) return;

    const items = await tx
      .select({ productId: orderItem.productId, quantity: orderItem.quantity })
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    for (const item of items) {
      if (!item.productId) continue;
      await tx
        .update(product)
        .set({ stock: sql`GREATEST(${product.stock} - ${item.quantity}, 0)` })
        .where(eq(product.id, item.productId));
    }

    const productIds = items
      .map((item) => item.productId)
      .filter((id): id is string => Boolean(id));
    if (productIds.length > 0) {
      await tx
        .delete(cartItem)
        .where(and(eq(cartItem.userId, updated.userId), inArray(cartItem.productId, productIds)));
    }
  });

  return { paid: true as const, orderId };
}

export async function expireCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId || session.client_reference_id;
  if (!orderId) return;
  await db
    .update(order)
    .set({ paymentStatus: "failed", orderStatus: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(order.id, orderId),
        eq(order.paymentStatus, "pending"),
        eq(order.stripeCheckoutSessionId, session.id),
      ),
    );
}
