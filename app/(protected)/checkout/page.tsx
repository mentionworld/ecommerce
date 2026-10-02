'use client'

import AddressManager from "@/components/address/AddressManager"
import { useCart } from "@/hooks/userCart"
import { fetchAddresses } from "@/lib/addressApi"
import { useAppDispatch } from "@/store/hook"
import { clearCart } from "@/store/slices/cartSlice"
import { TAddress } from "@/types"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckoutPage() {

    const router = useRouter()
    const dispatch = useAppDispatch()
    const { items, totalPrice, totalCount, isEmpty } = useCart()

    const [addressLoading, setAddressLoading] = useState<boolean>(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [isPlacing, setIsPlacing] = useState(false)
    const [error, setError] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "razorpay">("cod")
    const [orderPlaced, setOrderPlaced] = useState(false)

    useEffect(() => {

        fetchAddresses().then((addresses: TAddress[]) => {
            const defaultAdr = addresses?.find(a => a.isDefault)
            if (defaultAdr) {
                setSelectedAddressId(defaultAdr._id)
            }
        })
            .catch((err) => console.log(err))
            .finally(() => setAddressLoading(true))
    }, [])

    useEffect(() => {
        if (isEmpty && !orderPlaced) {
            router.replace('/cart')
        }
    }, [isEmpty, router, orderPlaced])


    async function handlePlaceOrder() {

        if (selectedPaymentMethod === "razorpay") {
            setError("Razorpay is temporarily unavailable. Please select Cash on Delivery (COD).")
            return
        }

        if (!selectedAddressId) {
            setError("Please select a delivery address")
            return
        }

        setIsPlacing(true)
        setError("")

        try {

            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    paymentMethod: selectedPaymentMethod,
                })
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.message || "Failed to place order")
                return
            }

            const data = await res.json()
            setOrderPlaced(true)
            dispatch(clearCart())
            router.push(`/orders/${data.order._id}`)
        } catch {
            setError("Something went wrong. Please try again.")
            setIsPlacing(false)
        } finally {
            setIsPlacing(false)
        }
    }

    return (
        <main className="max-w-6xl w-full mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-text mb-6">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-8">
                    <section className="bg-surface border border-border rounded-xl p-4">
                        <h3 className="font-semibold text-text">Shipping Address</h3>
                        {addressLoading ?
                            <AddressManager
                                selectable
                                selectedId={selectedAddressId}
                                onSelect={setSelectedAddressId} /> : <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-muted" />
                            </div>}
                    </section>

                    <section>
                        <h2 className="font-semibold text-text mb-4">
                            Order Items ({totalCount})
                        </h2>
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <div
                                    key={item.product._id}
                                    className="flex gap-4 bg-surface border border-border rounded-xl p-3">
                                    <div className="relative w-16 h-16 flex-shrink-0 bg-bg rounded-md overflow-hidden">
                                        <Image
                                            src={item.product.images[0] || "/placeholder.png"}
                                            alt={item.product.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text text-sm line-clamp-1">
                                            {item.product.name}
                                        </p>
                                        <p className="text-xs text-muted mt-1">
                                            ₹{item.price.toLocaleString("en-IN")} x {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-text text-sm">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                <aside className="lg:w-80 flex-shrink-0">
                    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4 sticky top-20">

                        <h2 className="font-semibold text-text">Order Summary</h2>

                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Subtotal</span>
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

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                aria-pressed={selectedPaymentMethod === "cod"}
                                onClick={() => {
                                    setSelectedPaymentMethod("cod")
                                    setError("")
                                }}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    selectedPaymentMethod === "cod"
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:bg-surface/50"
                                }`}>
                                <p className="font-medium text-text">Cash on Delivery (COD)</p>
                                <p className="text-sm text-muted">Pay when you receive the order</p>
                            </button>

                            <button
                                type="button"
                                aria-pressed={selectedPaymentMethod === "razorpay"}
                                onClick={() => {
                                    setSelectedPaymentMethod("razorpay")
                                    setError("Razorpay is temporarily unavailable. Please select Cash on Delivery (COD).")
                                }}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    selectedPaymentMethod === "razorpay"
                                        ? "border-warning bg-warning/10"
                                        : "border-border hover:bg-surface/50"
                                }`}>
                                <p className="font-medium text-text">Razorpay</p>
                                <p className="text-sm text-muted">Online payment temporarily unavailable</p>
                            </button>
                        </div>


                        {error && (
                            <p role="alert" className="text-sm text-error">{error}</p>
                        )}

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacing || !selectedAddressId}
                            className="flex items-center justify-center gap-2 bg-primary
                hover:bg-primary-dark text-white font-semibold py-3 rounded-lg
                transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                            {isPlacing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </button>

                    </div>
                </aside>
            </div>
        </main >
    )
}