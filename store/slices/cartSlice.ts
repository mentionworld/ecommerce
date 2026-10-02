import { TCartItemPopulated } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


type TCartState = {
    items: TCartItemPopulated[],
    totalCount: number,
    totalPrice: number,
    isLoading: boolean
}

const initialState: TCartState = {
    items: [],
    totalCount: 0,
    totalPrice: 0,
    isLoading: false
}

function recalculate(items: TCartItemPopulated[]) {
    return {
        totalCount: items.reduce((acc, item) => acc + item.quantity, 0),
        totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        setCart: (state, action: PayloadAction<TCartItemPopulated[]>) => {
            state.items = action.payload
            const total = recalculate(state.items)
            state.totalCount = total.totalCount
            state.totalPrice = total.totalPrice
        },

        setCartLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        clearCart: (state) => {
            state.items = []
            state.totalCount = 0
            state.totalPrice = 0
            state.isLoading = false
        }


    }
})

export const { setCart, setCartLoading, clearCart } = cartSlice.actions
export default cartSlice.reducer