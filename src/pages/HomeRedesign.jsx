import React, { useState } from "react";
import { API_BASE_URL } from '../config';
import { Search, SlidersHorizontal, ArrowRight, Droplets, Sparkles, Shield, SprayCan, Star, Mail, CheckCircle, Flame, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const categories = [
    { name: "Cleanse", icon: Droplets, color: "bg-blue-50 text-blue-500", border: "border-blue-100" },
    { name: "Treat", icon: Sparkles, color: "bg-purple-50 text-purple-500", border: "border-purple-100" },
    { name: "Moisturize", icon: SprayCan, color: "bg-green-50 text-green-500", border: "border-green-100" },
    { name: "Protect", icon: Shield, color: "bg-orange-50 text-orange-500", border: "border-orange-100" },
];

const brands = [
    { name: "Laneige", logo: "/brands/laneige.png" },
    { name: "Innisfree", logo: "/brands/innisfree.png" },
    { name: "Cosrx", logo: "/brands/cosrx.png" },
    { name: "Some By Mi", logo: "/brands/somebymi.png" },
    { name: "Dr.G", logo: "/brands/drg.png" },
    { name: "Round Lab", logo: "/brands/roundlab.png" },
];

const reviews = [
    { name: "Sophea K.", comment: "Skin feels so soft! Love the packaging too! 💖", rating: 5 },
    { name: "Davin Net", comment: "Fast delivery and authentic products. Will buy again!", rating: 5 },
    { name: "Kanha", comment: "The Laneige sleeping mask is a game changer! ✨", rating: 4 },
];

export default function HomeRedesign() {
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // 🔄 Fetch Products from API
    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to fetch products:", err));
    }, []);

    // 🔍 Live Search Handler
    const handleSearch = (query) => {
        setSearchQuery(query);
        fetch(`${API_BASE_URL}/api/products?search=${query}`)
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    // 🏷️ Category Filter
    const filteredProducts = products.filter(product => {
        if (selectedCategory === "All") return true;
        if (selectedCategory === "Cleanse") return product.category === "Cleanser";
        if (selectedCategory === "Treat") return ["Treat", "Essence", "Repair"].includes(product.category);
        if (selectedCategory === "Moisturize") return ["Moisturizer", "Mask", "Moisturize"].includes(product.category); // Added "Moisturize" to array
        if (selectedCategory === "Protect") return product.category === "Protect"; // Added missing case
        return true;
    });

    // 🔢 Derived Product Lists
    const newArrivals = products.filter(p => p.isNew);
    const hotDeals = products.filter(p => p.oldPrice && p.oldPrice > p.price);
    const bestSellers = products.filter(p => p.rating >= 4.8);

    const [currentBanner, setCurrentBanner] = useState(0);
    const [banners, setBanners] = useState([]);

    // 🔄 Fetch Banners
    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/banners`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setBanners(data);
                else setBanners([
                    // Fallback if no banners in DB
                    {
                        src: "/banners/banner-laneige.jpg",
                        title: "Glass Skin Goals",
                        subtitle: "Achieve the look you've always wanted.",
                        btnText: "Shop Now"
                    }
                ]);
            })
            .catch(err => console.error("Error fetching banners:", err));
    }, []);

    // 🎞️ Auto-Play Slider
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32 relative font-sans">
            {/* 🔶 Header Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FFF5F5] to-transparent -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* 🔍 Sticky Search Bar */}
                <div className="sticky top-0 z-40 px-5 pt-4 pb-2 bg-[#FAFAFA]/95 md:bg-[#FAFAFA]/80 md:backdrop-blur-md">
                    <div className="relative shadow-sm rounded-2xl md:max-w-2xl md:mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for skincare..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB040]/20 text-gray-700 placeholder:text-gray-400 shadow-sm"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFB040] transition-colors">
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* 🏷️ Auto-Play Banners (Hero Section) */}
                <div className="mt-4 px-5">
                    <div className="relative w-full h-[380px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-gray-100 group">
                        {/* Slides Container */}
                        <div
                            className="flex transition-transform duration-700 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                        >
                            {banners.map((banner, idx) => (
                                <div key={idx} className="min-w-full h-full relative">
                                    <img
                                        src={banner.src}
                                        alt={banner.alt}
                                        className="w-full h-full object-cover object-center"
                                    />
                                    {/* Overlay Gradient & Content */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 pb-16">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="max-w-md"
                                        >
                                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md font-serif">
                                                {banner.title}
                                            </h2>
                                            <p className="text-white/90 text-sm md:text-lg mb-6 drop-shadow-sm font-light">
                                                {banner.subtitle}
                                            </p>
                                            <Link to="/shop">
                                                <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center gap-2 md:bg-white/90 md:backdrop-blur-sm">
                                                    {banner.btnText} <ArrowRight size={16} />
                                                </button>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentBanner === idx ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🧴 Categories - Revamped */}
                <div className="px-5 mt-12 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-gray-900 rounded-full"></div>
                            <h3 className="font-serif text-gray-900 text-xl font-bold tracking-tight">Explore Collections</h3>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-start overflow-x-auto no-scrollbar pb-4 px-1 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-5 md:gap-6 md:justify-center">
                        {/* All Button */}
                        <motion.button
                            onClick={() => setSelectedCategory("All")}
                            className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all duration-300 group snap-center
                                ${selectedCategory === 'All'
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                }`}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedCategory === 'All' ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                <SlidersHorizontal size={18} strokeWidth={1.5} className={selectedCategory === 'All' ? 'text-white' : 'text-gray-500'} />
                            </div>
                            <span className="text-xs font-medium">All</span>
                        </motion.button>

                        {categories.map((cat, idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all duration-300 group snap-center
                                    ${selectedCategory === cat.name
                                        ? cat.color + ' border-transparent shadow-md ring-1 ring-offset-1 ring-gray-200'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedCategory === cat.name ? 'bg-white/20' : 'bg-' + cat.color.split(' ')[0].replace('bg-', '') + '/10 group-hover:bg-' + cat.color.split(' ')[0].replace('bg-', '') + '/20'}`}>
                                    <cat.icon size={18} strokeWidth={1.5} className={selectedCategory === cat.name ? 'text-current' : 'text-gray-400 group-hover:text-gray-600'} />
                                </div>
                                <span className={`text-xs font-medium ${selectedCategory === cat.name ? 'text-current' : 'text-gray-500 group-hover:text-gray-800'}`}>{cat.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* 🎁 Mini Voucher Banner */}
                {!searchQuery && (
                    <div className="px-5 mt-6 mb-2">
                        <Link to="/vouchers">
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-pink-200"
                            >
                                <div>
                                    <h4 className="text-white font-bold text-lg">New Member?</h4>
                                    <p className="text-white/90 text-sm">Claim your <span className="font-extrabold text-yellow-200">30% OFF</span> here!</p>
                                </div>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <ArrowRight className="text-white" size={20} />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                )}

                {/* 🔥 Hot Deals Section - Revamped */}
                {hotDeals.length > 0 && !searchQuery && (
                    <div className="w-full bg-orange-50/50 py-12 mt-8 -mx-5 px-5 md:px-0 border-y border-orange-100">
                        <div className="max-w-7xl mx-auto px-5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                                        <Flame fill="currentColor" size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-gray-900 text-lg tracking-tight">Hot Deals</h3>
                                        <p className="text-orange-400 text-[10px] font-medium uppercase tracking-widest">Limited Time</p>
                                    </div>
                                </div>
                                <Link
                                    to="/shop"
                                    className="px-3 py-1 bg-white text-orange-500 text-xs font-semibold rounded-full shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pt-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-4 lg:grid-cols-5 md:mx-0 md:px-0 md:pt-0 md:overflow-visible">
                                {hotDeals.map(p => {
                                    // 🧮 Calculate Discount
                                    const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

                                    return (
                                        <div key={p.id} className="min-w-[150px] w-[150px] md:w-auto relative group snap-center">
                                            {/* 🏷️ Discount Badge */}
                                            {discount > 0 && (
                                                <div className="absolute -top-3 -right-2 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                                                    -{discount}%
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
                )}

                {/* ❤️ Best Sellers (Favorites) */}
                {/* ❤️ Best Sellers (Favorites) - Revamped */}
                {/* ❤️ Best Sellers (Favorites) - Revamped */}
                {bestSellers.length > 0 && !searchQuery && (
                    <div className="w-full bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 py-12 mt-8 -mx-5 px-5 md:px-0">
                        <div className="max-w-7xl mx-auto px-5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500">
                                        <Heart fill="currentColor" size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-gray-900 text-lg tracking-tight">Best Sellers</h3>
                                        <p className="text-pink-400 text-[10px] font-medium uppercase tracking-widest">Favorites</p>
                                    </div>
                                </div>
                                <Link
                                    to="/shop"
                                    className="px-3 py-1 bg-white text-pink-500 text-xs font-semibold rounded-full shadow-sm hover:bg-pink-500 hover:text-white transition-all"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pt-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-4 lg:grid-cols-5 md:mx-0 md:px-0 md:pt-0 md:overflow-visible">
                                {bestSellers.map((p, idx) => (
                                    <div key={p.id} className="min-w-[150px] w-[150px] md:w-auto relative group snap-center">
                                        {/* 👑 Crown for #1 */}
                                        {idx === 0 && (
                                            <div className="absolute -top-3 -left-2 z-20 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                <span>👑</span> #1 Top Pick
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
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ✨ New Arrivals Section */}
                {/* ✨ New Arrivals Section - Revamped */}
                {/* ✨ New Arrivals Section - Revamped */}
                {newArrivals.length > 0 && !searchQuery && (
                    <div className="w-full bg-[#F0F9FF] py-12 mt-8 -mx-5 px-5 md:px-0 border-y border-blue-50">
                        <div className="max-w-7xl mx-auto px-5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                                        <Sparkles fill="currentColor" size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-gray-900 text-lg tracking-tight">New Arrivals</h3>
                                        <p className="text-blue-400 text-[10px] font-medium uppercase tracking-widest">Just Dropped</p>
                                    </div>
                                </div>
                                <Link
                                    to="/shop"
                                    className="px-3 py-1 bg-white text-blue-500 text-xs font-semibold rounded-full shadow-sm hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pt-2 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-4 lg:grid-cols-5 md:mx-0 md:px-0 md:pt-0 md:overflow-visible">
                                {newArrivals.map((p, idx) => (
                                    <div key={p.id} className="min-w-[150px] w-[150px] md:w-auto relative group snap-center">
                                        {/* 🆕 New Badge */}
                                        <div className="absolute -top-3 -right-2 z-20 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                                            NEW
                                        </div>

                                        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                            <ProductCard
                                                product={p}
                                                onAdd={() => addToCart(p)}
                                                onWish={() => toggleWishlist(p)}
                                                wished={isWished(p.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 🏆 Brands We Love */}
                {!searchQuery && (
                    <div className="mt-8 px-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-lg tracking-tight">Brands We Love</h3>
                            <Link to="/shop" className="text-gray-400 text-sm hover:text-[#FFB040] transition-colors">View All</Link>
                        </div>

                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-6 md:mx-0 md:px-0 md:overflow-visible">
                            {brands.map((brand, idx) => (
                                <motion.div
                                    key={idx}
                                    whileTap={{ scale: 0.95 }}
                                    className="min-w-[80px] h-[80px] bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer snap-center"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-12 h-12 bg-rose-50 rounded-full items-center justify-center text-rose-400 text-sm font-bold hidden">
                                            {brand.name[0]}
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">{brand.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 💬 Lovely Reviews */}
                {!searchQuery && (
                    <div className="mt-10 px-5">
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight mb-4">Lovely Reviews</h3>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 md:mx-0 md:px-0 md:overflow-visible">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="min-w-[220px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 snap-center group">
                                    <div className="flex gap-1 text-[#FFB040]">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                    <p className="text-gray-600 text-xs italic">"{review.comment}"</p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 text-[10px] font-bold">
                                            {review.name[0]}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-800">{review.name}</span>
                                        <CheckCircle size={10} className="text-blue-400 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 💌 Newsletter */}
                {!searchQuery && (
                    <div className="mt-10 px-5 mb-8">
                        <div className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-3xl p-6 relative overflow-hidden text-center">
                            <Sparkles className="absolute top-4 right-4 text-white/40" size={40} />
                            <h3 className="text-xl font-bold text-rose-900 mb-2">Stay in the Loop 🎀</h3>
                            <p className="text-rose-800/80 text-sm mb-6">Get the latest trends and exclusive deals sent to your inbox.</p>

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-4 pr-12 py-3.5 bg-white/90 backdrop-blur rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-rose-300"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-md hover:bg-rose-600 transition-colors">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✨ Main Product Grid */}
                <div className="mt-8 px-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                            {searchQuery ? 'Search Results' : 'Recommended For You'}
                        </h3>
                        {!searchQuery && (
                            <Link
                                to="/shop"
                                className="px-3 py-1 bg-white text-[#FFB040] text-xs font-semibold rounded-full shadow-sm border border-gray-100 hover:bg-[#FFB040] hover:text-white transition-all"
                            >
                                Shop All
                            </Link>
                        )}
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50 col-span-full">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                            <p className="text-gray-400">
                                {selectedCategory === "All" ? "Loading your favorites..." : `No items in ${selectedCategory}`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6 pb-20">
                            {filteredProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onAdd={() => addToCart(p)}
                                    onWish={() => toggleWishlist(p)}
                                    wished={isWished(p.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* End of max-w-7xl wrapper */}
            </div>
        </div>
    );
}
