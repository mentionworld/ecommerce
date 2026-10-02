import { NextResponse } from "next/server";


export async function POST() {

    const response = NextResponse.json({
        message: 'Logout Success'
    }, { status: 200 })

    response.cookies.set(process.env.JWT_COOKIE_NAME!, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    })

    return response
}
