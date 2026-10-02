'use client'
import { TProduct } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "./ProductCard"
import { useRef } from "react"


type TProps = {
    title: string,
    products: TProduct[]
}

export default function ProductCarousel({ title, products }: TProps) {

    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return

        const scrollAmount = scrollRef.current.clientWidth * 0.8

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
    }


    if (!products.length) return null

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-text">{title}</h2>

                <div className="flex items-center gap-2">
                    <button onClick={() => scroll('left')} className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-text hover:bg-bg transition-colors" aria-label="Scroll left">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scroll('right')} className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-text hover:bg-bg transition-colors" aria-label="Scroll right">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {products.map((product) => (
                    <div key={product._id} className="flex-shrink-0 w-64">
                        <ProductCard product={product} />
                    </div>
                ))}

            </div>
        </div>
    )
}