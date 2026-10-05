import { getShowcaseProducts } from "@/lib/getShowCase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await getShowcaseProducts();
        return NextResponse.json(products, { status: 200 })

    } catch (err) {
        console.error('Error fetching showcase products:', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
