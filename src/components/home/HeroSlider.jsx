import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSlider({ banners }) {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // 🎞️ Auto-Play Slider (Pauses on Hover)
    useEffect(() => {
        if (!banners || banners.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners, isPaused]);

    if (!banners || banners.length === 0) return null;

    return (
        <div
            className="mt-4 px-5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full h-[320px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-gray-100 group">
                {/* Slides Container */}
                <div className="w-full h-full relative">
                    <AnimatePresence>
                        <motion.div
                            key={currentBanner}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={banners[currentBanner].src}
                                alt={banners[currentBanner].title || "Banner"}
                                className="w-full h-full object-cover object-center"
                                fetchPriority="high"
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
                                        {banners[currentBanner].title}
                                    </h2>
                                    <p className="text-white/90 text-sm md:text-lg mb-6 drop-shadow-sm font-light">
                                        {banners[currentBanner].subtitle}
                                    </p>
                                    <Link to="/shop">
                                        <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center gap-2 md:bg-white/90 md:backdrop-blur-sm">
                                            {banners[currentBanner].btnText || "Shop Now"} <ArrowRight size={16} />
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
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
    );
}
