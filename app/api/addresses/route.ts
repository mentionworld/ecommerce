import { connectDB } from "@/lib/db";
import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {

        const user = await getAuthUser(request)
        await connectDB()

        const dbUser = await User.findById(user?._id).select('addresses').lean()

        return NextResponse.json({ addresses: dbUser?.addresses }, { status: 200 })

    } catch (err) {

        if (err instanceof AuthError) {
            return NextResponse.json({ success: false, message: err.message }, { status: err.status })
        }
        if (err instanceof Error) {
            return NextResponse.json({ success: false, message: err.message }, { status: 500 })
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}


export async function POST(request: NextRequest) {
    try {

        const user = await getAuthUser(request)
        await connectDB()

        const body = await request.json()
        const { label, street, city, state, pincode, isDefault } = body

        // Basic validation
        if (!street || !city || !state || !pincode) {
            return NextResponse.json(
                { success: false, message: "street, city, state, and pincode are required" },
                { status: 400 }
            )
        }

        const dbUser = await User.findById(user._id)

        if (!dbUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        // If new address is marked as default, unset all existing defaults
        if (isDefault) {
            dbUser.addresses = dbUser.addresses.map((addr: { isDefault: boolean }) => ({
                ...addr,
                isDefault: false,
            }))
        }

        const newAddress = {
            label: label || "Home",
            street,
            city,
            state,
            pincode,
            isDefault: isDefault ?? false,
        }

        dbUser.addresses.push(newAddress)
        await dbUser.save()

        // Return the newly added address (last one in the array)
        const addedAddress = dbUser.addresses[dbUser.addresses.length - 1]

        return NextResponse.json(
            {
                success: true,
                message: "Address added successfully",
                address: addedAddress,
                addresses: dbUser.addresses,
            },
            { status: 201 }
        )

    } catch (err) {

        if (err instanceof AuthError) {
            return NextResponse.json({ success: false, message: err.message }, { status: err.status })
        }
        if (err instanceof Error) {
            return NextResponse.json({ success: false, message: err.message }, { status: 500 })
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}