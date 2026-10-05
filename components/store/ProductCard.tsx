'use client'

import { TProduct } from "@/types"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


type TProps = {
    product: TProduct
}


export default function ProductCard({ product }: TProps) {

    const mainImage = product.images[0] || '/no-image.png'
    return (
        <Link
            className="group bg-surface border border-border rounded-xl overflow-hidden
        hover:shadow-lg transition-all duration-200"
            href={`/products/${product.slug}`}>
            <div className="relative aspect-square bg-bg overflow-hidden">

                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-200" />


                {product.discountPercentage > 0 && <div className="absolute top-3 left-3 bg-error text-white
            text-xs font-bold px-2 py-1 rounded-md">
                    {product.discountPercentage}% OFF
                </div>}

                {
                    product.stock == 0 &&
                    <div className="absolute top-3 right-3 bg-surface text-white
            text-xs font-bold px-2 py-1 rounded-md">
                        OUT OF STOCK
                    </div>
                }
            </div>
            <div className="p-4 flex flex-col gap-2">

                {product.brand && (
                    <div className="font-xs text-muted uppercase tracking-wide">
                        {product.brand}
                    </div>
                )}

                <h3 className="text-sm font-semibold text-text line-clamp-2
                    group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {product.ratings.count > 0 && (
                    <div className="flex items-center gap-1">
                        <Star size={14} className="fill-warning text-warning" />
                        <span className="text-xs font-medium text-text">
                            {product.ratings.average.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted">
                            ({product.ratings.count})
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-text">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.comparePrice > product.price && (
                        <span className="text-sm text-muted line-through">
                            ₹{product.comparePrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>


            </div>
        </Link >
    )
}
