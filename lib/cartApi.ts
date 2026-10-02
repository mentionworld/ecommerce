import { TCartItemPopulated } from "@/types";


export async function fetchCart(): Promise<TCartItemPopulated[]> {
    const res = await fetch('/api/cart')

    if (!res.ok) {
        throw new Error('Failed to fetch cart')
    }

    const data = await res.json()

    return data.items
}

export async function addToCart(productId: string, quantity: number = 1): Promise<TCartItemPopulated[]> {
    const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to add to cart.')
    }

    const data = await res.json()

    return data.items

}

export async function updateCartItem(productId: string, quantity: number): Promise<TCartItemPopulated[]> {
    const res = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update cart item.')
    }

    const data = await res.json()
    return data.items   
}

export async function removeCartItem(productId: string): Promise<TCartItemPopulated[]> {
    const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to remove cart item.')
    }

    const data = await res.json()
    return data.items   
}
    