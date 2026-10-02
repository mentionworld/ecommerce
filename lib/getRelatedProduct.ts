
export async function getRelatedProduct(slug: string) {

    try {

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const url = `${baseUrl}/api/products/${slug}/related`;

        const res = await fetch(url, {
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error('Error while fetching the related products')
        }

        const data = await res.json()
        return data.product

    } catch (err) {
        console.log('Error while fetching the related products')
        return []

    }

}
