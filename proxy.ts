import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"


const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/register",
    "/verify",
    "/products",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/products"
]

const PRIVATE_ROUTES = [
    "/cart",
    "/wishlist",
    "/profile",
    "/orders",
    "/checkout",
    "/api/cart",
    "/api/wishlist",
    "/api/profile",
    "/api/order",
    "/api/checkout"
]

const ADMIN_ROUTES = [
    '/admin',
    '/api/admin'
]

function matchRoutes(pathName: string, routes: string[]) {
    return routes.some((route) =>
        pathName === route || (route !== "/" && pathName.startsWith(`${route}/`))
    )
}

function getTokanFromRequest(request: NextRequest): string | null {
    return request.cookies.get(process.env.JWT_COOKIE_NAME!)?.value || null
}

export async function proxy(request: NextRequest) {


    const { pathname } = request.nextUrl

    const token = getTokanFromRequest(request)
    const decode = token ? verifyToken(token) : null

    if (matchRoutes(pathname, PUBLIC_ROUTES)) {
        return NextResponse.next()
    }

    if (matchRoutes(pathname, PRIVATE_ROUTES)) {
        if (!decode) {

            if (pathname.startsWith('/api/')) {
                return NextResponse.json({
                    message: 'Not Authorized, please login'
                }, { status: 401 })
            }

            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', request.url)
            return NextResponse.redirect(loginUrl)

        }

        return NextResponse.next()
    }

    if (matchRoutes(pathname, ADMIN_ROUTES)) {
        if (!decode) {

            if (pathname.startsWith('/api/')) {
                return NextResponse.json({
                    message: 'Not Authorized, please login'
                }, { status: 401 })
            }

            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', request.url)
            return NextResponse.redirect(loginUrl)
        }

        if (decode.role !== 'admin' && decode.role !== 'superadmin') {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({
                    message: 'Access Denied'
                }, { status: 403 })
            }

            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    return NextResponse.next()

}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"
    ]
}