

import { TShowcaseResponse } from "@/types";
import { getApiBaseUrl } from "./getApiBaseUrl";


export async function getShowcaseProducts(): Promise<TShowcaseResponse> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/products/showcase`;

    const response = await fetch(url, {
        cache: 'no-store'
    });

    if (response.status === 404) {
        return {
            featured: [],
            newArrivals: [],
            topRated: [],
            deals: []
        };
    }

    if (!response.ok) {
        throw new Error("Error in fetching products");
    }

    const { featured, newArrivals, topRated, deals } = await response.json();

    return { featured, newArrivals, topRated, deals };

}