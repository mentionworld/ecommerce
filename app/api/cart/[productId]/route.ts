import { connectDB } from "@/lib/db"
import { getAuthUser } from "@/lib/getAuthUser"
import Cart from "@/models/Cart.model"
import Product from "@/models/Product.model"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"


type TParams = {
    params: Promise<{ productId: string }>
}


export async function PATCH(request: NextRequest, { params }: TParams) {

    try {

        const user = await getAuthUser(request)

        const { productId } = await params

        const body = await request.json()

        const { quantity } = body

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return NextResponse.json({ message: "Invalid quantity" }, { status: 400 })
        }

        await connectDB()

        const product = await Product.findById(productId)

        if (!product || !product.isActive) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        if (product.stock < quantity) {
            return NextResponse.json({ message: "Not enough stock" }, { status: 400 })
        }

        const cart = await Cart.findOne({ user: user._id })

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 })
        }

        const item = cart.items.find((item: { product: Types.ObjectId }) => item.product.toString() === productId)

        if (!item) {
            return NextResponse.json({ message: "Item not found" }, { status: 404 })
        }

        item.quantity = quantity
        await cart.save()

        const updatedCart = await Cart.findOne({ user: user._id }).populate('items.product').lean()

        return NextResponse.json({ items: updatedCart.items }, { status: 200 })

    } catch (err) {

        console.log(err)

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })

    }

}


export async function DELETE(request: NextRequest, { params }: TParams) {
    try {

        const user = await getAuthUser(request)

        const { productId } = await params

        await connectDB()

        const cart = await Cart.findOne({ user: user._id })

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 })
        }

        cart.items = cart.items.filter((item: { product: Types.ObjectId }) => item.product.toString() !== productId)

        await cart.save()

        const updatedCart = await Cart.findOne({ user: user._id }).populate('items.product').lean()

        return NextResponse.json({ items: updatedCart.items }, { status: 200 })

    } catch (err) {

        console.log(err)

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })

    }
}