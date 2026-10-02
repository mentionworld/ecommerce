'use client'
import { fetchCart } from "@/lib/cartApi";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectAuthLoading, selectIsAuthenticated } from "@/store/selectors";
import { setCart } from "@/store/slices/cartSlice";
import { useEffect } from "react";




export default function CartInitializer() {

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectAuthLoading)

    useEffect(() => {

        if (isLoading) return
        if (isAuthenticated) {
            fetchCart()
                .then((items) => dispatch(setCart(items)))
                .catch((err) => console.log(err))
        }

    }, [isAuthenticated, dispatch, isLoading])
    return null;
}