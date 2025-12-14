import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from '../config';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/banners`)
            .then(res => res.json())
            .then(data => {
                // Filter out banners without valid source if necessary, or use placeholders
                const validBanners = data.filter(b => b.src).map(b => ({
                    ...b,
                    // Ensure full URL if it's a relative path (though migration made them Cloudinary)
                    // If it is local '/banners/...', it works fine if in public.
                    // If it is Cloudinary, it starts with http.
                }));
                // Fallback if no banners
                if (validBanners.length === 0) {
                    setBanners([{
                        id: 0,
                        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
                        title: "Welcome to Lovely Boutique",
                        subtitle: "Discover your true style",
                        btnText: "Shop Now"
                    }]);
                } else {
                    setBanners(validBanners);
                }
            })
            .catch(err => console.error("Failed to load banners", err));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    if (banners.length === 0) return <div className="h-[50vh] bg-gray-100 animate-pulse rounded-b-3xl" />;

    return (
        <div className="relative h-[28rem] md:h-[32rem] w-full overflow-hidden rounded-b-[3rem] shadow-sm group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${banners[currentIndex].src})` }}
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-10">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                        >
                            Featured Collection
                        </motion.span>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg leading-tight"
                        >
                            {banners[currentIndex].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-gray-100 mb-8 max-w-md drop-shadow-md font-light"
                        >
                            {banners[currentIndex].subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link
                                to="/shop"
                                className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold shadow-lg hover:bg-pink-50 transition-colors active:scale-95"
                            >
                                {banners[currentIndex].btnText || "Shop Now"}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls (Hidden on mobile usually, but good for UX) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}
