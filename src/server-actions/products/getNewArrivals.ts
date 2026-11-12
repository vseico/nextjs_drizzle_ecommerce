import { db } from "@/db/db";
import { product } from "@/db/schema";
import { success } from "better-auth";
import { desc } from "drizzle-orm";

export async function getNewArrivals(){
    try {
        const products = await db.query.product.findMany({
            with:{
                images:true,
            
            },
            orderBy:desc(product.createdAt),
            limit: 10
        });
        const newArrivals = products.map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price:product.price,
            oldPrice: product.oldPrice,
            unit: product.unit,
            slug: product.slug,
            image:product.images.find((image) => image.isMain)?.imageUrl ?? null
        }))
        return {
            success:true,
            products:newArrivals
        }
    } catch (error) {
        console.error("GET_NEW_ARRIVALS_ERROR:", error);
        return{
            success: false,
            products: [],
            message: "Failed to fetch new arrivals.",
        }
        
    }
}