'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/hero-electronics.png",
    category: "TECH & INNOVATION",
    title: "Next-Gen Audio & Gear",
    description: "Experience premium sound and high-performance notebooks designed to elevate your everyday work and lifestyle.",
    ctaText: "Explore Innovation",
    ctaLink: "/products?category=electronics",
    tagline: "Up to 30% Off on Top Tech Brands"
  },
  {
    id: 2,
    image: "/hero-fashion.png",
    category: "EXQUISITE FASHION",
    title: "Step Into Style",
    description: "Discover our new seasonal arrival collection featuring contemporary apparel designed for comfort and modern elegance.",
    ctaText: "Shop the Collection",
    ctaLink: "/products?category=fashion",
    tagline: "Trending Styles for the Modern Wardrobe"
  },
  {
    id: 3,
    image: "/hero-home.png",
    category: "SMART LIVING",
    title: "Elevate Your Space",
    description: "Upgrade your lifestyle with curated home decor and high-tech kitchen appliances that combine style with utility.",
    ctaText: "Upgrade Home",
    ctaLink: "/products?category=home",
    tagline: "Smart Choices for a Beautiful Home"
  },
  {
    id: 4,
    image: "/hero-fitness.png",
    category: "PERFORMANCE SPORTS",
    title: "Redefine Your Limit",
    description: "Fuel your active routine with professional athletic shoes, gear, and trackers built to optimize your training.",
    ctaText: "View Sports Gear",
    ctaLink: "/products?category=sports",
    tagline: "Gear Up for Peak Performance"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  // Start autoplay
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, nextSlide]);

  return (
    <div 
      className="relative w-full h-[380px] sm:h-[480px] md:h-[600px] overflow-hidden group bg-neutral-900"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Slide Image */}
              <div className="absolute inset-0 w-full h-full select-none animate-fade-in">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center w-full h-full transition-transform duration-10000 ease-linear scale-100 group-hover:scale-105"
                  sizes="100vw"
                />
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-black/15" />
              </div>

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-6xl mx-auto px-6 sm:px-12 w-full text-white">
                  <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-6">
                    {/* Category Tagline */}
                    <div 
                      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white transition-all duration-700 delay-100 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      {slide.category}
                    </div>

                    {/* Headline */}
                    <h1 
                      className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight transition-all duration-700 delay-200 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p 
                      className={`text-sm sm:text-lg md:text-xl text-neutral-300 font-medium max-w-lg leading-relaxed transition-all duration-700 delay-300 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      {slide.description}
                    </p>

                    {/* Extra Tagline */}
                    <p
                      className={`text-xs sm:text-sm text-indigo-300 font-semibold tracking-wide transition-all duration-700 delay-400 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      {slide.tagline}
                    </p>

                    {/* Call to Action Button */}
                    <div 
                      className={`pt-2 transition-all duration-700 delay-500 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <Link 
                        href={slide.ctaLink}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/25 duration-200"
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-4 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer h-2.5 ${
              idx === current 
                ? "w-8 bg-white shadow-md shadow-white/30" 
                : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}