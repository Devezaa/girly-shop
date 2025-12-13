import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Welcome() {
    return (

        <div className="min-h-screen w-full bg-[#FDFBF7] relative overflow-hidden font-sans flex flex-col items-center justify-center p-6 py-12 md:py-6">

            {/* 🎨 Ambient Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-rose-100/40 rounded-full blur-[60px] md:blur-[120px] pointer-events-none md:animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-100/40 rounded-full blur-[60px] md:blur-[120px] pointer-events-none md:animate-pulse-slow"></div>

            {/* 🖼️ Main Content Container */}
            <div className="relative w-full max-w-6xl md:h-full md:max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-10">

                {/* Visual Side (Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative h-[45vh] md:h-full w-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl group border-[6px] md:border-[8px] border-white/50"
                >
                    <img
                        src="/welcome-premium.png"
                        alt="Fashion Welcome"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-in-out group-hover:scale-110 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </motion.div>

                {/* Text Content (Right) */}
                <div className="flex flex-col items-start text-left space-y-6 md:space-y-8 pb-8 md:pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-rose-500 font-medium text-xs md:text-sm mb-4 md:mb-6 border border-rose-100/50">
                            <Sparkles size={14} className="md:w-4 md:h-4" />
                            <span>The #1 Fashion Destination</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium text-gray-900 leading-[1.1] mb-4 md:mb-6">
                            Discover <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 italic">Elegance</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-xl font-light leading-relaxed max-w-md">
                            Curated fashion and beauty essentials for the modern muse. Step into a world of style.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto"
                    >
                        <Link
                            to="/login"
                            className="group px-8 py-3.5 md:py-4 bg-gray-900 text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:bg-black hover:scale-105 transition-all"
                        >
                            Start Shopping
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-3.5 md:py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-medium text-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all"
                        >
                            Register
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
