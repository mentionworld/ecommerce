
export default function ProductLoading() {
    return (
        <main className="max-w-6xl w-full mx-auto px-6 py-10">

            <div className="mb-8">
                <div className="h-8 w-48 bg-border rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-border rounded mt-2 animate-pulse" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-surface border border-border rounded-xl p-5
            flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-4 w-20 bg-border rounded animate-pulse" />
                                <div className="h-3 w-full bg-border rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-border rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface border border-border rounded-xl overflow-hidden"
                            >
                                <div className="aspect-square bg-border animate-pulse" />
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="h-3 w-16 bg-border rounded animate-pulse" />
                                    <div className="h-4 w-full bg-border rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-border rounded animate-pulse" />
                                    <div className="h-5 w-24 bg-border rounded mt-2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </main>
    )
}