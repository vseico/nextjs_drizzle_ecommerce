import OrderStatusForm from "@/components/admin/OrderStatusForm";
import {
  orderStatusLabel,
  orderStatusStyles,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/pricing";
import { getAdminOrder } from "@/server-actions/admin/orders";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaTimesCircle,
} from "react-icons/fa";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = await getAdminOrder(orderId);
  if (!order) notFound();

  const shippingFee = Number(order.shippingFee);
  const paid = order.paymentStatus === "paid";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <FaArrowLeft size={13} />
          Back to Orders
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text">Order {order.orderId}</h1>
            <p className="mt-1 text-sm text-muted">
              Placed on{" "}
              {order.createdAt.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <span className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${orderStatusStyles[order.orderStatus] ?? ""}`}>
            {orderStatusLabel[order.orderStatus] ?? order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Order Items</h2>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                    {item.productImage ? (
                      <Image
                        width={80}
                        height={80}
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FaBox className="text-muted" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="truncate font-medium text-text">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.unit ? `${item.unit} × ` : "Qty: "}
                      {item.quantity}
                    </p>
                    {!item.productId && (
                      <p className="mt-1 text-xs text-error">Product was deleted</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    <p className="font-medium text-text">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-muted">${Number(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-muted">Name</p>
                <p className="mt-1 text-sm font-medium text-text">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted">Email</p>
                <p className="mt-1 break-all text-sm font-medium text-text">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted">Phone</p>
                <p className="mt-1 text-sm font-medium text-text">{order.address?.phone ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <FaMapMarkerAlt className="text-primary" />
              <h2 className="font-semibold text-text">Delivery Address</h2>
            </div>

            {order.address && (
              <div className="p-5 text-sm text-muted">
                <p className="font-medium text-text">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="mt-1">{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Order Summary</h2>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? "font-medium text-success" : ""}>
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tax (2%)</span>
                <span>${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="my-4 border-t border-border" />
              <div className="flex justify-between text-base font-semibold text-text">
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Payment Information</h2>
            </div>

            <div className="space-y-4 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Payment Method</span>
                <span className="font-medium text-text">
                  {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment Status</span>
                <span
                  className={`flex items-center gap-1.5 font-medium ${
                    paid ? "text-success" : order.paymentStatus === "failed" ? "text-error" : "text-accent"
                  }`}
                >
                  {paid ? <FaCheckCircle size={13} /> : order.paymentStatus === "failed" ? <FaTimesCircle size={13} /> : <FaClock size={13} />}
                  {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                </span>
              </div>
              {order.stripePaymentIntentId && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Stripe payment</span>
                  <a
                    href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-medium text-primary hover:underline"
                  >
                    View in Stripe
                  </a>
                </div>
              )}
              {order.paymentMethod === "STRIPE" && !paid && (
                <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                  Not paid yet — do not ship this order until payment is received.
                </p>
              )}
            </div>
          </div>

          {/* Order Status */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Order Status</h2>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F7EF] text-primary">
                  {order.orderStatus === "delivered" ? <FaCheckCircle size={16} /> : <FaClock size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {orderStatusLabel[order.orderStatus] ?? order.orderStatus}
                  </p>
                  <p className="text-xs text-muted">Current order status</p>
                </div>
              </div>

              <OrderStatusForm orderId={order.id} currentStatus={order.orderStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
