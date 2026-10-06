import { getRelatedProduct } from "@/lib/getRelatedProduct"
import { TProduct } from "@/types"
import ProductCard from "./ProductCard"
import { io } from "next/cache"



type TProps = {
    slug: string
}

export default async function RelatedProducts({ slug }: TProps) {
    await io()

    let products: TProduct[]
    try {
        products = await getRelatedProduct(slug)
    } catch (error) {
        console.error("Failed to load related products:", error)
        return (
            <p className="mt-16 text-muted" role="status">
                Related products are temporarily unavailable.
            </p>
        )
    }

    if (products.length == 0) {
        return null
    }

    return (
        <section className="mt-16" >
            <h2 className="text-2xl font-bold text-text mb-6" > Related Products </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    )


}