"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import ProductImage from "./ProductImage";

type Props = {
    images: string[];
    name: string;
    discountPercentage: number;
};

export default function ProductImageGallery({ images, name, discountPercentage }: Props) {
    const allImages = images.length > 0 ? images : ["/no-image.svg"];
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [zoom, setZoom] = useState(false);
    const [transformOrigin, setTransformOrigin] = useState("50% 50%");
    const mainImageRef = useRef<HTMLDivElement>(null);

    const prev = useCallback(() => {
        setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    const next = useCallback(() => {
        setActiveIndex((i) => (i + 1) % allImages.length);
    }, [allImages.length]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!mainImageRef.current) return;
        const rect = mainImageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setTransformOrigin(`${x}% ${y}%`);
    }, []);

    return (
        <>
            {/* Main image + nav */}
            <div className="flex flex-col gap-3">
                <div
                    ref={mainImageRef}
                    className="relative aspect-square bg-bg rounded-2xl overflow-hidden group cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setZoom(true)}
                    onMouseLeave={() => setZoom(false)}
                    onClick={() => setLightboxOpen(true)}
                    role="button"
                    aria-label="Open image lightbox"
                >
                    <ProductImage
                        src={allImages[activeIndex]}
                        alt={`${name} – image ${activeIndex + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300"
                        style={{
                            transform: zoom ? "scale(1.6)" : "scale(1)",
                            transformOrigin: zoom ? transformOrigin : "50% 50%",
                        }}
                        priority={activeIndex === 0}
                    />

                    {/* Zoom hint overlay */}
                    <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                        <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ZoomIn size={12} />
                            Zoom
                        </span>
                    </div>

                    {/* Discount badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-error text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10">
                            {discountPercentage}
                        </div>
                    )}

                    {/* Prev / Next arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                aria-label="Previous image"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                aria-label="Next image"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </>
                    )}

                    {/* Dot indicators */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {allImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                    aria-label={`Go to image ${i + 1}`}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeIndex
                                            ? "bg-white scale-125"
                                            : "bg-white/50 hover:bg-white/80"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {allImages.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                aria-label={`View image ${i + 1}`}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === activeIndex
                                        ? "border-primary scale-105 shadow-md"
                                        : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                                    }`}
                            >
                                <ProductImage
                                    src={src}
                                    alt={`${name} thumbnail ${i + 1}`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close */}
                    <button
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close lightbox"
                    >
                        <X size={20} />
                    </button>

                    {/* Counter */}
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {activeIndex + 1} / {allImages.length}
                    </span>

                    {/* Prev */}
                    {allImages.length > 1 && (
                        <button
                            className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Lightbox image */}
                    <div
                        className="relative w-full max-w-3xl aspect-square mx-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ProductImage
                            src={allImages[activeIndex]}
                            alt={`${name} – image ${activeIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-contain"
                        />
                    </div>

                    {/* Next */}
                    {allImages.length > 1 && (
                        <button
                            className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Thumbnail strip in lightbox */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                    aria-label={`View image ${i + 1}`}
                                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === activeIndex
                                            ? "border-white scale-110"
                                            : "border-white/30 opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <ProductImage
                                        src={src}
                                        alt={`Thumbnail ${i + 1}`}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}