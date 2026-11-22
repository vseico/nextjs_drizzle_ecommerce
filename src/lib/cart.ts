import { db } from "@/db/db";
import { cartItem } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export interface CartItemDTO {
  productId: string;
  name: string;
  slug: string;
  category: string;
  unit: string;
  price: number;
  oldPrice: number | null;
  image: string | null;
  quantity: number;
  stock: number;
}

export async function loadCartItems(userId: string): Promise<CartItemDTO[]> {
  const rows = await db.query.cartItem.findMany({
    where: eq(cartItem.userId, userId),
    with: {
      product: {
        with: { images: true },
      },
    },
    orderBy: asc(cartItem.createdAt),
  });

  return rows
    .filter((row) => row.product)
    .map((row) => ({
      productId: row.productId,
      name: row.product.name,
      slug: row.product.slug,
      category: row.product.category,
      unit: row.product.unit,
      price: Number(row.product.price),
      oldPrice: row.product.oldPrice ? Number(row.product.oldPrice) : null,
      image:
        row.product.images.find((image) => image.isMain)?.imageUrl ??
        row.product.images[0]?.imageUrl ??
        null,
      quantity: row.quantity,
      stock: row.product.stock,
    }));
}
