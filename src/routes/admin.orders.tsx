import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/site/Chrome";
import { getOrders, type Order } from "@/lib/orders";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const orders = getOrders();
  const [selected, setSelected] = useState<Order | null>(null);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    shipped: orders.filter((o) => o.status === "In transit" || o.status === "Delivered").length,
    totalValue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[12px] uppercase tracking-[0.35em] text-gold">Admin</span>
            <h1 className="font-serif text-4xl mt-2">Order Management</h1>
          </div>
          <Link to="/" className="text-[11px] uppercase tracking-widest text-onyx/60 hover:text-gold">
            Back to site
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Orders" value={stats.total.toString()} />
          <StatCard label="Pending" value={stats.pending.toString()} highlight />
          <StatCard label="Shipped" value={stats.shipped.toString()} />
          <StatCard label="Revenue" value={`${Math.round(stats.totalValue / 1_000_000)}M T`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="border border-onyx/10 rounded-[1.5rem] overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-serif text-2xl text-onyx/50">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-onyx/10 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className={`w-full p-4 text-left transition-colors ${
                      selected?.id === order.id ? "bg-gold/10" : "hover:bg-onyx/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-xs text-onyx/60 mt-1">{order.customer.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-onyx/50 mt-1">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{order.status}</p>
                        <p className="text-xs text-onyx/60 mt-1">{formatDate(order.placedAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="border border-onyx/10 rounded-[1.5rem] p-6 h-fit sticky top-28 bg-white/50">
              <h3 className="font-serif text-xl mb-6">{selected.id}</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-onyx/60 mb-2">Customer</p>
                  <p className="font-medium">{selected.customer.name}</p>
                  <p className="text-sm text-onyx/60 mt-1">{selected.customer.email}</p>
                  <p className="text-sm text-onyx/60">{selected.customer.phone}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-onyx/60 mb-2">Address</p>
                  <p className="text-sm leading-relaxed">
                    {selected.customer.address}
                    <br />
                    {selected.customer.city}, {selected.customer.country}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-onyx/60 mb-2">Items</p>
                  <ul className="space-y-2 text-sm">
                    {selected.items.map((item) => (
                      <li key={item.sku} className="flex justify-between">
                        <span className="text-onyx/70">{item.name} × {item.quantity}</span>
                        <span className="font-medium">{formatToman(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-onyx/10 space-y-2">
                  <Row label="Subtotal" value={formatToman(selected.subtotal)} />
                  <Row label="Shipping" value={formatToman(selected.shipping)} />
                  <div className="flex justify-between pt-2 font-serif text-lg">
                    <span>Total</span>
                    <span>{formatToman(selected.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 border ${highlight ? "border-gold bg-gold/5" : "border-onyx/10"}`}>
      <p className="text-[10px] uppercase tracking-widest text-onyx/60">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-onyx/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatToman(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n)) + " T";
}
