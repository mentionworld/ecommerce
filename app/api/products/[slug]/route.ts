import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";

type TParams = {
    params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: TParams) {

    try {
        const { slug } = await params;

        await connectDB()

        const product = await Product.findOne({ slug: slug.toLowerCase(), isActive: true }).lean()

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }


        return NextResponse.json({ product }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}