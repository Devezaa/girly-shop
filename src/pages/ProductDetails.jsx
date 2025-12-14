import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
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
        <div className="min-h-screen bg-white pb-32 md:pb-10 font-sans">
            {/* 🔝 Sticky Header */}
            <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md px-4 py-3 flex justify-between items-center z-50 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-900" />
                </button>
                <span className="font-serif font-bold text-gray-900 text-lg truncate max-w-[50%] opacity-0 md:opacity-100 transition-opacity">{product.name}</span>
                <div className="flex gap-3">
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors ${wished ? "text-rose-500 bg-rose-50" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <Heart size={20} className={wished ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={() => navigate('/order-details')}
                        className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-colors relative"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12">

                {/* 🖼️ Gallery Section */}
                <div className="bg-gray-50 md:bg-transparent pt-20 pb-8 md:py-0 px-6 md:px-0">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="aspect-[4/5] md:aspect-square bg-white md:bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] p-8 flex items-center justify-center relative overflow-hidden shadow-sm md:shadow-none border border-gray-100 md:border-transparent"
                    >
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0.8, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={getOptimizedImageUrl(activeImage, 800)}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                        />
                        {discount > 0 && (
                            <div className="absolute top-6 left-6 bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-rose-200/50">
                                -{discount}%
                            </div>
                        )}
                    </motion.div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 px-1 mt-6 justify-center no-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 rounded-2xl border flex items-center justify-center bg-white p-2 transition-all ${activeImage === img ? 'border-gray-900 ring-1 ring-gray-900 scale-105' : 'border-gray-100 opacity-60'}`}
                                >
                                    <img src={getOptimizedImageUrl(img, 150)} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 📝 Info Section */}
                <div className="px-6 pb-8 pt-4 md:pt-0 space-y-8">
                    {/* Header Info */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            {product.brand && (
                                <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                                    {product.brand}
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-[#FFB040]">
                                <Star size={14} className="fill-current" />
                                <span className="font-bold text-gray-900 text-sm">{product.rating || 5.0}</span>
                                <span className="text-gray-300 text-xs">({product.reviews || 12} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-4xl font-bold text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                                <span className="text-xl text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                            )}
                        </div>

                        {/* ✨ Highlights */}
                        {product.highlights && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.highlights.slice(0, 3).map((highlight, idx) => (
                                    <span key={idx} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-100">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ⚙️ Tabs */}
                    <div>
                        <div className="flex border-b border-gray-100 mb-6">
                            {['description', 'usage', 'ingredients'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[100px] text-gray-500 leading-relaxed text-sm">
                            <AnimatePresence mode="wait">
                                {activeTab === 'description' && (
                                    <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p>{product.description || "Experience superior quality with our premium collection. Carefully curated for the best results."}</p>
                                    </motion.div>
                                )}
                                {activeTab === 'usage' && (
                                    <motion.div key="usage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {product.howToUse ? (
                                            <ul className="space-y-2 list-disc pl-4">
                                                {product.howToUse.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ul>
                                        ) : <p className="italic text-gray-400">No specific instructions.</p>}
                                    </motion.div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <motion.div key="ing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p className="font-mono text-xs leading-6">{product.ingredients || "Ingredients not listed."}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </main>

            {/* 📱 Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t border-gray-100 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] md:relative md:border-none md:shadow-none md:bg-transparent md:p-0 md:pb-0">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    {/* Qty Stepper */}
                    <div className={`flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3 h-[56px] border border-gray-100 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black w-6 h-6 flex items-center justify-center">
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-gray-900 text-lg w-4 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="text-gray-400 hover:text-black w-6 h-6 flex items-center justify-center">
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 h-[56px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]
                            ${isOutOfStock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'}`}
                    >
                        {isOutOfStock ? (
                            <>Out of Stock</>
                        ) : (
                            <>
                                <ShoppingBag size={20} /> Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
