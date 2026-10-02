import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { NextRequest } from "next/server";



export async function GET(request: NextRequest) {

    try {

        await connectDB();

        const { searchParams } = request.nextUrl

        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        const brand = searchParams.get('brand') || '';
        const featured = searchParams.get('featured') || '';
        const minPrice = searchParams.get('minPrice') || 0;
        const maxPrice = searchParams.get('maxPrice') || 0;
        const rating = searchParams.get('rating') || 0;

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const sort = searchParams.get('sort') || 'createdAt';

        const filter: Record<string, unknown> = {
            isActive: true
        }

        if (category) {
            filter.category = category.toLowerCase()
        }

        if (brand) {
            filter.brand = brand.toLowerCase()
        }

        if (featured) {
            filter.isFeatured = true
        }

        if (Number(minPrice) > 0 || Number(maxPrice) > 0) {
            const priceFilter: { $gte?: number; $lte?: number } = {}
            if (Number(minPrice) > 0) {
                priceFilter.$gte = Number(minPrice)
            }
            if (Number(maxPrice) > 0) {
                priceFilter.$lte = Number(maxPrice)
            }
            filter.price = priceFilter
        }

        if (Number(rating) > 0) {
            filter['ratings.average'] = { $gte: Number(rating) }
        }

        if (search) {
            filter.$text = {
                $search: search
            }
        }

        const sortOptions: Record<string, 1 | -1> = {}

        switch (sort) {
            case 'price':
                sortOptions.price = 1;
                break;
            case 'price-desc':
                sortOptions.price = -1;
                break;
            case 'rating':
                sortOptions['ratings.average'] = -1;
                break;
            case 'popular':
                sortOptions['ratings.count'] = -1;
                break;
            default:
                sortOptions.createdAt = -1;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, totalCount, categories, brands, priceRangeResult] = await Promise.all([
            Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Product.countDocuments(filter),

            Product.distinct('category', { isActive: true }),

            Product.distinct('brand', { isActive: true }),

            Product.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        min: { $min: '$price' },
                        max: { $max: '$price' }
                    }
                }
            ])
        ])

        const totalPage = Math.ceil(totalCount / Number(limit))
        const hasNextPage = Number(page) < totalPage
        const hasPrevPage = Number(page) > 1

        const priceRange = priceRangeResult[0] || { min: 0, max: 0 }

        const ratings = [4, 3, 2, 1]



        return Response.json({
            products,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: totalPage,
                hasNextPage,
                hasPrevPage
            },
            filters: {
                categories,
                brands,
                priceRange: {
                    min: priceRange.min,
                    max: priceRange.max
                },
                ratings
            }
        }, { status: 200 })



    } catch (error) {
        console.error("Error fetching products:", error);
        return Response.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }

}