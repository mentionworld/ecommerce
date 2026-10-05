
import { TShowcaseResponse } from "@/types";
import { connectDB } from "./db";
import Product from "@/models/Product.model";


export async function getShowcaseProducts(): Promise<TShowcaseResponse> {
    await connectDB();

    const activeFilter = { isActive: true };
    const [featured, newArrivals, topRated, deals] = await Promise.all([
        Product.find({ ...activeFilter, isFeatured: true }).limit(6).lean(),
        Product.find(activeFilter).sort({ createdAt: -1 }).limit(6).lean(),
        Product.find({ ...activeFilter, "ratings.count": { $gt: 0 } })
            .sort({ "ratings.average": -1 })
            .limit(6)
            .lean(),
        Product.find({
            ...activeFilter,
            $expr: { $gt: ["$comparePrice", "$price"] },
        })
            .limit(6)
            .lean(),
    ]);

    return JSON.parse(
        JSON.stringify({ featured, newArrivals, topRated, deals })
    ) as TShowcaseResponse;

}