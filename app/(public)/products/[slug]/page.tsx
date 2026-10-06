import { getProduct } from "@/lib/getProduct";
import { TProduct } from "@/types";
import { Check, Star, X } from "lucide-react";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import type { Metadata } from "next";
import { Suspense } from "react";
import RelatedProducts from "@/components/store/RelatedProducts";
import ProductActions from "@/components/cart/ProductActions";


type TProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { slug } = await params;

    const product: TProduct | null = await getProduct(slug)

    if (!product) {
        return {
            title: 'Product Not Found.',
            description: 'The product you are looking for does not exist.'
        }
    }

    const description = product.description.length > 160 ? product.description.slice(0, 167) + '...' : product.description

    const productImage = product.images[0];

    return {
        title: product.name,
        description,
        openGraph: {
            type: 'website',
            images: productImage ? [
                {
                    url: productImage,
                    width: 800,
                    height: 800,
                    alt: product.name
                }
            ] : [],
        },

        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description,
            images: productImage ? [productImage] : []
        }
    }


}

export default async function ProductDetails({ params }: TProps) {

    const { slug } = await params;

    const product: TProduct | null = await getProduct(slug)

    if (!product) {
        return notFound()
    }

    const inStock = product.stock > 0;

    return (
        <div className="max-w-6xl w-full mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                <ProductImageGallery
                    images={product.images}
                    name={product.name}
                    discountPercentage={product.discountPercentage}
                />

                <div className="flex flex-col gap-5">
                    {
                        product.brand && (
                            <span className="text-sm text-muted uppercase tracking-wide">
                                {product.brand}
                            </span>
                        )
                    }

                    {product.name && <h1 className="text-3xl font-bold text-text">{product.name}</h1>}

                    {
                        product.ratings.count > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-md">
                                    <Star size={14} className="fill-success text-success" />
                                    <span className="text-sm font-semibold">
                                        {product.ratings.average.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-sm text-muted">
                                    {product.ratings.count} reviews
                                </span>
                            </div>
                        )
                    }


                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-text">
                            ₹{product.price.toLocaleString("en-IN")} {' '}
                        </span>
                        {product.comparePrice > product.price && (
                            <span className="text-lg text-muted line-through">
                                ₹{product.comparePrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {
                            inStock ? (
                                <span className="flex items-center gap-1.5 text-success text-sm font-medium" >
                                    <Check size={16} />
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-error text-sm font-medium">
                                    <X size={16} />
                                    Out of Stock
                                </span>
                            )}
                    </div>
                    <p className="text-muted leading-relaxed">
                        {product.description}
                    </p>

                    <ProductActions product={product} />

                    {
                        product.specifications &&
                        Object.keys(product.specifications).length > 0 && (
                            <div className="border-t border-border pt-5 mt-2">
                                <h2 className="font-semibold text-text mb-3">Specifications</h2>
                                <div className="flex flex-col gap-2">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex text-sm">
                                            <span className="text-muted w-32">{key}</span>
                                            <span className="text-text font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <Suspense fallback={<p>Loading Related Products...</p>}>
                <RelatedProducts slug={slug} />
            </Suspense>

        </div >
    )
}