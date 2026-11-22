export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 5;
export const TAX_RATE = 0.02;

const round = (value: number) => Math.round(value * 100) / 100;

export function calculateTotals(items: { price: number; quantity: number }[]) {
  const subtotal = round(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const shippingFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = round(subtotal * TAX_RATE);
  const total = round(subtotal + shippingFee + tax);
  return { subtotal, shippingFee, tax, total };
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusLabel: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const orderStatusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const paymentMethodLabel: Record<string, string> = {
  COD: "Cash on Delivery",
  STRIPE: "Card (Stripe)",
};

export const paymentStatusLabel: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};
