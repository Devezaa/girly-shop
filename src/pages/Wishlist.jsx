import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✨ Animation
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Background from "../components/Background"; // 🌸 Consistent background

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isWished } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Products to match IDs
  useEffect(() => {
    if (wishlist.size === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const ids = Array.from(wishlist).join(',');
    setLoading(true);

    fetch(`${API_BASE_URL}/api/products?ids=${ids}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products for wishlist:", err);
        setLoading(false);
      });
  }, [wishlist]); // Re-fetch when wishlist changes

  // 🔍 Filter products (Safety check + Convert Set to Array logic replaced by API)
  // We can just use 'products' directly now since API returns exactly what we asked for.
  const wishedProducts = products;
  const isEmpty = wishlist.size === 0;

  return (
    <div className="min-h-screen relative font-sans overflow-hidden">
      {/* 🌸 Shared Animated Background */}
      <Background />

      {/* 🔙 Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-md border-b border-pink-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-pink-500 hover:scale-110 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-serif">
            My Favourites 💖
          </h1>
        </div>
        <div className="relative">
          <Heart className="text-pink-500 fill-pink-500" size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-pink-100">
            {wishlist.size}
          </span>
        </div>
      </header>

      {/* 🛍️ Content Area */}
      <main className="px-6 py-6 pb-24 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            </motion.div>
          ) : isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 shadow-inner border border-pink-50 relative group">
                <Heart size={64} className="text-pink-200 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-10 right-10 text-2xl animate-bounce">✨</div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
                Save items you love here! <br /> Just click the heart icon while shopping.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {wishedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <ProductCard
                    product={p}
                    onAdd={() => addToCart(p)}
                    onWish={() => toggleWishlist(p)}
                    wished={true} // Always wished here
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
