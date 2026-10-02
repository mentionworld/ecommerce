import { connectDB } from "@/lib/db";
import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import Order from "@/models/Order.model";
import { NextRequest, NextResponse } from "next/server";

type TParams = {
    params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: TParams) {
    try {
        const user = await getAuthUser(request)
        const { orderId } = await params

        await connectDB()

        const order = await Order.findOne({
            _id: orderId,
            user: user._id,
        }).lean()

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ order }, { status: 200 })

    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json({ message: error.message }, { status: error.status })
        }
        console.error("Order GET error:", error)
        return NextResponse.json({ message: "Failed to fetch order." }, { status: 500 })
    }
}