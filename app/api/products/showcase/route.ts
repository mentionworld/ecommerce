import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        await connectDB()

        const activeFilter = { isActive: true }


        const [featured, newArrivals, topRated, deals] = await Promise.all([
            Product.find({ ...activeFilter, isFeatured: true }).limit(6).lean(),
            Product.find(activeFilter).sort({ createdAt: -1 }).limit(6).lean(),
            Product.find({ ...activeFilter, 'ratings.count': { $gt: 0 } }).sort({ 'ratings.average': -1 }).limit(6).lean(),
            Product.find({ ...activeFilter, $expr: { $gt: ['$comparePrice', '$price'] } }).limit(6).lean()
        ])

        return NextResponse.json({ featured, newArrivals, topRated, deals }, { status: 200 })

    } catch (err) {
        console.error('Error fetching showcase products:', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
