import { paymentMethodLabel } from "@/lib/pricing";
import { getDashboardStats } from "@/server-actions/admin/orders";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiBox,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

export default async function Dashboard() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Awaiting shipment",
      value: stats.toShip.toLocaleString(),
      icon: FiTruck,
      href: "/admin/orders?filter=to-ship",
      highlight: stats.toShip > 0,
    },
    {
      title: "Revenue (paid)",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: FiDollarSign,
      href: "/admin/orders?filter=all",
    },
    {
      title: "Total Orders",
      value: stats.orders.toLocaleString(),
      icon: FiShoppingBag,
      href: "/admin/orders?filter=all",
    },
    {
      title: "Total Customers",
      value: stats.customers.toLocaleString(),
      icon: FiUsers,
      href: "/admin/customers",
    },
    {
      title: "Total Products",
      value: stats.products.toLocaleString(),
      icon: FiBox,
      href: "/admin/products",
    },
    {
      title: "Low stock (≤ 5)",
      value: stats.lowStock.toLocaleString(),
      icon: FiAlertTriangle,
      href: "/admin/products",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`rounded-xl border bg-card p-5 transition hover:border-primary ${
                stat.highlight ? "border-primary" : "border-border"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F7EF] text-primary">
                <Icon size={22} />
              </div>
              <div className="mt-5">
                <p className="text-sm text-muted">{stat.title}</p>
                <h2 className="mt-1 text-2xl font-semibold text-text">{stat.value}</h2>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-text">Oldest orders waiting to be shipped</h2>
          <Link href="/admin/orders?filter=to-ship" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {stats.recentToShip.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">All caught up — nothing to ship.</p>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentToShip.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm transition hover:bg-background"
              >
                <div>
                  <p className="font-medium text-text">{order.orderId}</p>
                  <p className="text-xs text-muted">
                    {order.customerName} · {order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text">${Number(order.totalAmount).toFixed(2)}</p>
                  <p className="text-xs text-muted">{paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
