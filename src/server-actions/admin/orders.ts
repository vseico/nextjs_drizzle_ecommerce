"use server";

import { db } from "@/db/db";
import { user } from "@/db/auth-schema";
import { address, order, orderItem, product } from "@/db/schema";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/pricing";
import { and, count, desc, eq, inArray, ne, or, sql, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth/requireAdmin";

const toShipCondition = and(
  inArray(order.orderStatus, ["pending", "processing"]),
  or(eq(order.paymentStatus, "paid"), eq(order.paymentMethod, "COD")),
);

export type AdminOrderFilter = "all" | "to-ship" | "unpaid" | "shipped" | "delivered" | "cancelled";

export async function getAdminOrders(filter: AdminOrderFilter = "all") {
  await requireAdmin();

  const where =
    filter === "to-ship"
      ? toShipCondition
      : filter === "unpaid"
        ? and(
            eq(order.paymentMethod, "STRIPE"),
            ne(order.paymentStatus, "paid"),
            ne(order.orderStatus, "cancelled"),
          )
        : filter === "shipped" || filter === "delivered" || filter === "cancelled"
          ? eq(order.orderStatus, filter)
          : undefined;

  const rows = await db
    .select({
      id: order.id,
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      customerName: user.name,
      customerEmail: user.email,
      itemCount: sql<number>`(select coalesce(sum(${orderItem.quantity}), 0) from ${orderItem} where ${orderItem.orderId} = ${order.id})`.mapWith(Number),
    })
    .from(order)
    .innerJoin(user, eq(order.userId, user.id))
    .where(where)
    .orderBy(desc(order.createdAt));

  return rows;
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return db.query.order.findFirst({
    where: or(eq(order.id, id), eq(order.orderId, id)),
    with: {
      items: true,
      address: true,
      user: { columns: { id: true, name: true, email: true } },
    },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) {
    return { success: false, message: "Invalid status." };
  }

  try {
    await db.transaction(async (tx) => {
      const [current] = await tx.select().from(order).where(eq(order.id, id)).limit(1);
      if (!current) throw new Error("Order not found");
      if (current.orderStatus === "cancelled" && status !== "cancelled") {
        throw new Error("A cancelled order cannot be reopened.");
      }

      const stockWasTaken =
        current.paymentMethod === "COD" || current.paymentStatus === "paid";

      if (status === "cancelled" && current.orderStatus !== "cancelled" && stockWasTaken) {
        const items = await tx
          .select({ productId: orderItem.productId, quantity: orderItem.quantity })
          .from(orderItem)
          .where(eq(orderItem.orderId, id));
        for (const item of items) {
          if (!item.productId) continue;
          await tx
            .update(product)
            .set({ stock: sql`${product.stock} + ${item.quantity}` })
            .where(eq(product.id, item.productId));
        }
      }

      await tx
        .update(order)
        .set({
          orderStatus: status,
          ...(status === "delivered" && current.paymentMethod === "COD"
            ? { paymentStatus: "paid" }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(order.id, id));
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");
    revalidatePath("/orders");
    return { success: true, message: "Order status updated." };
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update status.",
    };
  }
}

export async function getDashboardStats() {
  await requireAdmin();

  const [[customers], [orders], [products], [toShip], [revenue], [lowStock]] =
    await Promise.all([
      db.select({ value: count() }).from(user).where(eq(user.role, "USER")),
      db.select({ value: count() }).from(order),
      db.select({ value: count() }).from(product),
      db.select({ value: count() }).from(order).where(toShipCondition),
      db
        .select({ value: sum(order.totalAmount) })
        .from(order)
        .where(and(eq(order.paymentStatus, "paid"), ne(order.orderStatus, "cancelled"))),
      db.select({ value: count() }).from(product).where(sql`${product.stock} <= 5`),
    ]);

  const recentToShip = await db
    .select({
      id: order.id,
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      customerName: user.name,
    })
    .from(order)
    .innerJoin(user, eq(order.userId, user.id))
    .where(toShipCondition)
    .orderBy(order.createdAt)
    .limit(5);

  return {
    customers: customers.value,
    orders: orders.value,
    products: products.value,
    toShip: toShip.value,
    revenue: Number(revenue.value ?? 0),
    lowStock: lowStock.value,
    recentToShip,
  };
}

export async function getCustomers() {
  await requireAdmin();

  const customers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      totalOrders: sql<number>`(select count(*) from ${order} where ${order.userId} = ${user.id})`.mapWith(Number),
      totalSpent: sql<number>`(select coalesce(sum(${order.totalAmount}), 0) from ${order} where ${order.userId} = ${user.id} and ${order.paymentStatus} = 'paid')`.mapWith(Number),
    })
    .from(user)
    .where(eq(user.role, "USER"))
    .orderBy(desc(user.createdAt));

  const ids = customers.map((c) => c.id);
  const addresses =
    ids.length > 0
      ? await db
          .select()
          .from(address)
          .where(and(inArray(address.userId, ids), eq(address.isDefault, true)))
      : [];

  return customers.map((customer) => ({
    ...customer,
    address: addresses.find((a) => a.userId === customer.id) ?? null,
  }));
}
