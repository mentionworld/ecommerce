import { generateToken, hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { TJwtPayload } from "@/types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {

        const body = await request.json()
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Name, Email and Password are required" }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
        }

        if (!password || password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
        }

        await connectDB()

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        const payload: TJwtPayload = {
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role,
            permissions: newUser.permissions
        }

        const token = generateToken(payload)

        const response = NextResponse.json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                permissions: newUser.permissions,
                avatar: newUser.avatar,
            }
        }, { status: 201 })

        response.cookies.set(process.env.JWT_COOKIE_NAME!, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
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
