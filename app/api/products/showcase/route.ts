import { getShowcaseProducts } from "@/lib/getShowCase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    await headers();

    try {
        const products = await getShowcaseProducts();
        return NextResponse.json(products, { status: 200 })

    } catch (err) {
        console.error('Error fetching showcase products:', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
