'use client'
import { addToCart } from "@/lib/cartApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { selectAuthLoading, selectIsAuthenticated } from "@/store/selectors"
import { setCart } from "@/store/slices/cartSlice"
import { TProduct } from "@/types"
import { Check, Loader2, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"


type TProps = {
    product: TProduct,
    quantity?: number
}

export default function AddToCartButton({ product, quantity = 1 }: TProps) {

    const router = useRouter()
    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const isAuthLoading = useAppSelector(selectAuthLoading)

    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [justAdded, setJustAdded] = useState<boolean>(false)
    const [error, setError] = useState<string | null>("")


    const outOfStock = product.stock === 0;


    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login?callbackUrl=/products/' + product.slug)
        }

        setIsAdding(true)
        setError(null)

        try {

            const items = await addToCart(product._id, quantity)
            dispatch(setCart(items))
            setJustAdded(true)

            setTimeout(() => {
                setJustAdded(false)
            }, 2000)



        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add to cart")
            console.log(err)
        } finally {
            setIsAdding(false)
        }
    }


    return (
        <div className="flex flex-col gap-2">
            <button onClick={handleAddToCart} disabled={outOfStock || isAdding || isAuthLoading} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                {
                    outOfStock ?
                        "Out of Stock"
                        : isAdding ? <><Loader2 size={18} /> Adding...</>
                            : justAdded ? <><Check size={18} /> Added</>
                                : <><ShoppingCart size={18} /> Add to cart</>
                }
            </button>

            {error && <p className="text-sm text-error">{error}</p>}
        </div>
    )
}