import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Cart from "@/models/Cart.model";
import Product from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose"



export async function GET(request: NextRequest) {
    try {

        const user = await getAuthUser(request)

        await connectDB()


        const cart = await Cart.findOne({ user: user._id }).populate('items.product').lean()

        if (!cart) {
            return NextResponse.json({ message: "No cart found", items: [] }, { status: 200 })
        }

        return NextResponse.json({ items: cart.items }, { status: 200 })


    } catch (err) {
        console.error("Get cart error:", err)

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })

    }
}


export async function POST(request: NextRequest) {
    try {

        const user = await getAuthUser(request)

        const body = await request.json()

        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
        }

        await connectDB()

        const product = await Product.findOne({ _id: productId, isActive: true })

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        if (quantity > product.stock) {
            return NextResponse.json({ message: "Not enough stock" }, { status: 400 })
        }

        let cart = await Cart.findOne({ user: user._id })

        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] })
        }

        const existingItem = cart.items.find((item: { product: Types.ObjectId }) => item.product.toString() === productId)

        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)
        } else {
            cart.items.push({ product: productId, quantity, price: product.price })
        }

        await cart.save()


        const updatedCart = await Cart.findOne({ user: user._id }).populate('items.product').lean()

        return NextResponse.json({ items: updatedCart.items }, { status: 200 })

    } catch (err) {
        console.error("Add to cart error:", err)

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })

    }
}