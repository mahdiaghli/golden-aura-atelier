import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Gem, Hammer, Repeat2, ShieldCheck, Sparkles } from "lucide-react";
import { Shell } from "@/components/site/Chrome";

const services = [
  {
    id: "repair",
    icon: Hammer,
    title: "Repair & restoration",
    copy: "Bring back broken clasps, loose settings, worn finishes, and heirloom pieces that need careful workshop attention.",
    bullets: ["Stone resetting", "Clasp replacement", "Finishing and restoration"],
  },
  {
    id: "resizing",
    icon: Repeat2,
    title: "Polishing and resizing",
    copy: "Adjust rings, bracelets, and chains to fit comfortably and restore their original shine.",
    bullets: ["Ring resizing", "Bracelet adjustments", "Polish and re-finish"],
  },
  {
    id: "custom",
    icon: Sparkles,
    title: "Custom design",
    copy: "Work with the team to create a one-of-a-kind piece, from sketch to finished gold.",
    bullets: ["Private consultation", "Design approval", "Hand-finished production"],
  },
  {
    id: "trade-in",
    icon: Repeat2,
    title: "Trade-in and exchange",
    copy: "Upgrade or exchange old jewelry with a transparent valuation based on current market rate.",
    bullets: ["Old gold valuation", "Exchange toward new pieces", "Transparent pricing"],
  },
  {
    id: "investment",
    icon: Gem,
    title: "Investment consultation",
    copy: "Choose bullion, coins, and low-making-charge pieces with guidance from the shop team.",
    bullets: ["Bullion selection", "Coin guidance", "Market timing support"],
  },
  {
    id: "insurance",
    icon: ShieldCheck,
    title: "Insurance support",
    copy: "Protect delivery and high-value pieces with packaging and shipping options that reduce risk.",
    bullets: ["Insured delivery", "Secure packaging", "Order follow-up"],
  },
] as const;

const quickLinks = services.map((service) => ({ id: service.id, label: service.title }));

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
  return (
    <Shell>
      <section className="border-b border-onyx/10 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Our services</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl leading-tight md:text-6xl">Everything we do, grouped by the job you need done.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-onyx/65">
                Choose a service from the navigation, then jump directly to the matching section below.
              </p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center bg-onyx px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-parchment transition-colors hover:bg-gold hover:text-onyx">
              Talk to a person
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
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Service flow</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Short process, clear expectations.</h2>
            <p className="mt-5 max-w-2xl text-parchment/70">
              Tell us what you need, share a photo or visit the store, and we will tell you what is possible, how long it takes, and what it costs before work begins.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [Clock3, "Step 1", "Send a photo or describe the job."],
              [ShieldCheck, "Step 2", "Receive a transparent plan and estimate."],
              [Sparkles, "Step 3", "Approve the work and pick up the result."],
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