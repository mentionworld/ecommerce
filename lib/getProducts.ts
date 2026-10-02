
import { TProductsResponse } from '@/types'


export async function getProducts(
    searchParams: Record<string, string | undefined>
): Promise<TProductsResponse> {
    try {

        const params = new URLSearchParams()

        for (const [key, value] of Object.entries(searchParams)) {
            if (value) {
                params.set(key, value)
            }
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

        const url = `${baseUrl}/api/products?${params.toString()}`;

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`)
        }

        return response.json();

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching products:", error.message);
        } else {
            console.error("Unknown error occurred while fetching products");
        }

        // Return a default empty state to prevent the application from crashing
        // This allows the UI to display "No products found" or a similar message
        return {
            products: [],
            pagination: {
                page: 1,
                limit: 10,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
            },
            filters: {
                categories: [],
                brands: [],
                priceRange: {
                    min: 0,
                    max: 1000,
                },
                ratings: [],
            },
        };
    }

}