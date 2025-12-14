import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { Search, Filter, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";

export default function Shop() {
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // 🔄 Fetch Products
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setLoading(false);
            });
    }, []);

    // 🔍 Search Filter
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32 pt-8 font-sans px-5 md:px-0">
            <div className="max-w-7xl mx-auto">

                {/* 🛍️ Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            Shop All
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Discover our full collection of beauty essentials.</p>
                    </div>

                    <div className="relative shadow-sm rounded-2xl md:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700 placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                </div>

                {/* 📦 Product Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <ShoppingBag size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium">No products found matching "{searchQuery}"</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-4 md:gap-y-8"
                    >
                        {filteredProducts.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onAdd={() => addToCart(p)}
                                onWish={() => toggleWishlist(p)}
                                wished={isWished(p.id)}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
