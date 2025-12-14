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
      <div className="bg-[#Fdf2f8] rounded-[2rem] p-3 relative aspect-[4/5] flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">

        {/* 🖼️ Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pb-24">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
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
          className="absolute top-4 left-4 z-10"
        >
          <Heart size={22} strokeWidth={1.5} className={`transition-colors ${wished ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-gray-600"}`} />
        </button>

        {/* 🛍️ Add to Cart Icon - Large White Circle */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAdd) onAdd();
          }}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:scale-110 transition-transform active:scale-95"
        >
          <ShoppingBag size={18} className="text-gray-900" />
        </button>

        {/* 📝 Content Overlay - Floating White Card */}
        <div className="relative z-10 mt-auto bg-white rounded-2xl p-3 shadow-sm text-center mx-1 mb-1">
          <h3 className="font-serif font-medium text-gray-700 text-sm leading-tight mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-center">
            <span className="font-bold text-gray-900 text-sm">${price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
