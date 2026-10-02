import { RootState } from "./index";




export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticaed
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectUserRole = (state: RootState) => state.auth.user?.role


export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) => state.cart.totalCount
export const selectCartTotal = (state: RootState) => state.cart.totalPrice
export const selectCartLoading = (state: RootState) => state.cart.isLoading