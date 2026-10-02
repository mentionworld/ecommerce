
import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const addressSchema = z.object({
    label: z.string().min(1, "Label is required").default("Home"),
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
})

export type TRegisterInput = z.infer<typeof registerSchema>
export type TLoginInput = z.infer<typeof loginSchema>
export type TAddressInput = z.input<typeof addressSchema>
export type TAddressFormValues = z.output<typeof addressSchema>