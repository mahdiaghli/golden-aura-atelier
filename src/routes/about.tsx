import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import heroRing from "@/assets/hero-ring.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Aurum — Fine Gold Jewelry House" },
      { name: "description", content: "Discover Aurum's heritage, craftsmanship, and transparent gold philosophy." },
    ],
  }),
});

function AboutPage() {
  const values = [
    ["Heritage", "Founded in Tehran and refined for modern collectors, our house brings a century of goldsmithing into every contemporary piece."],
    ["Transparency", "Every price is calculated around live gold rate, making cost, and VAT so you see the exact value of your purchase."],
    ["Craftsmanship", "Each item is hand-finished by master artisans, with custom commissions available for private clients."],
  ];

  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div>
            <span className="text-[12px] uppercase tracking-[0.35em] text-gold">About us</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">A house shaped by heritage, precision, and trust.</h1>
            <p className="mt-6 text-lg leading-relaxed text-onyx/70 font-light">
              Aurum blends Persian goldsmithing traditions with a contemporary luxury experience, offering collectors and investors a transparent path into fine jewelry and certified bullion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="bg-onyx text-parchment px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all">
                Explore collection
              </Link>
              <Link to="/contact" className="border-b border-onyx py-2 text-[11px] uppercase tracking-[0.2em] font-bold hover:text-gold hover:border-gold transition-all">
                Contact us
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-onyx/10 bg-secondary">
            <img src={heroRing} alt="Aurum gold jewelry in warm light" className="w-full aspect-[4/5] object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(([title, copy]) => (
            <div key={title} className="rounded-[1.5rem] border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-onyx/70">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
