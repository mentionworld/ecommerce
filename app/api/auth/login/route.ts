import { comparePassword, generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { TJwtPayload } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {

        const body = await request.json()

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
        }

        await connectDB()

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        const payload: TJwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            permissions: user.permissions
        }

        const token = generateToken(payload)

        const response = NextResponse.json({
            message: 'Login Success',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                avatar: user.avatar
            }
        })

        response.cookies.set(process.env.JWT_COOKIE_NAME!, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        })

        return response

    } catch (error: unknown) {
        console.log(error)
        return NextResponse.json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 })
    }
}
