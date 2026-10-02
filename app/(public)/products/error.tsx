'use client'

import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"


export default function ProductError({ error, reset }: { error: Error, reset: () => void }) {


    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center gap-4">

            <AlertTriangle size={64} className="text-error" />

            <h1 className="text-2xl font-bold text-text">
                Something went wrong
            </h1>

            <p className="text-muted max-w-md">
                We could not load the products right now. Please try again.
            </p>

            <button
                onClick={reset}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-2">
                Try Again
            </button>
        </main>
    )
}