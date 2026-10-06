"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, MapPin, CheckCircle2 } from "lucide-react"
import { TOrder } from "@/types"
import { getOrderStatusStyle, getPaymentStatusStyle } from "@/lib/orderStatus"

type TProps = {
    params: Promise<{ orderId: string }>
}

export default function OrderDetailPage({ params }: TProps) {

    const { orderId } = use(params)

    const [order, setOrder] = useState<TOrder | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        fetch(`/api/order/${orderId}`)
            .then((res) => {
                if (!res.ok) {
                    setNotFound(true)
                    return null
                }
                return res.json()
            })
            .then((data) => {
                if (data) setOrder(data.order)
            })
            .catch(() => setNotFound(true))
            .finally(() => setIsLoading(false))
    }, [orderId])

    if (isLoading) {
        return (
            <main className="max-w-3xl mx-auto px-6 py-20 flex justify-center">
                <Loader2 className="animate-spin text-muted" size={32} />
            </main>
        )
    }

    if (notFound || !order) {
        return (
            <main className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h1 className="text-2xl font-bold text-text mb-2">Order not found</h1>
                <Link href="/orders" className="text-primary hover:underline">
                    Back to my orders
                </Link>
            </main>
        )
    }

    const statusStyle = getOrderStatusStyle(order.orderStatus)
    const paymentStyle = getPaymentStatusStyle(order.paymentStatus)

    return (
        <main className="max-w-3xl w-full mx-auto px-6 py-10">

            {order.paymentStatus === "paid" && (
                <div className="flex items-center gap-3 bg-success/10 text-success
          rounded-xl p-4 mb-6">
                    <CheckCircle2 size={24} />
                    <div>
                        <p className="font-semibold">Order confirmed!</p>
                        <p className="text-sm">Thank you for your purchase.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
            ${statusStyle.className}`}>
                        {statusStyle.label}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
            ${paymentStyle.className}`}>
                        {paymentStyle.label}
                    </span>
                </div>
            </div>

            <section className="bg-surface border border-border rounded-xl p-5 mb-5">
                <h2 className="font-semibold text-text mb-4">Items</h2>
                <div className="flex flex-col gap-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0 bg-bg
                rounded-md overflow-hidden">
                                <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-text text-sm">{item.name}</p>
                                <p className="text-xs text-muted mt-1">
                                    ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                                </p>
                            </div>
                            <span className="font-semibold text-text text-sm">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5 mb-5">
                <h2 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    Delivery Address
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                    <span className="font-medium text-text">{order.shippingAddress.label}</span>
                    <br />
                    {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
                <h2 className="font-semibold text-text mb-3">Price Details</h2>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted">Subtotal</span>
                        <span className="text-text">₹{order.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Shipping</span>
                        <span className="text-success">
                            {order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}
                        </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-1 flex justify-between">
                        <span className="font-semibold text-text">Total</span>
                        <span className="font-bold text-text text-lg">
                            ₹{order.total.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </section>

        </main>
    )
}