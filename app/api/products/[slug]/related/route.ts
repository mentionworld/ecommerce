import { connectDB } from "@/lib/db"
import Product from "@/models/Product.model"
import { NextRequest, NextResponse } from "next/server"



type TParams = {
    params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: TParams) {
    try {

        const { slug } = await params

        await connectDB()

        const current = await Product.findOne({ slug: slug.toLowerCase() }).select('category').lean()

        if (!current) {
            return NextResponse.json({ product: [] }, { status: 200 })
        }

        const related = await Product.find({
            category: current.category,
            isActive: true,
            slug: { $ne: slug },
        }).limit(6).lean()

        return NextResponse.json({ product: related }, { status: 200 })

    } catch (err) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}