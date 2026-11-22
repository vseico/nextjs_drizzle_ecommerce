"use server"

import { db } from "@/db/db";
import { product, productImage } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../auth/requireAdmin";

export async function deleteProduct(productId:string){
    await requireAdmin();
    try {
        const images = await db.select({
            publicId:productImage.publicId
        }).from(productImage).where(eq(productImage.productId, productId))

        await Promise.all(images.map((image) => cloudinary.uploader.destroy(image.publicId)))
        

        await db.delete(product).where(eq(product.id,productId))

        return {
            success: true,
            message: "Product deleted successfully.",
        }
    } catch (error) {
        console.error("DELETE_PRODUCT_ERROR:", error);
        
    }
    return{
        success: false,
        message: "Failed to delete product.",
    }

}