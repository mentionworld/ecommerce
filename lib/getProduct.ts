import { getApiBaseUrl } from "./getApiBaseUrl";

export async function getProduct(slug: string) {
    const baseUrl = getApiBaseUrl();
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