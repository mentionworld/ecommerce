'use client'

import { useState } from "react";
import { TProduct } from "@/types";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

type TProps = {
  product: TProduct;
}

export default function ProductActions({ product }: TProps) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {!outOfStock && (
        <div className="flex items-center border border-border rounded-lg bg-surface w-fit">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="flex items-center justify-center w-10 h-10 text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold text-text select-none">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={quantity >= product.stock}
            className="flex items-center justify-center w-10 h-10 text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
      <AddToCartButton product={product} quantity={quantity} />
    </div>
  );
}