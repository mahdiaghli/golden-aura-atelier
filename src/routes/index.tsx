import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BadgeCheck, HeartHandshake, MapPin, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Shell } from "@/components/site/Chrome";
import { formatToman, priceBreakdown, products } from "@/lib/products";

import heroRing from "@/assets/hero-ring.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catBullion from "@/assets/cat-bullion.jpg";
import pricingViz from "@/assets/pricing-viz.jpg";

export const Route = createFileRoute("/")({ component: Home });

const featuredImages = ["/products/featured-1.jpg", "/products/featured-2.jpg", "/products/featured-3.jpg", "/products/featured-4.jpg"];
const faqs = [
  ["How is each piece priced?", "Every price combines live gold weight, workmanship, and applicable tax, shown clearly before purchase."],
  ["Can I order a custom piece?", "Yes. Our workshop can adapt a design, resize a piece, or create a made-to-order heirloom."],
  ["Do you offer insured delivery?", "Orders are securely packaged and fully insured until they reach you."],
];
const posts = [
  ["Buying Guide", "How to choose the right karat for everyday jewelry", "6 min read"],
  ["Care", "The simple guide to keeping gold luminous", "4 min read"],
  ["Investment", "Bars, coins, and the role of gold in a collection", "7 min read"],
];

function ProductCard({ product, image }: { product: (typeof products)[number]; image?: string }) {
  const { total } = priceBreakdown(product);
  return <Link to="/shop/$id" params={{ id: product.id }} className="group block"><div className="relative overflow-hidden bg-secondary"><img src={image ?? product.image} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />{product.bestseller && <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[9px] font-bold uppercase tracking-wider">Best seller</span>}</div><div className="pt-4"><h3 className="font-serif text-xl group-hover:text-gold">{product.name}</h3><p className="mt-1 text-[10px] uppercase tracking-widest text-onyx/50">{product.karat} · {product.weight}g</p><p className="mt-2 text-sm font-medium">{formatToman(total)}</p></div></Link>;
}

function Showcase({ eyebrow, title, items, useImages = false }: { eyebrow: string; title: string; items: typeof products; useImages?: boolean }) {
  return <section className="max-w-7xl mx-auto px-6 py-16 md:py-24"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="text-[11px] uppercase tracking-[.32em] text-gold">{eyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h2></div><Link to="/shop" className="shrink-0 border-b border-gold pb-1 text-[10px] font-bold uppercase tracking-widest text-gold">Shop all</Link></div><div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">{items.map((product, index) => <ProductCard key={product.id} product={product} image={useImages ? featuredImages[index % featuredImages.length] : undefined} />)}</div></section>;
}

function Home() {
  const newest = products.filter((product) => product.newest).slice(0, 4);
  const bestsellers = products.filter((product) => product.bestseller || product.mostSold).slice(0, 4);
  const recommended = products.filter((product) => product.aiRecommended).slice(0, 4);
  const forYou = products.filter((product) => product.gender === "women" || product.gender === "unisex").slice(0, 4);
  const completeTheLook = products.filter((product) => product.category === "necklaces" || product.category === "bracelets").slice(0, 4);
  return <Shell>
    <section className="relative min-h-[660px] overflow-hidden"><img src="/products/featured-1.jpg" alt="Fine gold jewelry collection" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/80 to-parchment/10"/><div className="relative mx-auto flex min-h-[660px] max-w-7xl items-center px-6"><div className="max-w-2xl"><p className="text-[11px] uppercase tracking-[.38em] text-gold">Fine jewelry · Tehran</p><h1 className="mt-5 font-serif text-5xl leading-[1.03] md:text-7xl">Gold made to become <i>part of your story.</i></h1><p className="mt-7 max-w-lg text-base leading-relaxed text-onyx/70">Discover new pieces, investment gold, and personal heirlooms with clear, live-informed pricing.</p><div className="mt-9 flex flex-wrap gap-4"><Link to="/shop" className="bg-onyx px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-parchment hover:bg-gold hover:text-onyx">Shop collection</Link><Link to="/signup" className="border border-onyx/30 px-7 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gold hover:text-gold">Book consultation</Link></div></div></div></section>
    <Showcase eyebrow="Just arrived" title="Newest pieces" items={newest} useImages />
    <section className="bg-onyx py-16 text-parchment md:py-24"><div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-3">{[[ShieldCheck,"Certified quality","Every piece is checked for purity, finishing, and authenticity."],[Truck,"Secure delivery","Insured delivery and careful packaging from our workshop to your door."],[HeartHandshake,"Personal guidance","Real people help you choose, resize, or create a piece that fits." ]].map(([Icon,title,text]) => { const I = Icon as typeof ShieldCheck; return <div key={String(title)} className="border-t border-parchment/20 pt-6"><I className="text-gold" size={28}/><h2 className="mt-5 font-serif text-2xl">{String(title)}</h2><p className="mt-3 text-sm leading-relaxed text-parchment/65">{String(text)}</p></div>; })}</div></section>
    <Showcase eyebrow="Loved by collectors" title="Most selling" items={bestsellers} />
    <Showcase eyebrow="Curated by Aurum" title="Recommended for you" items={recommended} useImages />
    <section className="bg-secondary py-16 md:py-24"><div className="max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-[1fr_1.1fr]"><div><p className="text-[11px] uppercase tracking-[.32em] text-gold">Why Aurum</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">More certainty in every carat.</h2><p className="mt-6 max-w-md leading-relaxed text-onyx/65">We combine craftsmanship, transparent pricing, and thoughtful aftercare so buying gold feels personal and clear.</p></div><div className="grid gap-px bg-onyx/10 sm:grid-cols-2">{[[Award,"Craftsmanship","Made and inspected by expert goldsmiths."],[BadgeCheck,"Transparent pricing","See weight, purity, and workmanship."],[Sparkles,"Custom service","Bring your own idea to our workshop."],[MapPin,"Local support","A dedicated team before and after purchase."]].map(([Icon,title,text]) => { const I = Icon as typeof Award; return <div key={String(title)} className="bg-secondary p-6"><I size={22} className="text-gold"/><h3 className="mt-4 font-serif text-xl">{String(title)}</h3><p className="mt-2 text-sm text-onyx/60">{String(text)}</p></div>; })}</div></div></section>
    <Showcase eyebrow="Picked for you" title="Your everyday favorites" items={forYou} />
    <Showcase eyebrow="Style it together" title="Complete the look" items={completeTheLook} useImages />
    {/* <section className="max-w-7xl mx-auto px-6 py-16 md:py-24"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-[11px] uppercase tracking-[.32em] text-gold">Answers</p><h2 className="mt-4 font-serif text-4xl">Frequently asked questions</h2><Link to="/faq" className="mt-7 inline-block border-b border-gold pb-1 text-[10px] font-bold uppercase tracking-widest text-gold">Read all FAQs</Link></div><div className="divide-y divide-onyx/10">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none font-serif text-xl flex justify-between gap-4">{question}<span className="text-gold group-open:rotate-45">+</span></summary><p className="mt-3 max-w-xl text-sm leading-relaxed text-onyx/65">{answer}</p></details>)}</div></div></section> */}
    {/* <section className="bg-onyx py-16 text-parchment md:py-24"><div className="max-w-7xl mx-auto px-6"><p className="text-[11px] uppercase tracking-[.32em] text-gold">From the journal</p><div className="mt-4 flex items-end justify-between"><h2 className="font-serif text-4xl md:text-5xl">Guides for a lasting collection</h2><Link to="/blog" className="hidden border-b border-gold pb-1 text-[10px] font-bold uppercase tracking-widest text-gold sm:block">Visit the journal</Link></div><div className="mt-12 grid gap-6 md:grid-cols-3">{posts.map(([type,title,read]) => <Link key={title} to="/blog" className="border-t border-parchment/20 pt-5 hover:text-gold"><p className="text-[10px] uppercase tracking-widest text-gold">{type}</p><h3 className="mt-4 font-serif text-2xl leading-tight">{title}</h3><p className="mt-5 text-xs text-parchment/55">{read}</p></Link>)}</div></div></section> */}
  </Shell>;
}
