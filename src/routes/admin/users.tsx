import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

const USERS = [
  { id: "U-01", name: "سارا محمدی", email: "sara@mail.com", goldGrams: 12.4, orders: 5, status: "active" },
  { id: "U-02", name: "علی رضایی", email: "ali@mail.com", goldGrams: 3.1, orders: 2, status: "active" },
  { id: "U-03", name: "مریم احمدی", email: "maryam@mail.com", goldGrams: 0, orders: 1, status: "blocked" },
];

function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Users</p>
        <h1 className="mt-1 font-serif text-3xl">مدیریت کاربران</h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-onyx/10 bg-parchment/90">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead className="border-b border-onyx/10 text-[11px] uppercase tracking-wider text-onyx/45">
            <tr>
              <th className="p-4">کاربر</th>
              <th className="p-4">موجودی طلا</th>
              <th className="p-4">سفارش‌ها</th>
              <th className="p-4">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id} className="border-b border-onyx/5">
                <td className="p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-onyx/45">{u.email}</p>
                </td>
                <td className="p-4">{u.goldGrams} گرم</td>
                <td className="p-4">{u.orders}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      u.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status === "active" ? "فعال" : "مسدود"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}