import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd, onWish, wished }) {
  // 🛡️ Guard Clause (Prevents crash if product is missing)
  if (!product) return null;

  // 🛡️ Safe Parsing (fixes crash if price is text string)
  const price = parseFloat(product.price) || 0;

  // 🎨 Minimalist Gray Style (Restored)
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-[#E5E5E5] rounded-[20px] p-4 relative aspect-[4/5] flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all duration-300">

        {/* 🖼️ Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pb-20">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; }} // Hide broken image to remove duplicate text visual if alt shows up ugly
            className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* ❤️ Heart Icon (Now Top Left) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish && onWish();
          }}
          className="absolute top-4 left-4 z-10 p-2"
        >
          <Heart size={20} className={`text-black transition-colors ${wished ? "fill-pink-500 text-pink-500" : "hover:fill-black"}`} />
        </button>

        {/* 🛍️ Add to Cart Icon (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAdd) onAdd();
          }}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform active:scale-95"
        >
          <ShoppingBag size={18} className="text-gray-800" />
        </button>

        {/* 📝 Content Overlay (Bottom Left) */}
        <div className="relative z-10 mt-auto">
          <h3 className="font-serif font-medium text-black text-xl leading-tight mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
            <div className="flex items-center gap-2 text-gray-500 text-sm font-light group-hover:gap-3 transition-all">
              <span>Detail</span>
              <span className="text-xs">⟶</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
