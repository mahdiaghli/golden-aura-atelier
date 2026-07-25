import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Aurum — Call or Visit" },
      { name: "description", content: "Reach Aurum by phone, email, or Instagram for appointments, orders, and private consultations." },
    ],
  }),
});

function ContactPage() {
  const channels = [
    { title: "Call us", value: "+98 21 8877 4400", detail: "Private appointments and order support" },
    { title: "Email", value: "hello@aurum.gold", detail: "Design consultations and concierge requests" },
    { title: "Visit", value: "No. 18, Niyavaran, Tehran", detail: "Open daily from 10:00 to 19:00" },
    { title: "Social", value: "@aurum.house", detail: "Instagram, WhatsApp, and market updates" },
  ];

  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-start">
          <div>
            <span className="text-[12px] uppercase tracking-[0.35em] text-gold">Call us</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Let us help you choose your next piece.</h1>
            <p className="mt-6 text-lg leading-relaxed text-onyx/70 font-light">
              Whether you are commissioning a bespoke jewel, requesting a valuation, or placing an order, our team is available to assist with care and discretion.
            </p>
            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-onyx/10 bg-white/70 p-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Preferred contact</p>
                <p className="mt-2 font-serif text-2xl">+98 21 8877 4400</p>
                <p className="mt-2 text-sm text-onyx/60">Speak with our concierge team for appointments and collection guidance.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {channels.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-onyx/10 bg-parchment/80 p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{item.title}</p>
                <p className="mt-3 font-serif text-2xl">{item.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-onyx/60">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-[2rem] border border-onyx/10 bg-onyx p-10 text-parchment">
          <h2 className="font-serif text-3xl">Book a private consultation</h2>
          <p className="mt-4 max-w-2xl text-parchment/70 leading-relaxed">
            For bespoke commissions, appraisal requests, and VIP access, we recommend booking ahead so our team can prepare the perfect experience for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="tel:+982188774400" className="bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-onyx transition-all hover:opacity-90">
              Call now
            </a>
            <a href="mailto:hello@aurum.gold" className="border border-parchment/25 px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold text-parchment transition-all hover:border-gold hover:text-gold">
              Email us
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
