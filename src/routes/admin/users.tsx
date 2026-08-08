import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStoredUsers } from "@/lib/auth";
import { listAdminEvents } from "@/lib/admin-events";
import { ADMIN_PANEL_EVENTS } from "@/lib/admin-panel";
import type { AuthUser } from "@/lib/auth";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);

  useEffect(() => {
    const refresh = () => setUsers(getStoredUsers());
    refresh();
    ADMIN_PANEL_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => ADMIN_PANEL_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  const userEvents = listAdminEvents().filter((event) => event.entityType === "user").slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Users</p>
        <h1 className="mt-1 font-serif text-3xl">کاربران و ورودها</h1>
      </div>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-[11px] uppercase tracking-widest text-onyx/45">
              <tr>
                <th className="py-2 text-right">نام</th>
                <th className="py-2 text-right">موبایل</th>
                <th className="py-2 text-right">ایمیل</th>
                <th className="py-2 text-right">نقش</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-t border-onyx/10">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.phone || "—"}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-onyx/10 bg-parchment/90 p-6">
        <h2 className="font-serif text-2xl">رویدادهای کاربر</h2>
        <div className="mt-4 space-y-3">
          {userEvents.map((event) => (
            <article key={event.id} className="rounded-xl border border-onyx/10 bg-white/70 p-4">
              <p className="font-medium">{event.title}</p>
              <p className="mt-1 text-sm text-onyx/55">{new Date(event.createdAt).toLocaleString("fa-IR")}</p>
            </article>
          ))}
          {userEvents.length === 0 ? <p className="text-sm text-onyx/50">رویدادی ثبت نشده است.</p> : null}
        </div>
      </section>
    </div>
  );
}
