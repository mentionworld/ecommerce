import ActiveFilters from "@/components/store/ActiveFilters"
import FilterSidebar from "@/components/store/FilterSidebar"
import Pagination from "@/components/store/Pagination"
import ProductCard from "@/components/store/ProductCard"
import SortDropdown from "@/components/store/SortDropdown"
import { getProducts } from "@/lib/getProducts"
import { TProductsResponse } from "@/types"


type TProps = {
    searchParams: Promise<Record<string, string | undefined>>
}


export default async function ProductsPage({
    searchParams
}: TProps) {

    const params = await searchParams

    let data: TProductsResponse
    try {
        data = await getProducts(params)
    } catch (error) {
        console.error("Failed to load products page:", error)
        return (
            <main className="max-w-6xl w-full mx-auto px-6 py-10" role="alert">
                <h1 className="text-2xl font-bold text-text">Products are temporarily unavailable</h1>
                <p className="text-muted mt-2">Please try again in a little while.</p>
            </main>
        )
    }

    const { products, pagination, filters } = data

    return (
        <div className="max-w-6xl w-full mx-auto px-6 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <FilterSidebar filters={filters} />
                </aside>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <div className="mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-text">All Products</h1>
                            </div>
                            <p className="text-muted text-sm mt-1 mb-4">
                                {pagination.totalCount} products available
                            </p>
                        </div>
                        <div>
                            <SortDropdown />
                        </div>
                    </div>
                    <div className="mb-4">
                        <ActiveFilters />
                    </div>
                    {
                        products.length == 0 ?
                            <div>
                                <p className="text-xl font-bold">No products found</p>
                            </div>
                            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          xl:grid-cols-4 gap-6">
                                {products.map(product => <ProductCard key={product._id} product={product} />)}
                                <div className="col-span-full">
                                    <Pagination pagination={pagination} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}