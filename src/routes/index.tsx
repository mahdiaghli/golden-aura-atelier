import { createFileRoute, Link } from "@tanstack/react-router";
import heroRing from "@/assets/hero-ring.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catBullion from "@/assets/cat-bullion.jpg";
import pricingViz from "@/assets/pricing-viz.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Aurum — Fine Gold Jewelry & Investment House" },
      {
        name: "description",
        content:
          "Aurum crafts 18K and 24K gold jewelry with transparent, live-price valuation. Rings, chains, bracelets and certified bullion for collectors and investors.",
      },
      { property: "og:title", content: "Aurum — Fine Gold Jewelry & Investment House" },
      {
        property: "og:description",
        content:
          "Persian craftsmanship, transparent gold pricing, and investment-grade bullion. Discover the Aurum house.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Aurum — Fine Gold Jewelry" },
      { name: "twitter:description", content: "Transparent, live-price fine gold jewelry & bullion." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const categories = [
  { title: "Ceremonial Rings", count: "142 Pieces", img: catRings, slug: "rings" as const },
  { title: "Luminous Chains", count: "89 Pieces", img: catNecklaces, slug: "necklaces" as const },
  { title: "Sculpted Cuffs", count: "64 Pieces", img: catBracelets, slug: "bracelets" as const },
  { title: "Bullion & Coins", count: "28 Pieces", img: catBullion, slug: "bullion" as const },
];

function Ticker() {
  const items = [
    { label: "Live 18K Gold", value: "3,452,000 Toman", dot: "bg-emerald-500 animate-pulse" },
    { label: "Global Spot", value: "$2,042.40", dot: "bg-gold-soft" },
    { label: "Market Status", value: "Open", dot: "bg-gold" },
    { label: "24K Gold", value: "4,602,000 Toman", dot: "bg-emerald-500" },
    { label: "Making Rate", value: "7% base", dot: "bg-gold-soft" },
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-onyx text-parchment py-2 overflow-hidden whitespace-nowrap border-b border-gold/30">
      <div className="flex animate-marquee gap-12 text-[10px] font-medium tracking-[0.2em] uppercase w-max px-6">
        {doubled.map((it, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${it.dot}`} />
            {it.label}: {it.value}
          </div>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-parchment/80 backdrop-blur-md border-b border-onyx/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-semibold">
          <Link to="/shop" className="hover:text-gold transition-colors">Collections</Link>
          <a href="#pricing" className="hover:text-gold transition-colors">Investment</a>
          <a href="#story" className="hover:text-gold transition-colors">Bespoke</a>
        </div>
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <h1 className="font-serif text-3xl tracking-tighter font-bold select-none">
            AURUM<span className="text-gold">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button aria-label="Search" className="p-2 hover:bg-onyx/5 rounded-full transition-colors">
            <div className="w-5 h-5 border-2 border-onyx rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-onyx rounded-full" />
            </div>
          </button>
          <div className="h-4 w-px bg-onyx/10 hidden sm:block" />
          <Link to="/login" className="hidden sm:block text-[11px] uppercase tracking-widest font-semibold text-gold hover:text-onyx transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="hidden sm:block text-[11px] uppercase tracking-widest font-semibold text-onyx/70 hover:text-gold transition-colors">
            Join
          </Link>
          <Link to="/cart" className="relative" aria-label="Cart"><div className="w-5 h-5 border-b-2 border-onyx" /></Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[560px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroRing}
          alt="A diamond solitaire in yellow gold resting on champagne silk"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-parchment/90 via-parchment/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full animate-fade-up">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 text-[12px] uppercase tracking-[0.4em] font-medium text-gold">
            Est. 1924 · Tehran
          </span>
          <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.05] text-balance">
            Eternal Craft in <br />
            <i className="font-normal">Purest Gold</i>
          </h2>
          <p className="text-lg text-onyx/70 mb-10 font-light leading-relaxed max-w-md">
            A curated collection of 18K and 24K gold pieces, where traditional Persian
            craftsmanship meets contemporary minimalist design.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/shop" className="bg-onyx text-parchment px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all duration-500">Shop Collection</Link>
            <Link to="/signup" className="border-b border-onyx py-2 text-[11px] uppercase tracking-[0.2em] font-bold hover:text-gold hover:border-gold transition-all">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="collections" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.3em] text-gold mb-2">Categories</h3>
          <h2 className="text-4xl font-serif">Refined Selections</h2>
        </div>
        <a href="#" className="text-[11px] uppercase tracking-widest font-bold border-b-2 border-gold pb-1">
          View All
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {categories.map((c) => (
          <Link key={c.title} to="/shop" search={{ category: c.slug, karat: "all", gender: "all", min: 0, max: 1000000000, sort: "featured", q: "" }} className="group cursor-pointer">
            <div className="overflow-hidden mb-4">
              <img
                src={c.img}
                alt={c.title}
                width={800}
                height={1000}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h4 className="font-serif text-xl">{c.title}</h4>
            <p className="text-[11px] text-onyx/50 uppercase tracking-widest mt-1">{c.count}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PricingFormula() {
  const rows = [
    ["Gold Weight", "4.85 Grams"],
    ["Daily Rate", "3,452,000 T"],
    ["Making Cost (7%)", "1,172,000 T"],
    ["VAT", "612,300 T"],
  ];
  return (
    <section id="pricing" className="bg-onyx text-parchment py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
            Transparent <br />
            <i className="text-gold">Pricing Formula</i>
          </h2>
          <p className="text-parchment/60 mb-12 font-light leading-relaxed max-w-md">
            Our live pricing engine ensures you pay exactly what the market dictates. Every piece
            is valued dynamically from real-time gold rates, craftsmanship wages, and applicable tax.
          </p>
          <div className="space-y-4">
            {rows.map(([label, val]) => (
              <div key={label} className="flex justify-between items-center border-b border-parchment/10 pb-4">
                <span className="text-[12px] uppercase tracking-widest text-parchment/40">{label}</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="text-[14px] uppercase tracking-[0.3em] text-gold font-bold">Total</span>
              <span className="text-3xl font-serif">17,914,200 T</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src={pricingViz}
            alt="Live gold price analytics"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full aspect-square object-cover rounded-2xl outline outline-1 -outline-offset-1 outline-parchment/10"
          />
          <div className="absolute -bottom-6 -left-6 bg-gold p-8 hidden lg:block">
            <p className="text-onyx font-bold uppercase tracking-widest text-xs">Trust Verified</p>
            <p className="text-onyx/80 text-[10px] mt-2 leading-relaxed">
              Certified by Central Union <br /> Standard G-842
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story() {
  const stats = [
    ["100y", "Of Heritage"],
    ["24K", "Investment Grade"],
    ["8", "Master Goldsmiths"],
    ["12k+", "Collectors Served"],
  ];
  return (
    <section id="story" className="max-w-7xl mx-auto px-6 py-32 text-center">
      <span className="text-[12px] uppercase tracking-[0.3em] text-gold mb-4 block">Our House</span>
      <h2 className="text-4xl md:text-5xl font-serif max-w-3xl mx-auto leading-tight text-balance">
        A century of goldsmithing, distilled into every gram we cast.
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
        {stats.map(([n, l]) => (
          <div key={l}>
            <div className="font-serif text-4xl md:text-5xl text-gold">{n}</div>
            <div className="text-[11px] uppercase tracking-widest text-onyx/50 mt-2">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-parchment border-t border-onyx/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-4xl mb-6 tracking-tighter">
              AURUM<span className="text-gold">.</span>
            </h2>
            <p className="text-sm text-onyx/60 leading-relaxed font-light">
              Defining luxury for the digital age. A comprehensive ecosystem for collectors and
              connoisseurs of fine jewelry.
            </p>
          </div>
          {[
            { t: "Collection", l: ["All Collections", "Limited Edition", "Gold Coins", "Personalized"] },
            { t: "Services", l: ["Repair & Polishing", "Custom Design", "Appraisal", "Global Shipping"] },
          ].map((col) => (
            <div key={col.t}>
              <h5 className="text-[11px] uppercase tracking-widest font-bold mb-6">{col.t}</h5>
              <ul className="space-y-4 text-sm text-onyx/60 font-light">
                {col.l.map((i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-gold">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h5 className="text-[11px] uppercase tracking-widest font-bold mb-6">Join the Circle</h5>
            <p className="text-xs text-onyx/50 mb-6">Exclusive previews and market insights.</p>
            <form className="flex border-b border-onyx/20 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="bg-transparent border-none outline-none text-sm w-full font-light"
              />
              <button className="text-[10px] uppercase font-bold tracking-widest text-gold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-onyx/5 pt-12 gap-4">
          <p className="text-[10px] text-onyx/40 uppercase tracking-widest font-medium">
            © 2026 Aurum Luxury Gold House
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-onyx/40">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-parchment text-onyx selection:bg-gold/20">
      <Ticker />
      <Nav />
      <Hero />
      <Categories />
      <PricingFormula />
      <Story />
      <Footer />
    </div>
  );
}
