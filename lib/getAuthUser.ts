import { TPermission, Tuser } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { hasPermission, verifyToken } from "./auth";
import { connectDB } from "./db";
import User from "@/models/User.model";


export class AuthError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
        this.name = 'AuthError'
    }
}


export async function getAuthUser(request: NextRequest): Promise<Tuser> {


    const token = request.cookies.get(process.env.JWT_COOKIE_NAME!)?.value

    if (!token) {
        throw new AuthError('Unauthorized', 401)
    }

    const decode = verifyToken(token)

    if (!decode) {
        throw new AuthError('Session expired, please login again', 401)
    }

    await connectDB()


    const user = await User.findById(decode.userId)
    if (!user) {
        throw new AuthError('User not found', 404)
    }

    if (!user.isActive) {
        throw new AuthError('Your account has been deactivated, please contact admin', 403)
    }

    return user as Tuser
}

export async function requirePermission(request: NextRequest, permission: TPermission) {
    const user = await getAuthUser(request)

    if (!hasPermission({ ...user, userId: user._id }, permission)) {
        throw new AuthError('You do not have permission to perform this action', 403)
    }
    return user
}
