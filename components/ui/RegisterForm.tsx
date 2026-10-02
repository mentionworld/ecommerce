'use client'

import { registerSchema, TRegisterInput } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from "@/store/hook"
import { setUser } from "@/store/slices/authSlice"

export default function RegisterForm() {

    const router = useRouter()
    const dispatch = useAppDispatch()
    const [serverError, setServerError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<TRegisterInput>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: TRegisterInput) => {
        setIsLoading(true)
        setServerError(null)
        try {

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            })

            if (!res.ok) {
                const errorData = await res.json()
                setServerError(errorData.message || 'Something went wrong')
            } else {
                const result = await res.json()
                dispatch(setUser(result.user))
                router.replace('/')
            }

        } catch (err) {
            setServerError('Something went wrong')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {serverError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                        {serverError}
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
                    <input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                            placeholder:text-gray-400
                            ${errors.name
                                ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                        type="text" />
                    {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                        id="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                            placeholder:text-gray-400
                            ${errors.email
                                ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                        type="email" />
                    {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                    <input
                        id="password"
                        {...register("password")}
                        placeholder="At least 6 characters"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                            placeholder:text-gray-400
                            ${errors.password
                                ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                        type="password" />
                    {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        placeholder="Re-enter your password"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                            placeholder:text-gray-400
                            ${errors.confirmPassword
                                ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                        type="password" />
                    {errors.confirmPassword && <p className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white
                    font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg
                    disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                    {isLoading ? "Creating Account..." : "Create Account"}
                </button>
            </form>
        </div>
    )
}
