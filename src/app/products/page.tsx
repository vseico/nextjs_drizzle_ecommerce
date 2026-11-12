import { products } from "@/components/constants/products";
import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import ProductCardSkeleton from "@/components/loading/skeletons/ProductCardSkeleton";
import FilterOptions from "@/components/product/FilterOptions";
import ProductCard from "@/components/product/ProductCard";
import ShopProducts from "@/components/product/ShopProducts";
import SortOptions from "@/components/product/SortOptions";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{
    categories?: string | string[];
    priceRanges?: string | string[];
    sort?: string;
  }>;
}

export default async function page({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categories = params.categories
    ? Array.isArray(params.categories)
      ? params.categories
      : [params.categories]
    : [];

  const priceRanges = params.priceRanges
    ? Array.isArray(params.priceRanges)
      ? params.priceRanges
      : [params.priceRanges]
    : [];

  const sort =
    params.sort === "oldest" ||
    params.sort === "price-low" ||
    params.sort === "price-high"
      ? params.sort
      : "newest";
  return (
    <FrontedLayouts>
      <div className="my-6">
        <div className="flex flex-col sm:flex-row gap-5 my-10">
          <FilterOptions />
          <div className="flex-1">
            <SortOptions />
            <Suspense fallback={<ProductCardSkeleton number={4}/>}>
              <ShopProducts
                categories={categories}
                priceRanges={priceRanges}
                sort={sort}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </FrontedLayouts>
  );
}
