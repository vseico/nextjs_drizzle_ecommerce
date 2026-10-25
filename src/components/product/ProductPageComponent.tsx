"use client";

import Image from "next/image";
import { useState } from "react";

const product = {
  name: "Instant Chicken Noodles",
  category: "Instant Foods",
  price: 189,
  offerPrice: 159,
  images: [
    "/images/gallery-1.png",
    "/images/gallery-2.png",
    "/images/gallery-3.png",
  ],
  description: 
    "Fresh and carefully selected for the best quality. Rich in natural flavor and perfect for everyday meals. Packed carefullt to preserve freshness"
  
};
const ProductPageComponent = () => {
  const [thumbnail, setThumbnail] = useState(product.images[0]);
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted sm:text-sm">
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-primary">{product.name}</span>

      </div>
      
      <div className="flex flex-col gap-8 lg:flex-row md:gap-12 lg:gap-16">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse gap-3 sm:flex-row ">
            {/* thumbnails  */}
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
              {product.images.map((image,index)=> (
                <button type = "button" key={index} onClick={() => setThumbnail(image)} className={`h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition ${thumbnail === image ? "border-primary" : "border-border hover:border-primary" }`}>
                  <Image src={image} alt={`thumbnail ${index + 1}`} width={100} height={100} className="h-full w-full object-contain"/>   
                </button>
              ))}
            </div>
            {/* main image  */}
            <div className="h-72 w-full overflow-hidden rounded-lg border border-border bg-background sm:h-96 md:h-105">
              <Image src={thumbnail} alt={product.name} width={600} height={600}  className="h-full object-contain p-4 sm:p-6" />
              
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-medium text-text sm:text-3xl lg:text-4xl">
              {product.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {product.category}
            </p>
            <div className="mt-5">
              <p className="text-sm text-muted line-through sm:text-base">
                  ${product.price}
              </p>
              <p className="mt-1 text-2xl font-medium text-primary sm:text-3xl">
                ${product.offerPrice}
              </p>
              <div className="mt-6 ">
                <p className="text-base font-medium text-text mb-4">
                  AboutProduct
                </p>
                <p className="text-muted">
                  {product.description}
                </p>

              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button type="button" className="w-full cursor-pointer rounded-lg bg-gray-100 py-3.5 font-medium text-text transition hover:bg-border">Add to Cart</button>
                <button className="w-full cursor-pointer rounded-lg bg-primary py-3.5 font-medium text-white transition hover:bg-primary-hover" type="button">
                  Buy Now
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;
