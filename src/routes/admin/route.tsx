import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Users,
  LineChart,
  Truck,
  LogOut,
  Shield,
} from "lucide-react";
// از auth واقعی خودتان استفاده کنید
import { getSessionUser, isAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = getSessionUser();
    if (!isAdmin(user)) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "سفارشات و تأیید", icon: Package },
  { to: "/admin/users", label: "کاربران", icon: Users },
  { to: "/admin/transactions", label: "معاملات و سود", icon: LineChart },
  { to: "/admin/shipping", label: "ارسال", icon: Truck },
] as unknown as { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5efe4] text-onyx">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* سایدبار */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-onyx/10 bg-parchment/95 px-4 py-6 lg:flex">
          <Link to="/" className="mb-8 px-2 font-serif text-2xl font-bold tracking-tighter">
            AURUM<span className="text-gold">.</span>
            <span className="ms-2 align-middle text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-onyx/45">
              Admin
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-onyx text-parchment"
                      : "text-onyx/70 hover:bg-onyx/5 hover:text-onyx"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2 border-t border-onyx/10 pt-4">
            <p className="flex items-center gap-2 px-2 text-[11px] text-onyx/45">
              <Shield size={14} /> دسترسی مدیریت
            </p>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-onyx/60 hover:bg-onyx/5"
            >
              <LogOut size={18} /> خروج به سایت
            </Link>
          </div>
        </aside>

        {/* موبایل: نوار بالا */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-onyx/10 bg-parchment/90 px-4 py-3 backdrop-blur lg:px-8">
            <p className="font-serif text-lg lg:hidden">
              AURUM<span className="text-gold">.</span> Admin
            </p>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="shrink-0 rounded-full border border-onyx/10 px-3 py-1 text-[11px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-onyx/40 lg:block">
              پنل مدیریت
            </p>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}