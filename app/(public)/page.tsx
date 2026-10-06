import ProductCarousel from "@/components/store/ProductCarousel";
import HeroCarousel from "@/components/store/HeroCarousel";
import { getShowcaseProducts } from "@/lib/getShowCase";
import { io } from "next/cache";
import { Suspense } from "react";

async function ShowcaseSections() {
  await io();

  let showcase;

  try {
    showcase = await getShowcaseProducts();
  } catch (error) {
    console.error("Failed to load homepage showcase products:", error);
    return (
      <section className="featured-section" role="status">
        <p className="max-w-6xl mx-auto px-6 py-8 text-muted">
          Products are temporarily unavailable. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <div>
        <ProductCarousel title="Featured Products" products={showcase.featured} />
      </div>
      <div>
        <ProductCarousel title="New Arrivals" products={showcase.newArrivals} />
      </div>
      <div>
        <ProductCarousel title="Top Rated Products" products={showcase.topRated} />
      </div>
      <div>
        <ProductCarousel title="Daily Deals" products={showcase.deals} />
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