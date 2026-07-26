import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import heroRing from "@/assets/hero-ring.jpg";
import { useI18n } from "@/lib/i18n/context";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const { messages } = useI18n();
  const about = messages.about as {
    eyebrow: string;
    title: string;
    intro: string;
    ctaShop: string;
    ctaContact: string;
    imageAlt: string;
    values: Record<string, { title: string; body: string }>;
  };
  const values = Object.values(about.values);

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="text-[12px] uppercase tracking-[0.35em] text-gold">{about.eyebrow}</span>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{about.title}</h1>
            <p className="mt-6 text-lg font-light leading-relaxed text-onyx/70">{about.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="bg-onyx px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment transition-all hover:bg-gold hover:text-onyx">
                {about.ctaShop}
              </Link>
              <Link to="/contact" className="border-b border-onyx py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:border-gold hover:text-gold">
                {about.ctaContact}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-onyx/10 bg-secondary">
            <img src={heroRing} alt={about.imageAlt} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-onyx/10 bg-white/70 p-8">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-onyx/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
