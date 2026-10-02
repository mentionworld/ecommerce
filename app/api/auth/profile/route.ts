import { AuthError, getAuthUser } from "@/lib/getAuthUser";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser(request)

        return NextResponse.json({ user }, { status: 200 })

    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }
        throw error
    }
}