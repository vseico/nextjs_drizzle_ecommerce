import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface ProductCardType {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string | null;
  unit: string;
  slug: string;
  image: string | null;
  stock?: number;
}
interface ProductCardProps {
  product: ProductCardType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  return (
    <div className="group w-full rounded-md border border-gray-500/20 bg-white px-3 py-2 md:px-4">
      <Link href={`/products/${product.slug}`} className="flex justify-center">
        {product.image ? (
          <Image
            className="h-40 w-40 object-contain transition group-hover:scale-105"
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
          />
        ) : (
          <div className="h-40 w-40 rounded bg-background" />
        )}
      </Link>
      <div className="text-sm text-gray-500/60">
        <p>{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <p className="w-full truncate text-lg font-medium text-gray-700">
            {product.name}
          </p>
        </Link>
        <p className="text-xs">{product.unit}</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-base font-medium text-primary md:text-xl">
            ${Number(product.price).toFixed(2)}{" "}
            {product.oldPrice && (
              <span className="text-xs text-gray-500/60 line-through md:text-sm">
                ${Number(product.oldPrice).toFixed(2)}
              </span>
            )}
          </p>
          <AddToCartButton productId={product.id} disabled={outOfStock} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
