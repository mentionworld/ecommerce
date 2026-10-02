'use client'

import { Star, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


export default function ActiveFilters() {


    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const NO_FILTERS = ['page', 'sort', 'search']

    const rowFilter = Array.from(searchParams.entries()).filter(([key]) => !NO_FILTERS.includes(key))

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const chips: { label: string, keys: string[], showStar?: boolean }[] = []

    for (const [key, value] of rowFilter) {
        if (key == 'minPrice' || key == 'maxPrice') continue
        if (key == 'rating') {
            chips.push({
                label: `${value} & above`,
                keys: ['rating'],
                showStar: true
            })
        } else {
            chips.push({
                label: value,
                keys: [key]
            })
        }

    }

    if (minPrice || maxPrice) {
        let priceLabel = '';

        if (minPrice && maxPrice) {
            priceLabel = `₹${Number(minPrice).toLocaleString("en-IN")} — ₹${Number(maxPrice).toLocaleString("en-IN")} `
        } else if (maxPrice) {
            priceLabel = `Under ₹${Number(maxPrice).toLocaleString("en-IN")}`
        } else {
            priceLabel = `Above ₹${Number(minPrice).toLocaleString("en-IN")}`
        }

        chips.push({
            label: priceLabel,
            keys: ['minPrice', 'maxPrice']
        })
    }


    function handleRemove(keys: string[]) {

        const params = new URLSearchParams(searchParams.toString())

        keys.forEach(k => params.delete(k))
        params.delete('page')

        router.push(`${pathname}?${params.toString()}`)
    }


    if (chips.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
                <button
                    key={chip.keys.join("-")}
                    onClick={() => handleRemove(chip.keys)}
                    className="flex items-center cursor-pointer gap-1.5 bg-primary/10 text-primary text-xs font-medium capitalize px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                    {chip.showStar && (
                        <Star size={12} className="fill-primary text-primary" />
                    )}
                    {chip.label}
                    <X size={13} />
                </button>
            ))}
        </div>
    )
}