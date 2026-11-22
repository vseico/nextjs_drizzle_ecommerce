import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import ClearCartOnSuccess from "@/components/orders/ClearCartOnSuccess";
import PayNowButton from "@/components/orders/PayNowButton";
import {
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/pricing";
import { confirmCheckoutSession, getMyOrders } from "@/server-actions/orders/orders";
import Image from "next/image";
import Link from "next/link";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";

export const metadata = { title: "My Orders | Grocery Cart" };

interface OrdersPageProps {
  searchParams: Promise<{ session_id?: string; placed?: string; canceled?: string }>;
}

const statusColor: Record<string, string> = {
  delivered: "text-success",
  shipped: "text-primary",
  processing: "text-accent",
  pending: "text-accent",
  cancelled: "text-error",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "delivered") return <FaCheckCircle className="text-success" size={14} />;
  if (status === "shipped") return <FaTruck className="text-primary" size={15} />;
  if (status === "cancelled") return <FaTimesCircle className="text-error" size={14} />;
  return <FaClock className="text-accent" size={14} />;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const params = await searchParams;

  let justPaid = false;
  if (params.session_id) {
    const result = await confirmCheckoutSession(params.session_id);
    justPaid = result.paid;
  }

  const orders = await getMyOrders();

  return (
    <FrontedLayouts>
      {(justPaid || params.placed) && <ClearCartOnSuccess />}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        {/* header  */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Your purchases</p>
          <h1 className="mt-1 text-2xl font-semibold text-text md:text-3xl">My Orders</h1>
          <p className="mt-2 text-sm text-muted">View and track your grocery orders.</p>
        </div>

        {justPaid && (
          <div className="mb-6 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            Payment received, thank you! Your order is being prepared.
          </div>
        )}
        {params.session_id && !justPaid && (
          <div className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-text">
            We are confirming your payment. Refresh this page in a moment.
          </div>
        )}
        {params.placed && (
          <div className="mb-6 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            Order placed! You will pay on delivery.
          </div>
        )}
        {params.canceled && (
          <div className="mb-6 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            Payment for order {params.canceled} was canceled. You can pay again below.
          </div>
        )}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <FaBox className="mb-3 text-4xl text-muted" />
            <h3 className="font-medium text-text">No orders yet</h3>
            <p className="mt-1 text-sm text-muted">Your orders will appear here.</p>
            <Link
              href="/products"
              className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Start shopping
            </Link>
          </div>
        )}

        {/* orders  */}
        <div className="space-y-5">
          {orders.map((order) => {
            const needsPayment =
              order.paymentMethod === "STRIPE" &&
              order.paymentStatus !== "paid" &&
              order.orderStatus !== "cancelled";
            return (
              <div key={order.id} className="overflow-hidden rounded-xl border border-border bg-card">
                {/* Order Header  */}
                <div className="flex flex-col gap-3 border-b border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FaBox size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">Order #{order.orderId}</p>
                      <p className="text-xs text-muted">
                        Placed on{" "}
                        {order.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* Status  */}
                  <div className="flex items-center gap-3">
                    {needsPayment && <PayNowButton orderId={order.id} />}
                    <div className="flex items-center gap-2">
                      <StatusIcon status={order.orderStatus} />
                      <span className={`text-sm font-medium ${statusColor[order.orderStatus] ?? "text-accent"}`}>
                        {orderStatusLabel[order.orderStatus] ?? order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Order Content  */}
                <div className="grid gap-6 p-5 md:grid-cols-[1.5fr_1fr_1fr]">
                  {/* Products  */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={40}
                                height={40}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <FaBox size={14} className="text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text">{item.productName}</p>
                            <p className="text-xs text-muted">
                              {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address  */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">Delivery Address</h3>
                    {order.address && (
                      <div className="text-sm leading-6 text-muted">
                        <p className="font-medium text-text">
                          {order.address.firstName} {order.address.lastName}
                        </p>
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city}, {order.address.state} {order.address.postalCode}
                        </p>
                        <p>{order.address.country}</p>
                      </div>
                    )}
                  </div>
                  {/* Payment  */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted">Total</span>
                        <span className="font-semibold text-text">
                          ${Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted">Payment</span>
                        <span className="text-text">
                          {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted">Status</span>
                        <span
                          className={
                            order.paymentStatus === "paid"
                              ? "font-medium text-success"
                              : order.paymentStatus === "failed"
                                ? "font-medium text-error"
                                : "font-medium text-accent"
                          }
                        >
                          {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* footer  */}
                <div className="border-t border-border px-5 py-4">
                  <p className="text-sm text-muted">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"} in this order
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FrontedLayouts>
  );
};

export default OrdersPage;
