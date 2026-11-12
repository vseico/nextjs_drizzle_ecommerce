import { getShopProducts } from "@/server-actions/products/getShopProducts";
import ProductCard from "./ProductCard";

interface ShopProductsProps {
  categories: string[];
  priceRanges: string[];
  sort: "newest" | "oldest" | "price-low" | "price-high";
}

export default async function ShopProducts({
  categories,
  priceRanges,
  sort,
}: ShopProductsProps) {
  const { products } = await getShopProducts({
    categories,
    priceRanges,
    sort,
  });
  if (products.length === 0) {
    return (
      <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-border bg-card px-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text">No products found</h3>
          <p className="mt-2 text-sm text-muted">
            We couldn&apos;t find any products matching your filters.
          </p>
          <p className="mt-1 text-sm text-muted ">
            Try adjusting your filters or selecting a different category.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-6 gap-6 ">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
