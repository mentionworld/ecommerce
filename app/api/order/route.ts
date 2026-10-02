import { connectDB } from "@/lib/db";
import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import Cart from "@/models/Cart.model";
import Order from "@/models/Order.model";
import Product from "@/models/Product.model";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request)

        const body = await request.json()
        const { addressId } = body

        if (body.paymentMethod === "razorpay") {
            return NextResponse.json(
                { message: "Razorpay is temporarily unavailable. Please select Cash on Delivery (COD)." },
                { status: 400 }
            )
        }

        if (!addressId) {
            return NextResponse.json(
                { message: "Delivery address is required" },
                { status: 400 }
            )
        }

        await connectDB()

        const dbUser = await User.findById(user._id)
        if (!dbUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const address = dbUser.addresses.id(addressId)
        if (!address) {
            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            )
        }

        const cart = await Cart.findOne({ user: user._id }).populate("items.product")

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: "Your cart is empty" },
                { status: 400 }
            )
        }

        const orderItems = []
        let subtotal = 0

        for (const cartItem of cart.items) {
            const product = cartItem.product

            if (!product || !product.isActive) {
                return NextResponse.json(
                    { message: `A product in your cart is no longer available` },
                    { status: 400 }
                )
            }

            if (product.stock < cartItem.quantity) {
                return NextResponse.json(
                    {
                        message: `Only ${product.stock} units of ${product.name} available`,
                    },
                    { status: 400 }
                )
            }

            const itemTotal = product.price * cartItem.quantity
            subtotal += itemTotal

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0] || "",
                price: product.price,
                quantity: cartItem.quantity,
            })
        }

        const shippingCost = 0
        const total = subtotal + shippingCost

        const order = await Order.create({
            user: user._id,
            items: orderItems,
            shippingAddress: {
                label: address.label,
                street: address.street,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },
            subtotal,
            shippingCost,
            total,
            paymentMethod: "cod",
            paymentStatus: "pending",
            orderStatus: "placed",
        })

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            })
        }

        cart.items = []
        await cart.save()

        return NextResponse.json(
            {
                message: "Order placed successfully",
                order: {
                    _id: order._id,
                    total: order.total,
                    paymentMethod: order.paymentMethod,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }
        console.error("Create order error:", error)
        const errMsg = error instanceof Error
            ? error.message
            : typeof error === "object"
                ? JSON.stringify(error)
                : String(error)
        return NextResponse.json(
            { message: errMsg },
            { status: 500 }
        )
    }
}


export async function GET(request: NextRequest) {
    try {

        const user = await getAuthUser(request)

        await connectDB()

        const orders = await Order.find({ user: user._id })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ orders }, { status: 200 })


    } catch (error) {

        if (error instanceof AuthError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }
        console.error("Get orders error:", error)
        return NextResponse.json(
            { message: "Failed to fetch orders." },
            { status: 500 }
        )
    }
}