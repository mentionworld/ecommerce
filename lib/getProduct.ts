import { TProduct } from "@/types";

export async function getProduct(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const url = `${baseUrl}/api/products/${slug}`;

    const response = await fetch(url, {
        cache: 'no-store'
    });

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error("Error in fetching products");
    }

    const data = await response.json();

    return data.product;

}