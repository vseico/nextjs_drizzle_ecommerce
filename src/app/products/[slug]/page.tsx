import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import ProductPageComponent from "@/components/product/ProductPageComponent";
import { getProductBySlug } from "@/server-actions/products/getProductBySlug";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | Grocery Cart" };
  return {
    title: `${product.name} | Grocery Cart`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <FrontedLayouts>
      <ProductPageComponent product={product} />
    </FrontedLayouts>
  );
}
