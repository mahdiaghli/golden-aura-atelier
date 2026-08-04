import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

type Props = {
  product: Pick<Product, "name" | "image" | "code" | "sku" | "typeLabel">;
  className?: string;
  loading?: "lazy" | "eager";
};

/**
 * Renders the product's real photo when one exists.
 * When the piece has no photo of its own we show a neutral branded frame
 * instead of another product's picture, so nothing is ever mislabelled.
 */
export function ProductImage({ product, className, loading = "lazy" }: Props) {
  const reference = product.code || product.sku || "";

  if (!product.image) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-secondary text-center",
          className,
        )}
        role="img"
        aria-label={`${product.name} — photo coming soon`}
      >
        <span className="font-serif text-2xl tracking-[0.3em] text-gold/70">AURUM</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-onyx/40">
          {product.typeLabel || "Piece"}
        </span>
        {reference && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-onyx/30">{reference}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      loading={loading}
      className={cn("object-cover", className)}
    />
  );
}
