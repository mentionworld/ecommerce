import { TAddress } from "@/types"

export async function fetchAddresses(): Promise<TAddress[]> {
    const res = await fetch("/api/addresses")
    if (!res.ok) throw new Error("Failed to fetch addresses")
    const data = await res.json()
    return data.addresses
}

export async function addAddressApi(address: Omit<TAddress, "_id" | "isDefault"> & Partial<Pick<TAddress, "isDefault">>): Promise<TAddress[]> {
    const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to add address")
    }
    const data = await res.json()
    return data.addresses
}

export async function updateAddressApi(addressId: string, updates: Partial<TAddress>): Promise<TAddress[]> {
    const res = await fetch(`/api/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update address")
    const data = await res.json()
    return data.addresses
}

export async function deleteAddressApi(addressId: string): Promise<TAddress[]> {
    const res = await fetch(`/api/addresses/${addressId}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete address")
    const data = await res.json()
    return data.addresses
}