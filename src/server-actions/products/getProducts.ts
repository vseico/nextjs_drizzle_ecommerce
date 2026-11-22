import { requireAdmin } from "../auth/requireAdmin";
import { db } from "@/db/db";
import { product } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getProducts(){
    try {
        await requireAdmin();

        const products = await db.query.product.findMany({
            with:{
                images:true,
            },
            orderBy:desc(product.createdAt)
        })
        const productstWithMainImage = products.map((product) => ({
            id:product.id,
            name:product.name,
            category:product.category,
            price:product.price,
            stock:product.stock,
            image:product.images.find((image) => image.isMain)?.imageUrl ?? null,
        }));

        return {
            success:true,
            products:productstWithMainImage,
        }
    } catch (error) {
        console.error("GET_PRODUCTS_ERROR:", error);

        return {
            success: false,
            products: [],
            message: "Failed to fetch products.",
        }
    }
}