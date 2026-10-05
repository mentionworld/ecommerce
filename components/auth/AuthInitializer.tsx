'use client'
import { useAppDispatch } from "@/store/hook"
import { clearUser, setAuthLoading, setUser } from "@/store/slices/authSlice"
import { TAuthUser } from "@/types"
import { useEffect } from "react"


export default function AuthInitializer() {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setAuthLoading(true))

        async function loadUser() {
            try {
                const res = await fetch('/api/auth/profile')

                if (!res.ok) {
                    throw new Error(`Failed to load user profile (${res.status})`)
                }

                const data: { user: TAuthUser | null } = await res.json()
                if (data.user) {
                    dispatch(setUser(data.user))
                } else {
                    dispatch(clearUser())
                }
            } catch (error) {
                dispatch(clearUser())
                console.error("Failed to load user profile", error)
            } finally {
                dispatch(setAuthLoading(false))
            }
        }

        loadUser()

    }, [dispatch])


    return null
}