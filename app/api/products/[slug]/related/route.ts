import { getRelatedProduct } from "@/lib/getRelatedProduct";
import { NextResponse } from "next/server";

type TParams = {
    params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: TParams) {
    try {
        const { slug } = await params;
        const product = await getRelatedProduct(slug);
        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("Error fetching related products:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
