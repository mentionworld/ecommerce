'use client'
import { useAppDispatch } from "@/store/hook"
import { clearUser, setUser } from "@/store/slices/authSlice"
import { useEffect } from "react"


export default function AuthInitializer() {

    const dispatch = useAppDispatch()

    useEffect(() => {

        async function loadUser() {
            try {

                const res = await fetch('/api/auth/profile')

                if (res.ok) {
                    const data = await res.json()

                    dispatch(setUser(data.user))
                }

            } catch (err) {
                dispatch(clearUser())
                console.error(err)
            }
        }

        loadUser()

    }, [dispatch])


    return null
}