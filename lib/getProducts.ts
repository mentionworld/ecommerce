import { TProductsResponse } from "@/types";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";

export async function getProducts(
    searchParams: Record<string, string | undefined>
): Promise<TProductsResponse> {
    await connectDB();

    const category = searchParams.category || "";
    const search = searchParams.search || "";
    const brand = searchParams.brand || "";
    const featured = searchParams.featured || "";
    const minPrice = Number(searchParams.minPrice || 0);
    const maxPrice = Number(searchParams.maxPrice || 0);
    const rating = Number(searchParams.rating || 0);
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "12", 10);
    const sort = searchParams.sort || "createdAt";

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = brand.toLowerCase();
    if (featured) filter.isFeatured = true;

    if (minPrice > 0 || maxPrice > 0) {
        const priceFilter: { $gte?: number; $lte?: number } = {};
        if (minPrice > 0) priceFilter.$gte = minPrice;
        if (maxPrice > 0) priceFilter.$lte = maxPrice;
        filter.price = priceFilter;
    }

    if (rating > 0) {
        filter["ratings.average"] = { $gte: rating };
    }

    if (search) {
        filter.$text = { $search: search };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
        case "price":
            sortOptions.price = 1;
            break;
        case "price-desc":
            sortOptions.price = -1;
            break;
        case "rating":
            sortOptions["ratings.average"] = -1;
            break;
        case "popular":
            sortOptions["ratings.count"] = -1;
            break;
        default:
            sortOptions.createdAt = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, totalCount, categories, brands, priceRangeResult] =
        await Promise.all([
            Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Product.countDocuments(filter),
            Product.distinct("category", { isActive: true }),
            Product.distinct("brand", { isActive: true }),
            Product.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        min: { $min: "$price" },
                        max: { $max: "$price" },
                    },
                },
            ]),
        ]);

    const totalPages = Math.ceil(totalCount / Number(limit));
    const priceRange = priceRangeResult[0] || { min: 0, max: 0 };

    return JSON.parse(
        JSON.stringify({
            products,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
            filters: {
                categories,
                brands,
                priceRange: {
                    min: priceRange.min,
                    max: priceRange.max,
                },
                ratings: [4, 3, 2, 1],
            },
        })
    ) as TProductsResponse;
}
