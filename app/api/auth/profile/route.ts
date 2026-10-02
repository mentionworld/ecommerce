import { getAuthUser } from "@/lib/getAuthUser";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {

        const user = await getAuthUser(request)

        return NextResponse.json({ user }, { status: 200 })

    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 })

    }
}