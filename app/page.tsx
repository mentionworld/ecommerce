import ProductCarousel from "@/components/store/ProductCarousel";
import HeroCarousel from "@/components/store/HeroCarousel";
import { getShowcaseProducts } from "@/lib/getShowCase";
import { Suspense } from "react";

async function ShowcaseSections() {
  const { featured, newArrivals, topRated, deals } = await getShowcaseProducts()

  return (
    <section className="featured-section">
      <div>
        <ProductCarousel title="Featured Products" products={featured} />
      </div>
      <div>
        <ProductCarousel title="New Arrivals" products={newArrivals} />
      </div>
      <div>
        <ProductCarousel title="Top Rated Products" products={topRated} />
      </div>
      <div>
        <ProductCarousel title="Daily Deals" products={deals} />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <Suspense fallback={null}>
        <ShowcaseSections />
      </Suspense>
    </main>
  )
}