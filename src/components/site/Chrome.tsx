import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

export function Ticker() {
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

export function Nav() {
  const { count } = useCart();
  return (
    <nav className="sticky top-0 z-50 bg-parchment/80 backdrop-blur-md border-b border-onyx/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-semibold">
          <Link to="/shop" className="hover:text-gold transition-colors">Collection</Link>
          <Link to="/shop" search={{ category: "bullion" }} className="hover:text-gold transition-colors">Bullion</Link>
          <Link to="/about" className="hover:text-gold transition-colors">About</Link>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
        </div>
        <Link to="/" className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <h1 className="font-serif text-3xl tracking-tighter font-bold select-none">
            AURUM<span className="text-gold">.</span>
          </h1>
        </Link>
        <div className="flex items-center gap-6">
          <button aria-label="Search" className="p-2 hover:bg-onyx/5 rounded-full transition-colors">
            <div className="w-5 h-5 border-2 border-onyx rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-onyx rounded-full" />
            </div>
          </button>
          <div className="h-4 w-px bg-onyx/10 hidden sm:block" />
          <button className="hidden sm:block text-[11px] uppercase tracking-widest font-semibold text-gold">
            Account
          </button>
          <Link to="/cart" className="relative" aria-label="Cart">
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-parchment text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
            <div className="w-5 h-5 border-b-2 border-onyx" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
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
            { t: "Collection", l: ["All Collections", "Rings", "Necklaces", "Bullion"] },
            { t: "Company", l: ["About Us", "Contact Us", "Book Appointment", "Private Consultations"] },
          ].map((col) => (
            <div key={col.t}>
              <h5 className="text-[11px] uppercase tracking-widest font-bold mb-6">{col.t}</h5>
              <ul className="space-y-4 text-sm text-onyx/60 font-light">
                {col.l.map((i) => {
                  const href = i === "About Us" ? "/about" : i === "Contact Us" ? "/contact" : "/shop";
                  return (
                    <li key={i}>
                      <Link to={href} className="hover:text-gold">{i}</Link>
                    </li>
                  );
                })}
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
