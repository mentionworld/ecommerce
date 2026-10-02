
'use client'

import { TFilters } from "@/types"
import { ChevronDown, Star, Trash } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


type TProps = {
    filters: TFilters
}

export default function FilterSidebar({ filters }: TProps) {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    const clearAll = () => {
        router.push(pathname)
    }

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
    }

    const updatePriceFilter = (key: "minPrice" | "maxPrice", value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const isChecked = params.get(key) === value

        params.delete("minPrice")
        params.delete("maxPrice")

        if (!isChecked) {
            params.set(key, value)
        }

        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }


    const activeFilters = Array.from(searchParams.keys()).filter(x => x !== 'sort' && x !== 'page').length

    const isActive = (key: string, value: string) => {
        return searchParams.get(key) === value
    }

    const accordionClassName = "group"
    const summaryClassName = "flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text [&::-webkit-details-marker]:hidden"
    const contentClassName = "mt-3 flex flex-col gap-1.5"
    const optionClassName = "flex cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-text has-[:checked]:font-semibold has-[:checked]:text-primary"
    const checkboxClassName = "h-4 w-4 cursor-pointer rounded border-border accent-primary"

    return (
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                {activeFilters > 0 && <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-error hover:underline">
                    <Trash size={16} /> Clear
                </button>}
            </div>

            <details className={accordionClassName}>
                <summary className={summaryClassName}>
                    Category
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className={contentClassName}>
                    {
                        filters.categories.map(category => (
                            <label key={category} className={optionClassName}>
                                <input
                                    type="checkbox"
                                    checked={isActive("category", category)}
                                    onChange={() => updateFilter('category', isActive('category', category) ? '' : category)}
                                    className={checkboxClassName}
                                />
                                <span className="capitalize">{category}</span>
                            </label>
                        ))
                    }
                </div>
            </details>

            <details className={accordionClassName}>
                <summary className={summaryClassName}>
                    Brand
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className={contentClassName}>
                    {filters.brands.map((brand) => (
                        <label key={brand} className={optionClassName}>
                            <input
                                type="checkbox"
                                checked={isActive("brand", brand)}
                                onChange={() => updateFilter("brand", isActive("brand", brand) ? "" : brand)}
                                className={checkboxClassName}
                            />
                            <span className="capitalize">{brand}</span>
                        </label>
                    ))}
                </div>
            </details>

            <details className={accordionClassName}>
                <summary className={summaryClassName}>
                    Rating
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className={contentClassName}>
                    {filters.ratings.map((rating) => (
                        <label key={rating} className={optionClassName}>
                            <input
                                type="checkbox"
                                checked={isActive("rating", String(rating))}
                                onChange={() => updateFilter("rating", isActive("rating", String(rating)) ? "" : String(rating))}
                                className={checkboxClassName}
                            />
                            <span className="flex items-center gap-1">
                                <Star size={14} className="fill-warning text-warning" />
                                {rating} & above
                            </span>
                        </label>
                    ))}
                </div>
            </details>

            <details className={accordionClassName}>
                <summary className={summaryClassName}>
                    Price Range
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 flex flex-col gap-2">
                    <p className="text-xs text-muted">
                        ₹{filters.priceRange.min.toLocaleString("en-IN")} — ₹
                        {filters.priceRange.max.toLocaleString("en-IN")}
                    </p>
                    <div className={contentClassName}>
                        <label className={optionClassName}>
                            <input
                                type="checkbox"
                                checked={isActive("maxPrice", "5000")}
                                onChange={() => updatePriceFilter("maxPrice", "5000")}
                                className={checkboxClassName}
                            />
                            Under ₹5,000
                        </label>
                        <label className={optionClassName}>
                            <input
                                type="checkbox"
                                checked={isActive("maxPrice", "20000")}
                                onChange={() => updatePriceFilter("maxPrice", "20000")}
                                className={checkboxClassName}
                            />
                            Under ₹20,000
                        </label>
                        <label className={optionClassName}>
                            <input
                                type="checkbox"
                                checked={isActive("minPrice", "50000")}
                                onChange={() => updatePriceFilter("minPrice", "50000")}
                                className={checkboxClassName}
                            />
                            Above ₹50,000
                        </label>
                    </div>
                </div>
            </details>

        </div>
    )
}