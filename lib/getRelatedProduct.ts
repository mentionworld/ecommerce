import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { TProduct } from "@/types";

export async function getRelatedProduct(slug: string): Promise<TProduct[]> {
    await connectDB();

    const current = await Product.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
    })
        .select("category")
        .lean();

    if (!current) {
        return [];
    }

    const related = await Product.find({
        category: current.category,
        isActive: true,
        slug: { $ne: slug.toLowerCase() },
    })
        .limit(6)
        .lean();

    return JSON.parse(JSON.stringify(related)) as TProduct[];
}
