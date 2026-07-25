import { createFileRoute, Link } from '@tanstack/react-router';
import { products, priceBreakdown, formatToman } from '@/lib/products';

export const Route = createFileRoute('/under-1000')({
  component: Under1000Page,
});

function Under1000Page() {
  // Filter products under $1000 (1 million toman)
  const affordableProducts = products.filter((p) => {
    const breakdown = priceBreakdown(p);
    return breakdown.total < 1_000_000; // Under 1000 dollars in toman
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-onyx to-onyx/90 text-parchment py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl mb-4">Luxury Under $1000</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Exquisite gold jewelry and accessories at accessible prices. Each piece crafted with the same dedication to quality that defines Aurum.
          </p>
          <div className="mt-8 inline-block">
            <div className="bg-gold/20 border border-gold text-gold px-4 py-2 rounded text-sm">
              {affordableProducts.length} Pieces Available
            </div>
          </div>
        </div>
      </section>

      {/* Featured Highlights */}
      {affordableProducts.length > 0 && (
        <section className="bg-parchment/30 py-12 border-b border-onyx/10">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-2xl mb-6">Why Shop This Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-gold text-2xl mb-3">✓</div>
                <h3 className="font-medium mb-2">Premium Quality</h3>
                <p className="text-sm text-onyx/70">Authentic gold (18K-24K) with expert craftsmanship</p>
              </div>
              <div>
                <div className="text-gold text-2xl mb-3">✓</div>
                <h3 className="font-medium mb-2">Accessible Luxury</h3>
                <p className="text-sm text-onyx/70">Beautiful pieces without premium price tags</p>
              </div>
              <div>
                <div className="text-gold text-2xl mb-3">✓</div>
                <h3 className="font-medium mb-2">Full Warranty</h3>
                <p className="text-sm text-onyx/70">Same guarantees and care as our luxury collection</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {affordableProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-onyx/70 mb-4">No products under $1000 at the moment.</p>
            <Link to="/shop" className="text-gold hover:underline">Browse all products →</Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {affordableProducts.map((product) => {
                const breakdown = priceBreakdown(product);
                return (
                  <Link
                    key={product.id}
                    to={`/shop/${product.id}`}
                    className="group"
                  >
                    <div className="mb-4 h-64 bg-onyx/5 rounded overflow-hidden relative flex items-center justify-center border border-onyx/10">
                      <div className="text-center text-onyx/40">
                        <div className="text-4xl mb-2">✨</div>
                        <p className="text-xs uppercase tracking-widest">{product.category}</p>
                      </div>
                      {product.onSale && product.discount && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                          -{product.discount}%
                        </div>
                      )}
                      {product.bestseller && (
                        <div className="absolute top-4 left-4 bg-gold text-onyx px-3 py-1 rounded text-xs font-bold">
                          BESTSELLER
                        </div>
                      )}
                      {product.newest && (
                        <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold">
                          NEW
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-lg mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                    <p className="text-sm text-onyx/60 mb-3">
                      {product.karat} • {product.weight}g • {product.gender}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-onyx/50 mb-1">Price</p>
                        <p className="font-serif text-lg text-gold">{formatToman(breakdown.total)}</p>
                      </div>
                      {product.rating && (
                        <div className="text-right">
                          <div className="text-gold text-sm">★ {product.rating}</div>
                          {product.reviews && (
                            <p className="text-xs text-onyx/50">({product.reviews})</p>
                          )}
                        </div>
                      )}
                    </div>
                    {product.freeShipping && (
                      <div className="mt-3 text-xs text-emerald-600 font-medium">
                        🚚 Free Shipping
                      </div>
                    )}
                    {product.expressDelivery && (
                      <div className="mt-1 text-xs text-blue-600 font-medium">
                        ⚡ Express Delivery
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-20 p-12 border border-onyx/10 bg-gradient-to-r from-onyx/2 to-gold/5 rounded">
              <h3 className="font-serif text-2xl mb-4">Find Your Perfect Piece</h3>
              <p className="text-onyx/70 mb-6">
                Every item in this collection combines affordability with our signature luxury craftsmanship. Whether you're shopping for yourself or a loved one, these pieces make perfect gifts.
              </p>
              <Link to="/shop" className="inline-block bg-onyx text-parchment px-6 py-3 rounded hover:bg-gold hover:text-onyx transition-all font-medium">
                Explore All Collections →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
