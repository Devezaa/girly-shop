import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from '../config';
import { BRANDS } from "../data/brands";
import { REVIEWS } from "../data/reviews";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Droplets, Sparkles, Shield, SprayCan, Flame, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard"; // Still needed for grid view if not using ProductRail there?
// Actually the main grid uses ProductCard directly.

// New Components
import HeroSlider from "../components/home/HeroSlider";
import CategoryRail from "../components/home/CategoryRail";
import ProductRail from "../components/home/ProductRail";
import BrandsRail from "../components/home/BrandsRail";
import ReviewsRail from "../components/home/ReviewsRail";
import OfferBanner from "../components/home/OfferBanner";
import Newsletter from "../components/home/Newsletter";
import SkeletonLoader from "../components/common/SkeletonLoader";
import ErrorDisplay from "../components/common/ErrorDisplay";

const categories = [
    { name: "Cleanse", icon: Droplets, iconBgClass: "bg-blue-50/50 group-hover:bg-blue-50", iconColorClass: "text-blue-500" },
    { name: "Treat", icon: Sparkles, iconBgClass: "bg-purple-50/50 group-hover:bg-purple-50", iconColorClass: "text-purple-500" },
    { name: "Moisturize", icon: SprayCan, iconBgClass: "bg-green-50/50 group-hover:bg-green-50", iconColorClass: "text-green-500" },
    { name: "Protect", icon: Shield, iconBgClass: "bg-orange-50/50 group-hover:bg-orange-50", iconColorClass: "text-orange-500" },
];

export default function HomeRedesign() {
    const { addToCart } = useCart();
    const { toggleWishlist, isWished } = useWishlist();

    // State
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔄 Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Parallel fetching
                const [productsRes, bannersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/products`),
                    fetch(`${API_BASE_URL}/api/banners`)
                ]);

                if (!productsRes.ok || !bannersRes.ok) throw new Error("Failed to fetch data");

                const productsData = await productsRes.json();
                const bannersData = await bannersRes.json();

                setProducts(productsData);

                // Banner fallback
                if (bannersData.length > 0) {
                    setBanners(bannersData);
                } else {
                    setBanners([
                        {
                            src: "/banners/banner-laneige.jpg",
                            title: "Glass Skin Goals",
                            subtitle: "Achieve the look you've always wanted.",
                            btnText: "Shop Now"
                        }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("We couldn't load the shop. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 🔍 Live Search Handler (Optimized: Client-side only)
    const handleSearch = (query) => {
        setSearchQuery(query);
        // No API call needed here - filtering happens in useMemo below
    };

    // 🏷️ Category & Search Filter Logic (Memoized)
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Filter by Category
            let matchCategory = false;
            if (selectedCategory === "All") matchCategory = true;
            else if (selectedCategory === "Cleanse") matchCategory = product.category === "Cleanser";
            else if (selectedCategory === "Treat") matchCategory = ["Treat", "Essence", "Repair"].includes(product.category);
            else if (selectedCategory === "Moisturize") matchCategory = ["Moisturizer", "Mask", "Moisturize"].includes(product.category);
            else if (selectedCategory === "Protect") matchCategory = product.category === "Protect";
            else matchCategory = true;

            // 2. Filter by Search Query
            const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // 🔢 Derived Product Lists
    const newArrivals = products.filter(p => p.isNew);
    const hotDeals = products.filter(p => p.oldPrice && p.oldPrice > p.price);
    const bestSellers = products.filter(p => p.rating >= 4.8);

    if (error) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

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

                {/* 🏷️ Hero Section */}
                {loading ? (
                    <SkeletonLoader type="banner" />
                ) : (
                    <HeroSlider banners={banners} />
                )}

                {/* 🧴 Categories */}
                {loading ? (
                    <SkeletonLoader type="category" />
                ) : (
                    <CategoryRail
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                )}

                {/* 🎁 Mini Voucher Banner */}
                {!loading && !searchQuery && <OfferBanner />}

                {/* 🔥 Hot Deals */}
                {!loading && !searchQuery && hotDeals.length > 0 && (
                    <ProductRail
                        title="Hot Deals"
                        subtitle="Limited Time"
                        icon={Flame}
                        iconColor="text-orange-500"
                        products={hotDeals}
                        bgClass="bg-orange-50/50"
                        borderClass="border-orange-100"
                        variant="deals"
                    />
                )}

                {/* ❤️ Best Sellers */}
                {!loading && !searchQuery && bestSellers.length > 0 && (
                    <ProductRail
                        title="Best Sellers"
                        subtitle="Favorites"
                        icon={Heart}
                        iconColor="text-pink-500"
                        products={bestSellers}
                        bgClass="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50"
                        variant="bestsellers"
                    />
                )}

                {/* ✨ New Arrivals */}
                {!loading && !searchQuery && newArrivals.length > 0 && (
                    <ProductRail
                        title="New Arrivals"
                        subtitle="Just Dropped"
                        icon={Sparkles}
                        iconColor="text-blue-500"
                        products={newArrivals}
                        bgClass="bg-[#F0F9FF]"
                        borderClass="border-blue-50"
                        variant="new"
                    />
                )}

                {/* 🏆 Brands We Love */}
                {!loading && !searchQuery && <BrandsRail brands={BRANDS} />}

                {/* 💬 Lovely Reviews */}
                {!loading && !searchQuery && <ReviewsRail reviews={REVIEWS} />}

                {/* 💌 Newsletter */}
                {!loading && !searchQuery && <Newsletter />}

                {/* ✨ Main Product Grid (Search Results or Recommended) */}
                <div className="mt-8 px-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                            {searchQuery ? 'Search Results' : 'Recommended For You'}
                        </h3>
                        {!searchQuery && (
                            <Link // Ensure Link is imported or available!
                                to="/shop"
                                className="px-3 py-1 bg-white text-[#FFB040] text-xs font-semibold rounded-full shadow-sm border border-gray-100 hover:bg-[#FFB040] hover:text-white transition-all"
                            >
                                Shop All
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <SkeletonLoader count={8} />
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50 col-span-full">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                            <p className="text-gray-400">
                                {selectedCategory === "All" ? "No products found." : `No items in ${selectedCategory}`}
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
            </div>
        </div>
    );
}
