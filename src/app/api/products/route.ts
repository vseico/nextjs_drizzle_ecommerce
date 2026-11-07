import { db } from "@/db/db";
import { product, productImage } from "@/db/schema";
import { requireAdmin } from "@/server-actions/auth/requireAdmin";
import { uploadImages } from "@/services/uploadImages";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const category = formData.get("category")?.toString();
    const unit = formData.get("unit")?.toString();
    const price = formData.get("price")?.toString();
    const oldPrice = formData.get("oldPrice")?.toString();
    const description = formData.get("description")?.toString();
    const stock = formData.get("stock")?.toString();

    // generate the product slug from the name
    const slug = name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const images = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File);
    if (
      !name ||
      !slug ||
      !category ||
      !unit ||
      !price ||
      !description ||
      !stock
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required.",
        },
        { status: 400 },
      );
    }
    if (images.length < 1 || images.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload between 1 and 4 images.",
        },
        { status: 400 },
      );
    }
    // upload the image to cloudinary
    const uploadedImages = await uploadImages(images);
    const productId = crypto.randomUUID();
    await db.transaction(async (tx) => {
      await tx.insert(product).values({
        id: productId,
        name,
        slug,
        category,
        unit,
        price,
        oldPrice: oldPrice || null,
        description,
        stock: Number(stock),
      });

      await tx.insert(productImage).values(
        uploadedImages.map((image,index) => ({
            id:crypto.randomUUID(),
            productId,
            imageUrl:image.imageUrl,
            publicId:image.publicId,
            isMain:index === 0
        }))
      )
    });

    return NextResponse.json({
        success: true,
        message: "Product created successfully.",
        productId,
    },{
        status: 201
    })
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 },
    );
  }
}
