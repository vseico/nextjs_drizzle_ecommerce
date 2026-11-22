import { db } from "@/db/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductBySlug(slug: string) {
  try {
    const found = await db.query.product.findFirst({
      where: eq(product.slug, slug),
      with: { images: true },
    });
    if (!found) return null;

    const images = [...found.images].sort(
      (a, b) => Number(b.isMain) - Number(a.isMain),
    );
    return {
      id: found.id,
      name: found.name,
      slug: found.slug,
      category: found.category,
      unit: found.unit,
      description: found.description,
      price: Number(found.price),
      oldPrice: found.oldPrice ? Number(found.oldPrice) : null,
      stock: found.stock,
      images: images.map((image) => image.imageUrl),
    };
  } catch (error) {
    console.error("GET_PRODUCT_BY_SLUG_ERROR:", error);
    return null;
  }
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
