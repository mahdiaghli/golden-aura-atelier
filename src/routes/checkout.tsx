import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/site/Chrome";
import { ProductImage } from "@/components/site/ProductImage";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/lib/products";
import { createOrder } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Aurum" },
      { name: "description", content: "Complete your Aurum reservation with insured shipping and secure payment." },
      { property: "og:title", content: "Checkout — Aurum" },
      { property: "og:description", content: "Secure checkout for your Aurum pieces." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const shipping = subtotal > 0 ? 750_000 : 0;
  const total = subtotal + shipping;
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <Shell>
        <section className="max-w-2xl mx-auto px-6 py-32 text-center">
          <span className="text-[12px] uppercase tracking-[0.3em] text-gold">Order confirmed</span>
          <h1 className="font-serif text-5xl mt-4">Reserved in gold.</h1>
          <p className="text-onyx/60 mt-6 font-light">
            A confirmation and certificate of authenticity will arrive by email. Our concierge
            will coordinate insured delivery within 48 hours.
          </p>
          <Link to="/shop" className="inline-block mt-10 bg-onyx text-parchment px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all">
            Continue browsing
          </Link>
        </section>
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <Shell>
        <section className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-4xl">Your bag is empty.</h1>
          <Link to="/shop" className="inline-block mt-8 text-[11px] uppercase tracking-widest text-gold border-b border-gold">
            Enter the collection
          </Link>
        </section>
      </Shell>
    );
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createOrder({
      customer: {
        name: `${formData.get("first")} ${formData.get("last")}`,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("street") as string,
        city: formData.get("city") as string,
        country: formData.get("country") as string,
      },
      items: items.map(({ product, qty, lineTotal }) => ({ product, quantity: qty, lineTotal })),
      subtotal,
      shipping,
      total,
    });
    clear();
    setPlaced(true);
    router.navigate({ to: "/checkout" });
  };

  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-[12px] uppercase tracking-[0.3em] text-gold">Secure Checkout</span>
        <h1 className="font-serif text-5xl mt-3 mb-12">Complete Your Order</h1>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-12">
            <Section title="Contact">
              <Input label="Email" type="email" name="email" required />
              <Input label="Phone" type="tel" name="phone" required />
            </Section>

            <Section title="Delivery Address">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" name="first" required />
                <Input label="Last name" name="last" required />
              </div>
              <Input label="Street address" name="street" required />
              <div className="grid grid-cols-3 gap-4">
                <Input label="City" name="city" required />
                <Input label="Postal code" name="zip" required />
                <Input label="Country" name="country" defaultValue="Iran" required />
              </div>
            </Section>

            <Section title="Payment">
              <Input label="Cardholder name" name="cardName" required />
              <Input label="Card number" name="card" placeholder="1234 5678 9012 3456" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry" name="exp" placeholder="MM / YY" required />
                <Input label="CVC" name="cvc" placeholder="•••" required />
              </div>
            </Section>
          </div>

          <aside className="bg-secondary p-8 h-fit sticky top-28 space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4">Your Order</h4>
            <ul className="space-y-4">
              {items.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="flex gap-3">
                  <ProductImage product={product} className="w-14 aspect-square" />
                  <div className="flex-1 text-sm">
                    <p className="font-serif">{product.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-onyx/50 mt-0.5">Qty {qty}</p>
                  </div>
                  <p className="text-sm">{formatToman(lineTotal)}</p>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-onyx/10 space-y-2 text-sm">
              <Row label="Subtotal" value={formatToman(subtotal)} />
              <Row label="Insured shipping" value={formatToman(shipping)} />
              <div className="flex justify-between pt-2 text-lg font-serif">
                <span>Total</span>
                <span>{formatToman(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-onyx text-parchment py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-onyx transition-all"
            >
              Place order · {formatToman(total)}
            </button>
            <p className="text-[10px] uppercase tracking-widest text-onyx/40 text-center pt-2">
              Encrypted payment · Certified authenticity
            </p>
          </aside>
        </form>
      </section>
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-serif text-2xl mb-6">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-onyx/60">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full bg-transparent border-b border-onyx/20 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-onyx/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}
