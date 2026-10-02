import { TAuthUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuthState = {
    user: TAuthUser | null,
    isLoading: boolean,
    isAuthenticaed: boolean
}

const initialState: TAuthState = {
    user: null,
    isLoading: false,
    isAuthenticaed: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setUser: (state, action: PayloadAction<TAuthUser>) => {
            state.user = action.payload;
            state.isAuthenticaed = true;
            state.isLoading = false
        },

        clearUser: (state) => {
            state.user = null;
            state.isAuthenticaed = false;
            state.isLoading = false
        },

        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }

    }
})


export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;