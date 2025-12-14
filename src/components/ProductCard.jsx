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
      <div className="bg-white rounded-2xl p-4 relative aspect-[4/5] flex flex-col justify-between overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">

        {/* 🖼️ Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pb-20">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ❤️ Heart Icon - Bottom Right of Image */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish && onWish();
          }}
          className="absolute bottom-20 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
        >
          <Heart size={18} className={`transition-colors ${wished ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-gray-600"}`} />
        </button>

        {/* 📝 Content - Clean Bottom (No Floating Block) */}
        <div className="relative z-10 mt-auto pt-2 border-t border-gray-50">
          <h3 className="font-serif font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base">${price.toFixed(2)}</span>
            {/* Optional: Add Rating Stars here if available, or keep simple */}
          </div>
        </div>
      </div>
    </Link>
  );
}
