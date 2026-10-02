"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Loader2, ChevronRight } from "lucide-react"
import { TOrder } from "@/types"
import { getOrderStatusStyle, getPaymentStatusStyle } from "@/lib/orderStatus"

export default function OrdersPage() {

    const [orders, setOrders] = useState<TOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/order")
            .then((res) => res.json())
            .then((data) => setOrders(data.orders || []))
            .catch(() => { })
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <main className="max-w-4xl mx-auto px-6 py-20 flex justify-center">
                <Loader2 className="animate-spin text-muted" size={32} />
            </main>
        )
    }

    if (orders.length === 0) {
        return (
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="flex flex-col items-center text-center gap-4">
                    <Package size={64} className="text-muted" />
                    <h1 className="text-2xl font-bold text-text">No orders yet</h1>
                    <p className="text-muted">When you place an order, it will appear here.</p>
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
        <main className="max-w-4xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold text-text mb-8">My Orders</h1>

            <div className="flex flex-col gap-4">
                {orders.map((order) => {
                    const statusStyle = getOrderStatusStyle(order.orderStatus)

                    return (
                        <Link
                            key={order._id}
                            href={`/orders/${order._id}`}
                            className="bg-surface border border-border rounded-xl p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-muted">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${statusStyle.className}`}>
                                    {statusStyle.label}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <div
                                            key={i}
                                            className="relative w-12 h-12 bg-bg rounded-md overflow-hidden"
                                        >
                                            <Image
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <span className="text-xs text-muted">
                                            +{order.items.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-text">
                                        ₹{order.total.toLocaleString("en-IN")}
                                    </span>
                                    <ChevronRight size={18} className="text-muted" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

        </main>
    )
}