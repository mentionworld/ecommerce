import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        { message: "Online payments are temporarily unavailable" },
        { status: 410 }
    )
}