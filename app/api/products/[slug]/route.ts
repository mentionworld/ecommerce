import { getProduct } from "@/lib/getProduct";
import { NextRequest, NextResponse } from "next/server";

type TParams = {
    params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: TParams) {

    try {
        const { slug } = await params;
        const product = await getProduct(slug);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ product }, { status: 200 })

    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}