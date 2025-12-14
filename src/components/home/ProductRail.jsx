import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductRail({ title, subtitle, icon: Icon, iconColor, products, bgClass, borderClass, linkTo = "/shop", variant = "standard" }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();

    if (!products || products.length === 0) return null;

    return (
        <div className={`w-full ${bgClass} py-12 mt-8 -mx-5 px-5 md:px-0 ${borderClass ? `border-y ${borderClass}` : ''}`}>
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm ${iconColor}`}>
                            {Icon && <Icon fill="currentColor" size={16} />}
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-gray-900 text-lg tracking-tight">{title}</h3>
                            <p className={`${iconColor.replace('text-', 'text-opacity-80 decoration-')} text-[10px] font-medium uppercase tracking-widest`}>{subtitle}</p>
                        </div>
                    </div>
                    <Link
                        to={linkTo}
                        className={`px-3 py-1 bg-white ${iconColor} text-xs font-semibold rounded-full shadow-sm hover:opacity-80 transition-all`}
                    >
                        View All
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pt-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-4 lg:grid-cols-5 md:mx-0 md:px-0 md:pt-0 md:overflow-visible">
                    {products.map((p, idx) => {
                        // Discount Logic
                        const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

                        return (
                            <div key={p.id} className="min-w-[150px] w-[150px] md:w-auto relative group snap-center">
                                {/* Discount Badge for Hot Deals */}
                                {discount > 0 && variant === "deals" && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                                        -{discount}%
                                    </div>
                                )}

                                {/* Crown for Best Seller #1 */}
                                {idx === 0 && variant === "bestsellers" && (
                                    <div className="absolute -top-3 -left-2 z-20 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                        <span>👑</span> #1 Top Pick
                                    </div>
                                )}

                                {/* New Badge for New Arrivals */}
                                {variant === "new" && (
                                    <div className="absolute -top-3 -right-2 z-20 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                                        NEW
                                    </div>
                                )}

                                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                    <ProductCard
                                        product={p}
                                        onAdd={() => addToCart(p)}
                                        onWish={() => toggleWishlist(p)}
                                        wished={isWished(p.id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
