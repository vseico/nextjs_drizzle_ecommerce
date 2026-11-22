import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import ProductCard from "@/components/product/ProductCard";
import { getSearchProducts } from "@/server-actions/products/getSearchProducts";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const { products } = await getSearchProducts(query);

  return (
    <FrontedLayouts>
      <div className="my-10">
        <h1 className="text-2xl font-medium text-text md:text-3xl">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search products"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {query
            ? `${products.length} ${products.length === 1 ? "product" : "products"} found`
            : "Type something in the search box to find products."}
        </p>

        {query && products.length === 0 ? (
          <div className="mt-6 flex min-h-60 items-center justify-center rounded-xl border border-border bg-card px-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-text">No products found</h3>
              <p className="mt-2 text-sm text-muted">Try a different search term.</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </FrontedLayouts>
  );
}
