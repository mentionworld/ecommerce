import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { TProduct } from "@/types";

export async function getProduct(slug: string): Promise<TProduct | null> {
    await connectDB();

    const product = await Product.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
    }).lean();

    if (!product) {
        return null;
    }

    return JSON.parse(JSON.stringify(product)) as TProduct;
}
