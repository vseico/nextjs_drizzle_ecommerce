import { getCustomers } from "@/server-actions/admin/orders";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Customers</h1>
        <p className="mt-1 text-sm text-muted">View and manage your customers.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-border bg-background">
            <tr className="text-left">
              <th className="px-5 py-4 font-semibold text-text">Customer</th>
              <th className="px-5 py-4 font-semibold text-text">Address</th>
              <th className="px-5 py-4 font-semibold text-text">Total Orders</th>
              <th className="px-5 py-4 font-semibold text-text">Total Spent</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-background/60">
                <td className="px-5 py-4">
                  <p className="font-medium text-text">{customer.name}</p>
                  <p className="mt-1 text-muted">{customer.email}</p>
                </td>

                <td className="px-5 py-4 text-muted">
                  {customer.address ? (
                    <>
                      <p>{customer.address.street}</p>
                      <p>
                        {customer.address.city}, {customer.address.state} {customer.address.postalCode}
                      </p>
                      <p>{customer.address.country}</p>
                    </>
                  ) : (
                    <p>No address yet</p>
                  )}
                </td>

                <td className="px-5 py-4 font-medium text-text">{customer.totalOrders}</td>

                <td className="px-5 py-4 font-medium text-primary">
                  ${customer.totalSpent.toFixed(2)}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
