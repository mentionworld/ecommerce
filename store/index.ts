
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducre from './slices/authSlice'
import cartReducer from './slices/cartSlice'

const rootReducer = combineReducers({
    auth: authReducre,
    cart: cartReducer
})

export function makeStore() {
    return configureStore({
        reducer: rootReducer
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']