import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Mouse move effect for background parallax
    // Mouse move effect for background parallax - Optimized with MotionValues to avoid re-renders
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Transform values for the background image (inverse movement)
    const backgroundX = useTransform(mouseX, (value) => value * -1);
    const backgroundY = useTransform(mouseY, (value) => value * -1);

    useEffect(() => {
        // Disable parallax on mobile to save battery and performance
        if (window.innerWidth <= 768) return;

        const handleMouseMove = (e) => {
            // Direct update to motion value without triggering React render
            mouseX.set((e.clientX / window.innerWidth) * 20);
            mouseY.set((e.clientY / window.innerHeight) * 20);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Add detailed artificial delay for smooth UX
        setTimeout(async () => {
            const res = await login(email, password);
            if (res.success) {
                navigate("/home");
            } else {
                setError(res.message);
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-sans bg-[#1a0b0b]">

            {/* 🖼️ Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        x: backgroundX,
                        y: backgroundY
                    }}
                    animate={{
                        scale: 1.1,
                    }}
                    transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                >
                    <img
                        src="/login-premium-products.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </motion.div>
                {/* 🎨 Dreamy Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[#FFB040]/10 mix-blend-overlay"></div>

                {/* Animated Particles/Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[150px] animate-pulse delay-1000"></div>
            </div>

            {/* 📦 Main Container */}
            <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full pt-16 lg:pt-0">

                {/* ✨ Left Side: Brand Statement (Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:block w-1/2 p-12 text-white"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-[#FFB040]"></div>
                        <span className="uppercase tracking-[0.3em] text-sm font-medium text-[#FFB040]">Premium Boutique</span>
                    </div>
                    <h1 className="text-7xl font-serif font-medium leading-[1.1] mb-8">
                        Redefine Your <br />
                        <span className="italic text-[#FFB040] relative">
                            Elegance
                            <Sparkles className="absolute -top-4 -right-10 text-white/50 animate-bounce" size={32} />
                        </span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-md font-light leading-relaxed backdrop-blur-sm bg-black/10 p-4 rounded-xl border border-white/5">
                        Discover a curated collection of luxury fashion and beauty essentials designed to highlight your unique radiance.
                    </p>
                </motion.div>

                {/* 📝 Right Side: Glass Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-full max-w-[480px] lg:mr-12"
                >
                    <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/20 overflow-hidden">

                        {/* Glass Gloss Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[50px]"></div>

                        <div className="text-center mb-10 relative z-10">
                            <h2 className="font-serif text-4xl text-white mb-2 tracking-wide">Welcome Back</h2>
                            <p className="text-white/60 font-light text-sm">Sign in to access your exclusive wishlist.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2 backdrop-blur-md"
                                    >
                                        <span className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-[10px] text-white font-bold">!</span>
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-5">
                                <div className="group space-y-2">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Email</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium backdrop-blur-sm"
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Password</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-4 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium tracking-wider backdrop-blur-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-1 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="w-5 h-5 border border-white/30 rounded-md transition-all peer-checked:bg-[#FFB040] peer-checked:border-[#FFB040] bg-white/5"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-black hidden peer-checked:block pointer-events-none left-[3px] top-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-white/60 group-hover:text-white/90 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-[#FFB040] font-medium hover:text-[#fff] transition-colors hover:underline underline-offset-4">Forgot Password?</a>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-[#FFB040] hover:bg-[#ffbf60] text-black font-bold text-lg py-4 rounded-2xl shadow-lg shadow-[#FFB040]/20 hover:shadow-[#FFB040]/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={20} className="stroke-[3px]" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Social Divider */}
                        <div className="mt-8 mb-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-white/40 font-medium tracking-widest bg-[#2a1e1e] rounded px-4">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-4">
                            {[
                                { icon: 'G', label: 'Google' },
                                { icon: '🍎', label: 'Apple' },
                                { icon: 'f', label: 'Facebook', color: 'text-blue-400' }
                            ].map((social, idx) => (
                                <button
                                    key={idx}
                                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm group"
                                >
                                    <span className={`text-xl font-medium ${social.color || 'text-white'} group-hover:rotate-6 transition-transform block`}>
                                        {social.icon}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-white/50 text-sm">
                                Don't have an account? <Link to="/register" className="text-[#FFB040] font-bold hover:text-white transition-colors ml-1">Create account</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
