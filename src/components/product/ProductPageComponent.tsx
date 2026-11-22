"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductDetail } from "@/server-actions/products/getProductBySlug";
import AddToCartButton from "./AddToCartButton";

const ProductPageComponent = ({ product }: { product: ProductDetail }) => {
  const [thumbnail, setThumbnail] = useState(product.images[0] ?? null);
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted sm:text-sm">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse gap-3 sm:flex-row ">
            {/* thumbnails  */}
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
              {product.images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => setThumbnail(image)}
                  className={`h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition ${thumbnail === image ? "border-primary" : "border-border hover:border-primary"}`}
                >
                  <Image src={image} alt={`thumbnail ${index + 1}`} width={100} height={100} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
            {/* main image  */}
            <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-background sm:h-96 md:h-105">
              {thumbnail && (
                <Image src={thumbnail} alt={product.name} width={600} height={600} priority className="h-full object-contain p-4 sm:p-6" />
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-medium text-text sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {product.category} · {product.unit}
          </p>
          <div className="mt-5">
            {product.oldPrice && (
              <p className="text-sm text-muted line-through sm:text-base">
                ${product.oldPrice.toFixed(2)}
              </p>
            )}
            <p className="mt-1 text-2xl font-medium text-primary sm:text-3xl">
              ${product.price.toFixed(2)}
            </p>
            <p className={`mt-2 text-sm ${outOfStock ? "text-error" : "text-success"}`}>
              {outOfStock ? "Out of stock" : `${product.stock} in stock`}
            </p>
            <div className="mt-6 ">
              <p className="mb-4 text-base font-medium text-text">
                About Product
              </p>
              <p className="whitespace-pre-line text-muted">{product.description}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <AddToCartButton productId={product.id} variant="secondary" disabled={outOfStock} />
              <AddToCartButton productId={product.id} variant="buy-now" disabled={outOfStock} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;
