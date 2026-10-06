'use client'

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectAuthLoading, selectIsAuthenticated, selectUser } from "@/store/selectors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from 'lucide-react'
import { clearUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import MiniCart from "../cart/MiniCart";
import { useState } from "react"

export default function Navbar() {


    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const isLoading = useAppSelector(selectAuthLoading)
    const isAdmin = user?.role == 'admin' || user?.role == 'superadmin';
    const [logoutError, setLogoutError] = useState<string | null>(null)


    const handleLogout = async () => {
        try {
            setLogoutError(null)

            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error("Logout failed")
            }
            dispatch(clearCart())
            dispatch(clearUser())
            router.replace('/')

        } catch (err) {

            console.error('Logout failed', err)
            setLogoutError("Unable to log out. Please try again.")

        }
    }

    return (
        <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                <Link
                    href="/"
                    className="text-2xl font-extrabold text-primary"
                >
                    ShopMart
                </Link>

                <nav className="flex items-center gap-8">
                    <Link
                        href="/products"
                        className="text-muted text-sm font-medium hover:text-primary transition-colors"
                    >
                        Products
                    </Link>

                    {!isLoading && (
                        <>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-6">

                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-1.5 text-muted text-sm
                        font-medium hover:text-primary transition-colors"
                                        >
                                            <LayoutDashboard size={16} />
                                            Admin
                                        </Link>
                                    )}

                                    <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text">
                                        <User size={16} />
                                        Hi, {user?.name.split(" ")[0]}
                                    </span>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 text-sm font-medium
                      text-muted hover:text-error transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>

                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/login"
                                        className="text-muted text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-primary text-white text-sm font-semibold
                      px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    <MiniCart />
                </nav>
            </div>
            {logoutError && (
                <p role="alert" className="text-center text-sm text-error pb-2">
                    {logoutError}
                </p>
            )}
        </header>
    )
}