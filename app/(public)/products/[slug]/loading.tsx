
export default function ProductLoading() {
    return (
        <main className="max-w-6xl w-full mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="aspect-square bg-border rounded-2xl animate-pulse" />
                <div className="flex flex-col gap-5">
                    <div className="h-4 w-20 bg-border rounded animate-pulse" />
                    <div className="h-9 w-3/4 bg-border rounded animate-pulse" />
                    <div className="h-6 w-32 bg-border rounded animate-pulse" />
                    <div className="h-9 w-40 bg-border rounded animate-pulse" />
                    <div className="h-4 w-full bg-border rounded animate-pulse" />
                    <div className="h-4 w-full bg-border rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-border rounded animate-pulse" />
                    <div className="h-12 w-full sm:w-48 bg-border rounded-lg animate-pulse mt-2" />
                </div>
            </div>
        </main>
    )
}
