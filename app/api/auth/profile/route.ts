import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser(request)

        return NextResponse.json({ user }, { status: 200 })

    } catch (error) {
        if (error instanceof AuthError) {
            if (error.status === 401) {
                const response = NextResponse.json({ user: null });
                response.cookies.set(process.env.JWT_COOKIE_NAME!, "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 0,
                    path: "/",
                });
                return response;
            }

            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }
        throw error
    }
}