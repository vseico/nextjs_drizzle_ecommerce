import { db } from "@/db/db";
import { product } from "@/db/schema";
import { and, asc, desc, gte, inArray, lt, or } from "drizzle-orm";

interface GetShopProductsOptions {
  categories?: string[];
  priceRanges?: string[];
  sort?: "newest" | "oldest" | "price-low" | "price-high";
}

export async function getShopProducts({
  categories = [],
  priceRanges = [],
  sort = "newest",
}: GetShopProductsOptions = {}) {
  try {
    const filters = [];

    if (categories.length > 0) {
      filters.push(inArray(product.category, categories));
    }
    if (priceRanges.length > 0) {
      const priceConditions = [];

      for (const range of priceRanges) {
        switch (range) {
          case "0-10":
            priceConditions.push(
              and(gte(product.price, "0"), lt(product.price, "10")),
            );
            break;
          case "10-25":
            priceConditions.push(
              and(gte(product.price, "10"), lt(product.price, "25")),
            );
            break;
          case "25-50":
            priceConditions.push(
              and(gte(product.price, "25"), lt(product.price, "50")),
            );
            break;
          case "50+":
            priceConditions.push(gte(product.price, "50"));
            break;
        }
      }
      if (priceConditions.length > 0) {
        filters.push(or(...priceConditions));
      }
    }
    const products = await db.query.product.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      with: {
        images: true,
      },
      orderBy:
        sort === "oldest" 
          ? asc(product.createdAt)
          : sort === "price-low"
            ? asc(product.price)
            : sort === "price-high"
              ? desc(product.price)
              : desc(product.createdAt),
    });
    const shopProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        unit: product.unit,
        slug: product.slug,
        stock: product.stock,
        image: product.images.find((image) => image.isMain)?.imageUrl ?? null,
    }));

    return {
        success: true,
        products: shopProducts,
    };
  } catch (error) {
    console.error("GET_SHOP_PRODUCTS_ERROR:", error);

    return {
      success: false,
      products: [],
      message: "Failed to fetch products.",
    };
  }
}
