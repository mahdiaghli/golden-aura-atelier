import { Link } from "@tanstack/react-router";
import { ChevronDown, Instagram, MapPin, Menu, Phone, Search, Send, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { SHOP_SEARCH_DEFAULT } from "@/lib/shop-search";

const NESHAN_URL =
  "https://neshan.org/maps/?q=%D9%85%D8%B4%D9%87%D8%AF%20%D8%A8%DB%8C%D9%86%20%D8%AD%D8%B1%207%20%D9%88%209%20%D8%AC%D9%86%D8%A8%20%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DA%AF%D8%A7%D9%87%20%D8%B3%D9%85%D8%A7%20%D8%B7%D9%84%D8%A7%D8%AC%D8%A7%D8%AA%20%D8%B9%D9%82%D9%84%DB%8C";

const serviceAnchors = [
  { label: "Repair", hash: "repair" },
  { label: "Resizing", hash: "resizing" },
  { label: "Custom design", hash: "custom" },
  { label: "Trade-in and exchange", hash: "trade-in" },
  { label: "Investment consultation", hash: "investment" },
  { label: "Insurance support", hash: "insurance" },
];

const megaMenu = [
  { label: "Products", links: ["Ring", "Wedding Ring", "Engagement Ring", "Necklace", "Chain", "Bracelet", "Pendant", "Earrings"] },
  { label: "Gemstones", links: ["Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Topaz", "Amethyst"] },
  { label: "Investment", links: ["Bullion / Bar", "Coin", "Melted Gold", "Second-Hand Gold"] },
  { label: "Gifts", links: ["Birthday Gift", "Anniversary Gift", "Wedding Gift", "Graduation Gift"] },
  { label: "Wedding", links: ["Ring", "Bridal Set", "Couple's Set"] },
  { label: "Services", links: serviceAnchors.map((item) => item.label) },
  { label: "Resources", links: ["Buying Guide", "Blog", "FAQ"] },
] as const;

function buildShopSearch(item: string) {
  const categoryMap: Record<string, "rings" | "necklaces" | "bracelets" | "bullion"> = {
    Ring: "rings",
    "Wedding Ring": "rings",
    "Engagement Ring": "rings",
    Necklace: "necklaces",
    Chain: "necklaces",
    Bracelet: "bracelets",
    Pendant: "necklaces",
    Earrings: "bracelets",
    "Bullion / Bar": "bullion",
    Coin: "bullion",
  };

  const category = categoryMap[item];
  return category ? { ...SHOP_SEARCH_DEFAULT, category } : { ...SHOP_SEARCH_DEFAULT, q: item };
}

export function Ticker() {
  const items = [
    { label: "Live 18K Gold", value: "3,452,000 Toman", dot: "bg-emerald-500 animate-pulse" },
    { label: "Global Spot", value: "$2,042.40", dot: "bg-gold-soft" },
    { label: "Market Status", value: "Open", dot: "bg-gold" },
    { label: "24K Gold", value: "4,602,000 Toman", dot: "bg-emerald-500" },
    { label: "Making Rate", value: "7% base", dot: "bg-gold-soft" },
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-gold/30 bg-onyx py-2 text-parchment">
      <div className="flex w-max animate-marquee gap-12 px-6 text-[10px] font-medium uppercase tracking-[0.2em]">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex shrink-0 items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
            {item.label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const { count } = useCart();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryLinks = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/prices", label: "Prices" },
      { to: "/services", label: "Services" },
    ],
    [],
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-onyx/10 bg-parchment/95 backdrop-blur-md" onMouseLeave={() => setOpen(null)}>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button className="p-2 -ml-2 lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
          {mobileOpen ? <X size={21} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <h1 className="select-none font-serif text-3xl font-bold tracking-tighter">
            AGHLI<span className="text-gold">.</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link to="/shop" search={SHOP_SEARCH_DEFAULT} aria-label="Search collection" className="rounded-full p-2 transition-colors hover:text-gold">
            <Search size={19} />
          </Link>
          <Link to="/profile" className="hidden text-[11px] font-semibold uppercase tracking-widest text-gold sm:block">
            Account
          </Link>
          <Link to="/cart" className="relative rounded-full p-1" aria-label="Cart">
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-parchment">
                {count}
              </span>
            )}
            <ShoppingBag size={20} strokeWidth={1.7} />
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-onyx/8 lg:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-1 px-6">
          {megaMenu.map((menu) => (
            <div key={menu.label} className="relative" onMouseEnter={() => setOpen(menu.label)}>
              <button
                onClick={() => setOpen(open === menu.label ? null : menu.label)}
                className={`flex h-12 items-center gap-1 px-4 text-[11px] font-semibold uppercase tracking-widest transition-colors ${open === menu.label ? "text-gold" : "hover:text-gold"}`}
              >
                {menu.label}
                <ChevronDown size={13} className={open === menu.label ? "rotate-180" : ""} />
              </button>

              {open === menu.label && (
                <div className="absolute left-1/2 top-12 w-[min(760px,90vw)] -translate-x-1/2 border border-onyx/10 bg-parchment p-6 shadow-[0_24px_50px_rgba(0,0,0,0.08)]">
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {menu.links.map((item) =>
                      menu.label === "Services" ? (
                        <Link
                          key={item}
                          to="/services"
                          hash={serviceAnchors.find((service) => service.label === item)?.hash}
                          className="group rounded-2xl border border-onyx/10 bg-white/70 p-4 text-left transition-colors hover:border-gold"
                        >
                          <p className="text-[10px] uppercase tracking-[0.22em] text-onyx/40">Service</p>
                          <p className="mt-2 font-serif text-xl group-hover:text-gold">{item}</p>
                        </Link>
                      ) : menu.label === "Resources" ? (
                        <Link
                          key={item}
                          to={item === "Blog" ? "/blog" : item === "FAQ" ? "/faq" : "/shop"}
                          search={item === "Buying Guide" ? { ...SHOP_SEARCH_DEFAULT, q: item } : undefined}
                          className="rounded-2xl border border-onyx/10 bg-white/70 p-4 transition-colors hover:border-gold"
                        >
                          <p className="font-serif text-xl hover:text-gold">{item}</p>
                        </Link>
                      ) : (
                        <Link
                          key={item}
                          to="/shop"
                          search={buildShopSearch(item)}
                          className="rounded-2xl border border-onyx/10 bg-white/70 p-4 transition-colors hover:border-gold"
                        >
                          <p className="font-serif text-xl hover:text-gold">{item}</p>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-onyx/8 bg-parchment lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 py-5">
            <div className="flex flex-wrap gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-onyx/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-2">
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                Contact
              </Link>
              <Link to="/prices" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                Prices
              </Link>
              <Link to="/services" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                Services
              </Link>
            </div>

            <div className="grid gap-3">
              {serviceAnchors.map((service) => (
                <Link key={service.hash} to="/services" hash={service.hash} onClick={() => setMobileOpen(false)} className="rounded-2xl border border-onyx/10 px-4 py-3 text-sm transition-colors hover:border-gold hover:text-gold">
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function StoreMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`overflow-hidden border border-onyx/10 bg-white/70 ${compact ? "rounded-[1.5rem]" : "rounded-[2rem]"}`}>
      <div className="border-b border-onyx/10 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-onyx/45">Our location</p>
        <p className="mt-2 font-serif text-xl">Visit our Mashhad store</p>
      </div>
      <div className={compact ? "h-[260px]" : "h-[360px]"}>
        <iframe title="Aghli Gold location map" src={NESHAN_URL} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-onyx/10 bg-parchment pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 lg:grid-cols-[1.05fr_.9fr_.8fr_.85fr_1.25fr]">
          <div>
            <h2 className="font-serif text-4xl tracking-tighter">
              AGHLI<span className="text-gold">.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-onyx/60">
              Gold jewelry, investment gold, and personal service from Aghli Gold.
            </p>
            <div className="mt-6 flex gap-4 text-onyx/60">
              <a aria-label="Telegram" href="https://t.me/aghligold" target="_blank" rel="noreferrer" className="hover:text-gold">
                <Send size={18} />
              </a>
              <a aria-label="Instagram" href="https://instagram.com/aghligold/" target="_blank" rel="noreferrer" className="hover:text-gold">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Contact us</h3>
            <div className="mt-5 space-y-3 text-sm text-onyx/60">
              <a className="flex gap-2 hover:text-gold" href="tel:09153145726">
                <Phone size={15} />
                09153145726
              </a>
              <a className="flex gap-2 hover:text-gold" href="tel:05133762430">
                <Phone size={15} />
                05133762430
              </a>
              <a className="flex gap-2 hover:text-gold" href="https://t.me/aaadmin_aghli" target="_blank" rel="noreferrer">
                <Send size={15} />
                @aaadmin_aghli
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Explore</h3>
            <div className="mt-5 space-y-3 text-sm text-onyx/60">
              <Link to="/" className="block hover:text-gold">
                Home
              </Link>
              <Link to="/shop" search={SHOP_SEARCH_DEFAULT} className="block hover:text-gold">
                Shop
              </Link>
              <Link to="/prices" className="block hover:text-gold">
                Market prices
              </Link>
              <Link to="/services" className="block hover:text-gold">
                Services
              </Link>
              <Link to="/contact" className="block hover:text-gold">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Services</h3>
            <div className="mt-5 space-y-3 text-sm text-onyx/60">
              <Link to="/services" hash="repair" className="block hover:text-gold">
                Repair
              </Link>
              <Link to="/services" hash="resizing" className="block hover:text-gold">
                Resizing
              </Link>
              <Link to="/services" hash="custom" className="block hover:text-gold">
                Custom design
              </Link>
              <Link to="/services" hash="trade-in" className="block hover:text-gold">
                Trade-in and exchange
              </Link>
              <Link to="/services" hash="investment" className="block hover:text-gold">
                Investment consultation
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <StoreMap compact />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-onyx/10 pt-6 text-[10px] uppercase tracking-[0.18em] text-onyx/45 md:flex-row md:items-center md:justify-between">
          <p>All rights reserved</p>
          <a href={NESHAN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
            <MapPin size={14} />
            Open in Neshan map
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment text-onyx selection:bg-gold/20">
      <Ticker />
      <Nav />
      {children}
      <Footer />
    </div>
  );
}