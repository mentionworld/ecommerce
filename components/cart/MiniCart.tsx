'use client'

import { useCart } from "@/hooks/userCart"
import { useAppSelector } from "@/store/hook"
import { selectCartCount } from "@/store/selectors"
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"



export default function MiniCart() {

    const cartCount = useAppSelector(selectCartCount)

    const { items, totalPrice, increment, decrement, remove, updatingId, isEmpty } = useCart()

    return (
        <div className="relative group">

            <Link href={"/cart"}>
                <ShoppingCart size={18} className="text-text hover:text-primary transition-colors" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </Link>

            {/* pt-2 creates a seamless invisible bridge so the cursor never leaves
                the hover zone while moving from the icon down to the dropdown panel */}
            <div className="hidden md:block absolute right-0 top-full pt-2 w-80 z-50
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-150">
                <div className="bg-surface border border-border rounded-xl shadow-xl overflow-hidden">

                    {isEmpty ? (
                        <div className="p-6 text-center">
                            <ShoppingCart size={32} className="mx-auto mb-2 text-muted" />
                            <p className="text-sm text-muted">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-80 overflow-y-auto p-2">
                                {items.map((item) => {
                                    const isUpdating = updatingId === item.product._id
                                    return (
                                        <div key={item.product._id} className="flex gap-3 p-2 rounded-lg hover:bg-bg transition-colors">
                                            <div className="relative w-14 h-14 flex-shrink-0 bg-bg rounded-md overflow-hidden">
                                                <Image
                                                    src={item.product.images[0] || "/placeholder.png"}
                                                    alt={item.product.name}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${item.product.slug}`}
                                                    className="text-sm font-medium text-text line-clamp-1 hover:text-primary"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-xs text-muted mt-0.5">
                                                    ₹{item.price.toLocaleString("en-IN")}
                                                </p>

                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <button
                                                        onClick={() => decrement(item.product._id, item.quantity)}
                                                        disabled={isUpdating}
                                                        className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-bg disabled:opacity-50"
                                                    >
                                                        <Minus size={12} />
                                                    </button>

                                                    <span className="text-sm font-medium w-6 text-center">
                                                        {isUpdating ? (
                                                            <Loader2 size={12} className="animate-spin mx-auto" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>

                                                    <button
                                                        onClick={() => increment(item.product._id, item.quantity)}
                                                        disabled={isUpdating || item.quantity >= item.product.stock}
                                                        className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-bg disabled:opacity-50"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => remove(item.product._id)}
                                                disabled={isUpdating}
                                                className="text-muted hover:text-error transition-colors self-start disabled:opacity-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="border-t border-border p-3 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted">Total</span>
                                    <span className="text-base font-bold text-text">
                                        ₹{totalPrice.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href="/cart"
                                        className="flex-1 text-center text-sm font-medium border
                                        border-border text-text py-2 rounded-lg hover:bg-bg
                                        transition-colors"
                                    >
                                        View Cart
                                    </Link>
                                    <Link
                                        href="/checkout"
                                        className="flex-1 text-center text-sm font-semibold bg-primary
                                        text-white py-2 rounded-lg hover:bg-primary-dark
                                        transition-colors"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>



        </div>
    )

}