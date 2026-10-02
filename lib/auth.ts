import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { TJwtPayload } from "@/types";




export function generateToken(payload: TJwtPayload) {

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    const token = Jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    return token
}

export function verifyToken(token: string): TJwtPayload | null {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    try {
        const decodedToken = Jwt.verify(token, process.env.JWT_SECRET) as TJwtPayload
        return decodedToken
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function comparePassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash)
    return isMatch
}


export function hasPermission(user: TJwtPayload, permission: string): boolean {

    if (user.role == 'superadmin') return true;

    return user.permissions.includes(permission as any)
}


export function isAdmin(user: TJwtPayload): boolean {
    return user.role == 'admin' || user.role == 'superadmin'
}
