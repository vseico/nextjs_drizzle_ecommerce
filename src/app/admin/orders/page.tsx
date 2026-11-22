import { orderStatusLabel, orderStatusStyles, paymentMethodLabel, paymentStatusLabel } from "@/lib/pricing";
import { getAdminOrders, type AdminOrderFilter } from "@/server-actions/admin/orders";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";

const filters: { key: AdminOrderFilter; label: string }[] = [
  { key: "to-ship", label: "Awaiting shipment" },
  { key: "all", label: "All" },
  { key: "unpaid", label: "Unpaid" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const paymentStyles: Record<string, string> = {
  paid: "text-success",
  pending: "text-accent",
  failed: "text-error",
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

interface OrdersPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const filter = (filters.find((f) => f.key === params.filter)?.key ?? "to-ship") as AdminOrderFilter;
  const orders = await getAdminOrders(filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Orders</h1>
        <p className="mt-1 text-sm text-muted">Manage and track customer orders.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={`/admin/orders?filter=${f.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f.key
                ? "bg-primary text-white"
                : "border border-border bg-card text-muted hover:text-primary"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Desktop Header */}
        <div className="hidden grid-cols-[1.3fr_1.5fr_0.7fr_0.8fr_1.3fr_1fr_1fr] gap-4 border-b border-border bg-background px-5 py-4 text-sm font-medium text-muted lg:grid">
          <p>Order ID</p>
          <p>Customer</p>
          <p>Items</p>
          <p>Amount</p>
          <p>Payment</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {/* Orders */}
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <div key={order.id} className="px-5 py-5 transition hover:bg-background">
              {/* Desktop */}
              <div className="hidden grid-cols-[1.3fr_1.5fr_0.7fr_0.8fr_1.3fr_1fr_1fr] items-center gap-4 text-sm lg:grid">
                <div>
                  <p className="font-medium text-text">{order.orderId}</p>
                  <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{order.customerName}</p>
                  <p className="truncate text-xs text-muted">{order.customerEmail}</p>
                </div>

                <p className="text-muted">
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </p>

                <p className="font-medium text-text">${Number(order.totalAmount).toFixed(2)}</p>

                <div>
                  <p className="text-muted">{paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</p>
                  <p className={`text-xs font-medium ${paymentStyles[order.paymentStatus] ?? ""}`}>
                    {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                  </p>
                </div>

                <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.orderStatus] ?? ""}`}>
                  {orderStatusLabel[order.orderStatus] ?? order.orderStatus}
                </span>

                {/* View Order */}
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="w-fit rounded-lg bg-[#E8F7EF] px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                >
                  View Order
                </Link>
              </div>

              {/* Mobile / Tablet */}
              <div className="lg:hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F7EF] text-primary">
                      <FaBoxOpen size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-text">{order.orderId}</p>
                      <p className="text-sm text-muted">{order.customerName}</p>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.orderStatus] ?? ""}`}>
                    {orderStatusLabel[order.orderStatus] ?? order.orderStatus}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted">Items</p>
                    <p className="mt-1 font-medium text-text">{order.itemCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Amount</p>
                    <p className="mt-1 font-medium text-text">${Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Payment</p>
                    <p className="mt-1 font-medium text-text">
                      {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                    </p>
                    <p className={`text-xs font-medium ${paymentStyles[order.paymentStatus] ?? ""}`}>
                      {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Date</p>
                    <p className="mt-1 font-medium text-text">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {/* Mobile View Button */}
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="mt-5 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaBoxOpen className="mb-3 text-4xl text-muted" />
            <h3 className="font-medium text-text">No orders found</h3>
            <p className="mt-1 text-sm text-muted">
              {filter === "to-ship"
                ? "Nothing waiting to be shipped right now."
                : "Customer orders will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
