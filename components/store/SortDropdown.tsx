'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"


const SORT_OPTIONS = [
    { value: "createdAt", label: "Newest First" },
    { value: "price", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "popular", label: "Most Popular" },
]

export default function SortDropdown() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentSort = searchParams.get('sort') || 'createdAt'


    const handleSort = (value: string) => {

        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value)
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)


    }

    return (
        <select
            className="border border-border rounded-lg px-3 py-2 text-sm text-text bg-surface outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary"
            onChange={(e) => handleSort(e.target.value)}
            value={currentSort}>
            {SORT_OPTIONS.map(sort => <option key={sort.value} value={sort.value}>{sort.label}</option>)}
        </select>
    )

}