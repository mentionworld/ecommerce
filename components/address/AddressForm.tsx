// components/address/AddressForm.tsx

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema, TAddressFormValues, TAddressInput } from "@/lib/validations"

type TProps = {
    onSubmit: (data: TAddressFormValues) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
}

export default function AddressForm({ onSubmit, onCancel, isSubmitting }: TProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAddressInput, unknown, TAddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: { label: "Home" },
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-semibold text-text">Add New Address</h3>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text">Label</label>
                <input
                    type="text"
                    placeholder="Home, Office, etc."
                    {...register("label")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none
            transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${errors.label ? "border-error" : "border-border"}`} />
                {errors.label && <span className="text-xs text-error">{errors.label.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text">Street Address</label>
                <input
                    type="text"
                    placeholder="House no, building, street"
                    {...register("street")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none
            transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${errors.street ? "border-error" : "border-border"}`}
                />
                {errors.street && <span className="text-xs text-error">{errors.street.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text">City</label>
                    <input
                        type="text"
                        placeholder="City"
                        {...register("city")}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none
              transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary
              ${errors.city ? "border-error" : "border-border"}`} />
                    {errors.city && <span className="text-xs text-error">{errors.city.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text">State</label>
                    <input
                        type="text"
                        placeholder="State"
                        {...register("state")}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none
              transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary
              ${errors.state ? "border-error" : "border-border"}`} />
                    {errors.state && <span className="text-xs text-error">{errors.state.message}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text">Pincode</label>
                <input
                    type="text"
                    placeholder="6 digit pincode"
                    {...register("pincode")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none
            transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${errors.pincode ? "border-error" : "border-border"}`}
                />
                {errors.pincode && <span className="text-xs text-error">{errors.pincode.message}</span>}
            </div>

            <div className="flex gap-3 mt-1">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold
            px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
                    {isSubmitting ? "Saving..." : "Save Address"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-border text-text font-medium px-5 py-2.5
            rounded-lg hover:bg-bg transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    )
}