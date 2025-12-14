import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Minus, Plus, ShoppingBag, ShieldCheck, Truck, Award, Check, Package, Droplet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [activeTab, setActiveTab] = useState("description"); // description, usage, ingredients

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setActiveImage(data.image); // Set initial main image
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (product.stock === 0) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        navigate('/order-details');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">Product not found</div>;

    const wished = isWished(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    // 📦 Stock Logic
    const stock = product.stock || 0;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock < 5;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-10 font-sans">
            {/* 🔙 Header */}
            <div className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center z-40 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <span className="font-bold text-gray-800 text-lg truncate max-w-[60%] opacity-0 md:opacity-100 transition-opacity">{product.name}</span>
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${wished ? "text-rose-500" : "text-gray-400"}`}
                >
                    <Heart size={24} className={wished ? "fill-current" : ""} />
                </button>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* 🖼️ Gallery Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="aspect-square bg-white rounded-3xl p-6 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden relative cursor-zoom-in group"
                    >
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0.8, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-rose-200">
                                -{discount}%
                            </div>
                        )}
                        {/* 🏷️ Stock Badge Overlay */}
                        <div className="absolute top-4 right-4">
                            {isOutOfStock ? (
                                <span className="bg-red-100/90 backdrop-blur text-red-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-red-200 flex items-center gap-1.5">
                                    <Package size={14} /> Out of Stock
                                </span>
                            ) : isLowStock ? (
                                <span className="bg-orange-100/90 backdrop-blur text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-orange-200 flex items-center gap-1.5">
                                    <Package size={14} /> Low Stock: {stock} left
                                </span>
                            ) : (
                                <span className="bg-green-100/90 backdrop-blur text-green-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-green-200 flex items-center gap-1.5">
                                    <Package size={14} /> In Stock: {stock}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* Thumbnails (Only if multiple) */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 bg-white rounded-xl border-2 p-1 overflow-hidden transition-all ${activeImage === img ? 'border-pink-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 📝 Info Section */}
                <div className="space-y-8">
                    {/* Header Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {product.brand && (
                                <span className="font-bold text-pink-500 text-sm uppercase tracking-wider bg-pink-50 px-2 py-1 rounded-md">
                                    {product.brand}
                                </span>
                            )}
                            {product.isNew && <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">New Arrival</span>}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            {/* Rating */}
                            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                                <div className="flex text-[#FFB040]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.floor(product.rating || 5) ? "fill-current" : "text-gray-300"} />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-800">{product.rating || 5.0}</span>
                                <span className="text-gray-400">({product.reviews || 0} reviews)</span>
                            </div>

                            {/* Volume */}
                            {product.volume && (
                                <div className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                                    <Droplet size={14} />
                                    {product.volume}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
                        <span className="text-5xl font-bold text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <div className="flex flex-col mb-2">
                                <span className="text-xl text-gray-400 line-through font-medium">${product.oldPrice.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* ✨ Highlights (Short) */}
                    {product.highlights && (
                        <div className="grid grid-cols-2 gap-3">
                            {product.highlights.slice(0, 4).map((highlight, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check size={12} className="text-green-600" />
                                    </div>
                                    {highlight}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🛡️ Trust Badges */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <ShieldCheck className="text-pink-400 mb-2" size={24} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">100% Authentic</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <Truck className="text-pink-400 mb-2" size={24} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fast Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <Award className="text-pink-400 mb-2" size={24} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quality Guarantee</span>
                        </div>
                    </div>

                    {/* ⚙️ Tabs */}
                    <div>
                        <div className="flex gap-8 border-b border-gray-100 mb-4 overflow-x-auto scrollbar-hide">
                            {['description', 'usage', 'ingredients'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[100px] text-gray-600 leading-relaxed text-sm bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <AnimatePresence mode="wait">
                                {activeTab === 'description' && (
                                    <motion.div key="desc" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                        <p>{product.description || "Experience the best quality with our premium product range. Designed to meet your needs with carefully selected ingredients and superior formulation."}</p>
                                    </motion.div>
                                )}
                                {activeTab === 'usage' && (
                                    <motion.div key="usage" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                        {product.howToUse ? (
                                            <div className="space-y-4">
                                                {product.howToUse.map((step, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-xs font-bold text-pink-600">{i + 1}</span>
                                                        <p>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic">No specific instructions provided. Apply as needed.</p>
                                        )}
                                    </motion.div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <motion.div key="ing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                        {product.ingredients ? (
                                            <p className="font-mono text-xs text-gray-500 leading-6">{product.ingredients}</p>
                                        ) : (
                                            <p className="italic text-gray-400">Ingredients list not available.</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 🛒 Add to Cart (Unified for Mobile & Desktop) */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-6">
                        <div className={`flex items-center gap-4 bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black">
                                <Minus size={20} />
                            </button>
                            <span className="font-bold text-gray-900 text-lg w-6 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className={`text-gray-400 hover:text-black ${quantity >= stock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                <Plus size={20} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-1 font-bold text-base md:text-lg rounded-full py-3 px-6 md:py-4 md:px-8 shadow-xl transition-all flex items-center justify-center gap-2 md:gap-3 
                                ${isOutOfStock
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-2xl hover:scale-[1.01]'}`}
                        >
                            <ShoppingBag size={20} className="md:w-[22px] md:h-[22px]" />
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>

                </div>
            </main>

            {/* 📱 Mobile Sticky Action Bar Removed */}
        </div>
    );
}
