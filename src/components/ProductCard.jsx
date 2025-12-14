import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

export default function ProductCard({ product, onAdd, onWish, wished }) {
  // 🛡️ Guard Clause (Prevents crash if product is missing)
  if (!product) return null;

  // 🛡️ Safe Parsing (fixes crash if price is text string)
  const price = parseFloat(product.price) || 0;

  // Optimize Image for Card (Width 400px is usually enough for cards)
  const imageUrl = getOptimizedImageUrl(product.image, { width: 400 });

  // 🎨 Minimalist Gray Style (Restored)
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-[#F3F4F6] rounded-2xl p-3 relative aspect-[4/5] flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">

        {/* 🖼️ Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pb-16">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* ❤️ Heart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish && onWish();
          }}
          className="absolute top-3 left-3 z-10"
        >
          <Heart size={20} className={`transition-colors ${wished ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-gray-600"}`} />
        </button>

        {/* 🛍️ Add to Cart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAdd) onAdd();
          }}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform active:scale-95"
        >
          <ShoppingBag size={18} className="text-gray-800" />
        </button>

        {/* 📝 Content Overlay */}
        <div className="relative z-10 mt-auto bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
          <h3 className="font-serif font-medium text-gray-900 text-sm md:text-base leading-tight mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 text-sm md:text-base">${price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
