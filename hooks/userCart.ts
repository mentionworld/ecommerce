'use client'

import { removeCartItem, updateCartItem } from "@/lib/cartApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { selectCartCount, selectCartItems, selectCartLoading, selectCartTotal } from "@/store/selectors"
import { setCart } from "@/store/slices/cartSlice"
import { useState } from "react"


export function useCart() {
    const dispatch = useAppDispatch()

    const items = useAppSelector(selectCartItems)
    const totalCount = useAppSelector(selectCartCount)
    const totalPrice = useAppSelector(selectCartTotal)
    const loading = useAppSelector(selectCartLoading)

    const [updatingId, setUpdatingId] = useState<string | null>(null)


    async function increment(productId: string, currentQuantity: number) {
        setUpdatingId(productId)
        try {

            const updatedItems = await updateCartItem(productId, currentQuantity + 1)
            dispatch(setCart(updatedItems))

        } catch (err) {
            console.log(err)
        } finally {
            setUpdatingId(null)
        }
    }

    async function decrement(productId: string, currentQuantity: number) {
        if (currentQuantity <= 1) {
            remove(productId)
            return
        }
        setUpdatingId(productId)

        try {
            const updated = await updateCartItem(productId, currentQuantity - 1)
            dispatch(setCart(updated))
        } catch (err) {
            console.log(err)
        } finally {
            setUpdatingId(null)
        }
    }

    async function remove(productId: string) {
        setUpdatingId(productId)
        try {

            const updated = await removeCartItem(productId)
            dispatch(setCart(updated))

        } catch (err) {
            console.log(err)
        } finally {
            setUpdatingId(null)
        }
    }

    return {
        items,
        totalCount,
        totalPrice,
        updatingId,
        isEmpty: items.length === 0,
        increment,
        decrement,
        remove
    }

}