import { products } from "@/components/constants/products";
import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import FilterOptions from "@/components/product/FilterOptions";
import ProductCard from "@/components/product/ProductCard";
import SortOptions from "@/components/product/SortOptions";

export default function page() {
  return (
    <FrontedLayouts>
      <div className="my-6">
        <div className="flex flex-col sm:flex-row gap-5 my-10">
          <FilterOptions />
          <div className="flex-1">
            <SortOptions />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-6 gap-6 ">
              {products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </FrontedLayouts>
  );
}
