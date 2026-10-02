import { connectDB } from "@/lib/db";
import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";


type RouteContext = {
    params: Promise<{ addressId: string }>
}


export async function PATCH(request: NextRequest, { params }: RouteContext) {
    try {

        const { addressId } = await params

        const user = await getAuthUser(request)
        await connectDB()

        const body = await request.json()
        const { label, street, city, state, pincode, isDefault } = body

        const dbUser = await User.findById(user._id)

        if (!dbUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        const address = dbUser.addresses.id(addressId)

        if (!address) {
            return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 })
        }

        // If this address is being set as default, unset all other defaults first
        if (isDefault) {
            dbUser.addresses.forEach((addr: { isDefault: boolean }) => {
                addr.isDefault = false
            })
        }

        // Patch only the fields that were provided
        if (label !== undefined) address.label = label
        if (street !== undefined) address.street = street
        if (city !== undefined) address.city = city
        if (state !== undefined) address.state = state
        if (pincode !== undefined) address.pincode = pincode
        if (isDefault !== undefined) address.isDefault = isDefault

        await dbUser.save()

        return NextResponse.json(
            { success: true, message: "Address updated successfully", address },
            { status: 200 }
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


export async function DELETE(request: NextRequest, { params }: RouteContext) {
    try {

        const { addressId } = await params

        const user = await getAuthUser(request)
        await connectDB()

        const dbUser = await User.findById(user._id)

        if (!dbUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        const address = dbUser.addresses.id(addressId)

        if (!address) {
            return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 })
        }

        address.deleteOne()
        await dbUser.save()

        return NextResponse.json(
            { success: true, message: "Address deleted successfully" },
            { status: 200 }
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