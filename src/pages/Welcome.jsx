import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Hexagon } from "lucide-react";

export default function Welcome() {
    // Mouse move effect (optimized for performance)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundX = useTransform(mouseX, (value) => value * -1);
    const backgroundY = useTransform(mouseY, (value) => value * -1);

    useEffect(() => {
        if (window.innerWidth <= 768) return;

        const handleMouseMove = (e) => {
            mouseX.set((e.clientX / window.innerWidth) * 20);
            mouseY.set((e.clientY / window.innerHeight) * 20);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col font-sans bg-[#1a0b0b] text-white">

            {/* 🖼️ Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute inset-0"
                    style={{ x: backgroundX, y: backgroundY }}
                    animate={{ scale: 1.1 }}
                    transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                >
                    <img
                        src="/welcome-premium.png"
                        onError={(e) => e.currentTarget.src = "/login-premium-products.png"}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b0b] via-[#1a0b0b]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-[#FFB040]/5 mix-blend-overlay"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#FFB040]/30 bg-[#FFB040]/10 backdrop-blur-md mb-8"
                >
                    <Sparkles size={16} className="text-[#FFB040]" />
                    <span className="text-[#FFB040] text-sm font-medium tracking-widest uppercase">Premium Fashion Destination</span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-serif font-medium leading-[1.1] mb-8"
                >
                    Discover <br />
                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFB040] to-[#ffcf87]">Elegance</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/60 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12"
                >
                    Curated luxury fashion and beauty essentials for the modern muse.
                    Step into a world where style meets sophistication.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <Link
                        to="/login"
                        className="group relative w-full sm:w-48 py-4 bg-[#FFB040] text-black font-bold text-base rounded-2xl shadow-[0_0_20px_-5px_#FFB040] hover:shadow-[0_0_30px_-5px_#FFB040] hover:-translate-y-1 transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Shopping <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    <Link
                        to="/register"
                        className="w-full sm:w-48 py-4 bg-white/5 border border-white/10 text-white font-medium text-base rounded-2xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all backdrop-blur-md"
                    >
                        Create Account
                    </Link>
                </motion.div>

                {/* Footer / Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 text-white/30"
                >
                    <div className="flex items-center gap-2">
                        <Hexagon size={14} /> <span>Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart size={14} /> <span>Curated Items</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
