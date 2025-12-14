import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Minus, Plus, ShoppingBag, ShieldCheck, Truck, Award, Check, Package, Droplet, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on id change
        setLoading(true);
        fetch(`${API_BASE_URL}/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setActiveImage(data.image);
                // Fetch related products (mock logic: fetch all and take random 4, excluding current)
                return fetch(`${API_BASE_URL}/api/products`);
            })
            .then(res => res.json())
            .then(allProducts => {
                const others = allProducts.filter(p => p.id !== id);
                setRelatedProducts(others.sort(() => 0.5 - Math.random()).slice(0, 4));
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
        </div>
    );

    if (!product) return <div className="min-h-screen flex items-center justify-center bg-white">Product not found</div>;

    const wished = isWished(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const stock = product.stock || 0;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock < 10;

    return (
        <div className="min-h-screen bg-white pb-32 md:pb-16 font-sans">
            {/* 🔝 Sticky Simple Header */}
            <div className="sticky top-0 left-0 right-0 bg-white/90 backdrop-blur-xl px-4 py-3 flex justify-between items-center z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-transparent hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <ArrowLeft size={22} className="text-gray-900" />
                </button>
                <div className="font-serif font-bold text-gray-900 text-lg md:text-xl truncate opacity-0 md:opacity-100 transition-opacity">
                    {product.name}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${wished ? "text-rose-500 bg-rose-50 scale-105" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"}`}
                    >
                        <Heart size={22} className={wished ? "fill-current" : ""} />
                    </button>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <Share2 size={22} />
                    </button>
                    <button
                        onClick={() => navigate('/order-details')}
                        className="hidden md:flex w-10 h-10 rounded-full bg-gray-900 items-center justify-center text-white hover:bg-black transition-colors"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-0 md:px-6 py-0 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">

                {/* 🖼️ Gallery Section (Left - 7 cols) */}
                <div className="lg:col-span-7 bg-gray-50 md:bg-transparent pt-8 pb-12 md:py-0 px-0 md:px-0">
                    <div className="sticky top-24 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="aspect-[4/5] md:aspect-square lg:aspect-[4/3] bg-white md:bg-gray-50 rounded-[0] md:rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center relative overflow-hidden shadow-none md:border border-gray-100"
                        >
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0.8, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                src={getOptimizedImageUrl(activeImage, 1200)}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                            />
                            {discount > 0 && (
                                <div className="absolute top-6 left-6 bg-gray-900 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                                    -{discount}%
                                </div>
                            )}
                        </motion.div>

                        {/* Desktop Thumbnails Grid */}
                        {images.length > 1 && (
                            <div className="hidden md:grid grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-2xl border bg-gray-50 p-2 transition-all duration-300 ${activeImage === img ? 'border-gray-900 ring-1 ring-gray-900 scale-105 z-10' : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={getOptimizedImageUrl(img, 200)} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mobile Scrolling Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex md:hidden gap-3 overflow-x-auto px-4 no-scrollbar -mt-6 relative z-10">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-16 h-16 flex-shrink-0 rounded-2xl border bg-white shadow-sm p-2 transition-all ${activeImage === img ? 'border-gray-900 ring-1 ring-gray-900 scale-105' : 'border-gray-100 opacity-60'}`}
                                    >
                                        <img src={getOptimizedImageUrl(img, 150)} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 📝 Info Section (Right - 5 cols) - Sticky on Desktop */}
                <div className="lg:col-span-5 px-6 md:px-0 pt-6 md:pt-0 relative">
                    <div className="lg:sticky lg:top-28 space-y-8 md:space-y-10">

                        {/* Title Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                {product.brand ? (
                                    <span className="font-bold text-gray-400 text-xs uppercase tracking-[0.2em]">
                                        {product.brand}
                                    </span>
                                ) : <span className="w-2" />}
                                <div className="flex items-center gap-1.5 text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                                    <Star size={14} className="fill-gray-900" />
                                    <span className="font-bold text-xs">{product.rating || 5.0}</span>
                                    <span className="text-gray-400 text-[10px] uppercase tracking-wide decoration-0">({product.reviews || 12} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-5xl font-serif font-medium text-gray-900 leading-[1.1] tracking-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 border-b border-gray-100 pb-6">
                                <span className="text-4xl font-light text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
                                {product.oldPrice && (
                                    <span className="text-xl text-gray-300 line-through decoration-1">${product.oldPrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 leading-7 text-sm md:text-base font-light">
                            {product.description || "Designed with precision and care, this premium product delivers exceptional quality and performance. Perfect for your daily routine."}
                        </p>

                        {/* 📦 Stock Status */}
                        <div className="flex items-center gap-2 py-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'}`} />
                            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                                {isOutOfStock ? "Out of Stock" : isLowStock ? `Low Stock: Only ${stock} left` : `In Stock: ${stock} items available`}
                            </span>
                        </div>

                        {/* Selectors */}
                        <div className="space-y-6">
                            {/* Size/Volume would go here */}
                            {product.volume && (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-900 w-16">Size</span>
                                    <button className="px-4 py-2 border border-gray-900 bg-gray-900 text-white rounded-lg text-sm font-medium">{product.volume}</button>
                                </div>
                            )}
                        </div>

                        {/* Highlights */}
                        {product.highlights && (
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {product.highlights.slice(0, 4).map((highlight, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check size={14} className="text-gray-900 shrink-0" />
                                        <span className="truncate">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Desktop Add to Cart (Hidden on Mobile) */}
                        <div className="hidden md:flex flex-col gap-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-6 bg-gray-50 rounded-2xl px-5 py-4 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black">
                                        <Minus size={20} />
                                    </button>
                                    <span className="font-bold text-gray-900 text-lg w-6 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className={`text-gray-400 hover:text-black ${quantity >= stock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                        className={`w-full min-w-[200px] h-[60px] rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-xl
                                            ${isOutOfStock
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isLowStock
                                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                                    : 'bg-gray-900 text-white shadow-lg shadow-gray-200'}`}
                                    >
                                        {isOutOfStock ? "Out of Stock" : (
                                            <>
                                                <ShoppingBag size={20} /> {isLowStock ? `Order Now - Only ${stock} Left!` : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
                                            </>
                                        )}
                                    </button>
                                    {isLowStock && !isOutOfStock && (
                                        <span className="text-xs text-orange-600 font-bold text-center animate-pulse">
                                            🔥 High demand! Only {stock} items remaining.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium tracking-wide uppercase pt-4">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Authentic</span>
                                <span className="flex items-center gap-1.5"><Truck size={14} /> Fast Delivery</span>
                                <span className="flex items-center gap-1.5"><Award size={14} /> Warranty</span>
                            </div>
                        </div>

                        {/* Accordion Tabs */}
                        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                            {['usage', 'ingredients'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(activeTab === tab ? '' : tab)}
                                    className="w-full py-4 flex items-center justify-between group"
                                >
                                    <span className="font-bold text-sm uppercase tracking-widest text-gray-900">{tab}</span>
                                    <Plus size={16} className={`text-gray-400 transition-transform duration-300 ${activeTab === tab ? 'rotate-45 text-gray-900' : 'group-hover:text-gray-600'}`} />
                                </button>
                            ))}
                            {/* Accordion Content (Simplified for this view, rendered conditionally below just for effect or keep separate) */}
                            <AnimatePresence>
                                {activeTab === 'usage' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pb-6 text-sm text-gray-500 leading-relaxed">
                                            {product.howToUse ? <ul className="list-disc pl-5 space-y-1">{product.howToUse.map((s, i) => <li key={i}>{s}</li>)}</ul> : "Apply as needed."}
                                        </div>
                                    </motion.div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pb-6 text-xs font-mono text-gray-500 leading-relaxed">
                                            {product.ingredients || "Ingredients not listed."}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </main>

            {/* ✨ Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-gray-100 mt-16 md:mt-24">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8 md:mb-12 text-center">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} onWish={() => toggleWishlist(p)} wished={isWished(p.id)} />
                        ))}
                    </div>
                </section>
            )}

            {/* 📱 Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t border-gray-100 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3">
                    {/* Qty Stepper */}
                    <div className={`flex items-center gap-3 bg-gray-50 rounded-xl px-3 h-[52px] border border-gray-100 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 active:text-black">
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-gray-900 text-base w-4 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="text-gray-400 active:text-black">
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 h-[52px] rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.98]
                            ${isOutOfStock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : isLowStock
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'bg-gray-900 text-white'}`}
                    >
                        {isOutOfStock ? (
                            <>Out of Stock</>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={18} />
                                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                                </div>
                                {isLowStock && <span className="text-[10px] opacity-90 font-medium">Only {stock} Left - Buy Now!</span>}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
