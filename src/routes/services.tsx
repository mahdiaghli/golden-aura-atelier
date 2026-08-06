import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Gem, Hammer, Repeat2, ShieldCheck, Sparkles } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n/context";

const serviceMeta = [
  { id: "repair", icon: Hammer },
  { id: "resizing", icon: Repeat2 },
  { id: "custom", icon: Sparkles },
  { id: "trade-in", icon: Repeat2 },
  { id: "investment", icon: Gem },
  { id: "insurance", icon: ShieldCheck },
] as const;

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services | Aghli Gold" },
      { name: "description", content: "Repair, resizing, custom design, trade-in, investment help, and insurance support from Aghli Gold." },
    ],
  }),
});

function ServicesPage() {
  const { t, messages } = useI18n();
  const items = messages.services.items as Record<
    string,
    { title: string; copy: string; bullets: string[] }
  >;
  const services = serviceMeta.map((meta) => ({ ...meta, ...items[meta.id] }));
  const quickLinks = services.map((service) => ({ id: service.id, label: service.title }));

  return (
    <Shell>
      <section className="border-b border-onyx/10 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t("services.eyebrow")}</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl leading-tight md:text-6xl">{t("services.title")}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-onyx/65">
                {t("services.intro")}
              </p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center bg-onyx px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-parchment transition-colors hover:bg-gold hover:text-onyx">
              {t("services.cta")}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="rounded-full border border-onyx/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-onyx/70 transition-colors hover:border-gold hover:text-gold">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article key={service.id} id={service.id} className="scroll-mt-28 border border-onyx/10 bg-white/70 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <Icon className="text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-onyx/40">0{index + 1}</span>
                </div>
                <h2 className="mt-6 font-serif text-3xl">{service.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-onyx/65">{service.copy}</p>
                <ul className="mt-6 space-y-2 text-sm text-onyx/70">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gold" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-onyx/10 bg-onyx py-16 text-parchment md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t("services.flowEyebrow")}</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t("services.flowTitle")}</h2>
            <p className="mt-5 max-w-2xl text-parchment/70">
              {t("services.flowBody")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [Clock3, t("services.step1"), t("services.step1Body")],
              [ShieldCheck, t("services.step2"), t("services.step2Body")],
              [Sparkles, t("services.step3"), t("services.step3Body")],
            ].map(([Icon, label, text]) => {
              const CurrentIcon = Icon as typeof Clock3;
              return (
                <div key={String(label)} className="rounded-2xl border border-parchment/15 bg-white/5 p-5">
                  <CurrentIcon className="text-gold" size={22} />
                  <h3 className="mt-4 text-[11px] uppercase tracking-[0.24em] text-gold">{String(label)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-parchment/72">{String(text)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Shell>
  );
}
