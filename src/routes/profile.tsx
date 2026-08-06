import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Package, Settings, UserRound } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { getSessionUser, signOut } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/context";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const user = getSessionUser();
  const { t } = useI18n();

  if (!user) {
    return (
      <Shell>
        <main className="max-w-2xl mx-auto px-6 py-28 text-center">
          <UserRound className="mx-auto text-gold" size={36} />
          <h1 className="mt-5 font-serif text-4xl">{t("profile.guestTitle")}</h1>
          <p className="mt-4 text-onyx/60">{t("profile.guestBody")}</p>
          <Link to="/login" className="inline-block mt-8 bg-onyx px-7 py-4 text-[10px] uppercase tracking-widest font-bold text-parchment">
            {t("profile.guestCta")}
          </Link>
        </main>
      </Shell>
    );
  }

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Shell>
      <main className="max-w-7xl mx-auto px-6 py-14 md:py-20">
        <p className="text-[11px] uppercase tracking-[.32em] text-gold">{t("profile.eyebrow")}</p>
        <h1 className="mt-4 font-serif text-5xl">{t("profile.welcome", { name: user.name.split(" ")[0] })}</h1>
        <div className="mt-12 grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="border border-onyx/10 bg-secondary p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-onyx font-serif text-xl text-gold">
              {initials}
            </div>
            <h2 className="mt-5 font-serif text-2xl">{user.name}</h2>
            <p className="mt-1 text-sm text-onyx/60">{user.email}</p>
            <div className="mt-7 space-y-3 border-t border-onyx/10 pt-6 text-sm">
              <p className="flex items-center gap-3 font-medium">
                <UserRound size={16} className="text-gold" /> {t("profile.profileDetails")}
              </p>
              <p className="flex items-center gap-3 text-onyx/60">
                <Package size={16} /> {t("profile.orders")}
              </p>
              <p className="flex items-center gap-3 text-onyx/60">
                <Settings size={16} /> {t("profile.preferences")}
              </p>
            </div>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold"
            >
              <LogOut size={15} /> {t("profile.signOut")}
            </button>
          </aside>
          <section>
            <div className="grid gap-5 sm:grid-cols-3">
              <Stat label={t("profile.statOrders")} value="0" />
              <Stat label={t("profile.statSaved")} value="0" />
              <Stat label={t("profile.statMemberSince")} value="2026" />
            </div>
            <div className="mt-8 border border-dashed border-onyx/20 px-6 py-16 text-center">
              <Package size={30} className="mx-auto text-gold" />
              <h2 className="mt-4 font-serif text-2xl">{t("profile.ordersEmptyTitle")}</h2>
              <p className="mt-2 text-sm text-onyx/60">{t("profile.ordersEmptyBody")}</p>
              <Link to="/shop" className="mt-6 inline-block border-b border-gold pb-1 text-[10px] uppercase tracking-widest font-bold text-gold">
                {t("profile.ordersEmptyCta")}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-onyx/10 p-5">
      <p className="font-serif text-3xl">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-onyx/50">{label}</p>
    </div>
  );
}
