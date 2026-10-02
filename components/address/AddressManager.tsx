'use client'

import { addAddressApi, fetchAddresses, updateAddressApi, deleteAddressApi } from "@/lib/addressApi"
import { TAddress } from "@/types"
import { TAddressFormValues } from "@/lib/validations"
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import AddressForm from "./AddressForm"

type TProps = {
    selectedId?: string
    onSelect?: (addressId: string) => void
    selectable?: boolean
}

export default function AddressManager({ selectedId, onSelect, selectable = false }: TProps) {

    const [addresses, setAddresses] = useState<TAddress[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)



    useEffect(() => {
        fetchAddresses()
            .then(setAddresses)
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))
    }, [])

    async function handleSetDefault(addressId: string) {
        const updated = await updateAddressApi(addressId, { isDefault: true })
        setAddresses(updated)
    }

    async function handleDelete(addressId: string) {
        const updated = await deleteAddressApi(addressId)
        setAddresses(updated)
    }

    const handleAdd = async (data: TAddressFormValues) => {
        setIsSubmitting(true)
        try {
            const updated = await addAddressApi(data)
            setAddresses(updated)
            setShowForm(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-muted" />
            </div>
        )
    }


    return (
        <div className="flex flex-col gap-4">
            {addresses?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((address) => {
                        const isSelected = selectable && selectedId === address._id
                        return (
                            <div
                                key={address._id}
                                onClick={() => selectable && onSelect?.(address._id)}
                                className={`border rounded-xl p-4 transition-all
                  ${selectable ? "cursor-pointer" : ""}
                  ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted"}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-primary" />
                                        <span className="font-semibold text-text text-sm">
                                            {address.label}
                                        </span>
                                        {address.isDefault && (
                                            <span className="text-[10px] bg-success/10 text-success
                        font-semibold px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(address._id)
                                        }}
                                        className="text-muted hover:text-error transition-colors"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                <p className="text-sm text-muted mt-2 leading-relaxed">
                                    {address.street}, {address.city}, {address.state} - {address.pincode}
                                </p>

                                {!address.isDefault && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleSetDefault(address._id)
                                        }}
                                        className="text-xs text-primary hover:underline mt-2">
                                        Set as default
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
            {
                showForm ? <AddressForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} isSubmitting={isSubmitting} /> :
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center justify-center gap-2 border-2 border-dashed
            border-border text-muted hover:text-primary hover:border-primary
            rounded-xl py-4 transition-colors">
                        <Plus size={18} />
                        Add New Address
                    </button>
            }
        </div>
    )
}