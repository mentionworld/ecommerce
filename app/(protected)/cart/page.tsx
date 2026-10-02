'use client'

import { useCart } from "@/hooks/userCart"
import { Loader2, Plus, ShoppingBag, Trash2, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function CartPage() {
    const { items, totalCount, totalPrice, increment, decrement, remove, isEmpty, updatingId } = useCart()


    if (isEmpty) {
        return (
            <main className="max-w-6xl w-full mx-auto px-6 py-20">
                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <ShoppingBag size={64} className="text-muted" />
                    <h1 className="text-2xl font-bold text-text">Your cart is empty</h1>
                    <p className="text-muted">
                        Looks like you have not added anything yet.
                    </p>
                    <Link
                        href="/products"
                        className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-2">
                        Start Shopping
                    </Link>
                </div>
            </main>
        )
    }
    return (
        <main className="max-w-6xl w-full mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold text-text mb-8">
                Shopping Cart
                <span className="text-muted text-lg font-normal ml-2">
                    ({totalCount} {totalCount === 1 ? "item" : "items"})
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="flex-1 flex flex-col gap-4">
                    {items.map((item) => {
                        const isUpdating = updatingId === item.product._id
                        const lineTotal = item.price * item.quantity

                        return (
                            <div
                                key={item.product._id}
                                className="flex gap-4 bg-surface border border-border rounded-xl p-4">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="relative w-24 h-24 flex-shrink-0 bg-bg rounded-lg overflow-hidden">
                                    <Image
                                        src={item.product.images[0] || "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </Link>

                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="font-semibold text-text hover:text-primary line-clamp-1">
                                        {item.product.name}
                                    </Link>

                                    {item.product.brand && (
                                        <span className="text-xs text-muted uppercase">
                                            {item.product.brand}
                                        </span>
                                    )}

                                    <span className="text-sm text-muted">
                                        ₹{item.price.toLocaleString("en-IN")} each
                                    </span>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="flex items-center border border-border rounded-lg">
                                            <button
                                                onClick={() => decrement(item.product._id, item.quantity)}
                                                disabled={isUpdating}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-bg disabled:opacity-50">
                                                <Minus size={14} />
                                            </button>

                                            <span className="w-10 text-center text-sm font-medium">
                                                {isUpdating ? (
                                                    <Loader2 size={14} className="animate-spin mx-auto" />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </span>

                                            <button
                                                onClick={() => increment(item.product._id, item.quantity)}
                                                disabled={isUpdating || item.quantity >= item.product.stock}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-bg disabled:opacity-50">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {item.quantity >= item.product.stock && (
                                            <span className="text-xs text-warning">
                                                Max stock reached
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <span className="font-bold text-text">
                                        ₹{lineTotal.toLocaleString("en-IN")}
                                    </span>
                                    <button
                                        onClick={() => remove(item.product._id)}
                                        disabled={isUpdating}
                                        className="text-muted hover:text-error transition-colors disabled:opacity-50">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <aside className="lg:w-80 flex-shrink-0">
                    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4 sticky top-20">

                        <h2 className="font-semibold text-text">Order Summary</h2>

                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Subtotal ({totalCount} items)</span>
                                <span className="text-text font-medium">
                                    ₹{totalPrice.toLocaleString("en-IN")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Shipping</span>
                                <span className="text-success font-medium">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="font-semibold text-text">Total</span>
                            <span className="text-xl font-bold text-text">
                                ₹{totalPrice.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <Link
                            href="/checkout"
                            className="bg-primary hover:bg-primary-dark text-white font-semibold text-center py-3 rounded-lg transition-colors">
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/products"
                            className="text-center text-sm text-muted hover:text-primary transition-colors">
                            Continue Shopping
                        </Link>

                    </div>
                </aside>

            </div>

        </main>
    )
}