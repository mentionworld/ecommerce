
'use client'
import { TPagination } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


type TProps = {
    pagination: TPagination
}

export default function Pagination({ pagination }: TProps) {

    const { page, totalPages, hasNextPage, hasPrevPage } = pagination
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString())
        router.push(`${pathname}?${params.toString()}`)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (totalPages <= 1) return null
    const pageNumbers: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }



    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button disabled={!hasPrevPage} onClick={() => goToPage(page - 1)} className="flex items-center justify-center w-9 h-9 rounded-lg border border-border cursor-pointer text-text hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={18} />
            </button>


            {pageNumbers.map(pageNum => (
                <button key={pageNum} onClick={() => goToPage(pageNum)} className={`flex items-center justify-center w-9 h-9 rounded-lg border 
                    border-border cursor-pointer text-text hover:bg-bg transition-colors
                    ${pageNum === page ? 'bg-primary text-white' : ''}
                `}>
                    {pageNum}
                </button>
            ))}

            <button
                disabled={!hasNextPage}
                onClick={() => goToPage(page + 1)}
                className="flex items-center justify-center w-9 cursor-pointer h-9 rounded-lg border border-border text-text hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    )


}