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
                        src="https://res.cloudinary.com/daqrcfqrt/image/upload/v1765713211/girly-shop/ui/login-premium-products_wuyeda.jpg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </motion.div>
                {/* 🎨 Dreamy Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[#FFB040]/10 mix-blend-overlay"></div>

                {/* Animated Particles/Orbs (Hidden on Mobile) */}
                <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[150px] animate-pulse delay-1000"></div>
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
                    <p className="text-lg text-white/70 max-w-md font-light leading-relaxed md:backdrop-blur-sm bg-black/10 p-4 rounded-xl border border-white/5">
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
                    <div className="relative md:backdrop-blur-xl bg-[#1a0b0b] md:bg-white/10 dark:bg-black/20 border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/20 overflow-hidden">

                        {/* Glass Gloss Effect (Hidden on mobile) */}
                        <div className="hidden md:block absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[50px]"></div>

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
                                        className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2 md:backdrop-blur-md"
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
                                            className="w-full pl-12 pr-4 py-4 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium md:backdrop-blur-sm"
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
                                            className="w-full pl-12 pr-12 py-4 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium tracking-wider md:backdrop-blur-sm"
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
                        <div className="mt-8 mb-6 flex items-center justify-center gap-4">
                            <div className="h-[1px] w-full bg-white/10"></div>
                            <span className="text-xs uppercase text-white/40 font-medium tracking-widest whitespace-nowrap">Or continue with</span>
                            <div className="h-[1px] w-full bg-white/10"></div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-4">
                            <button
                                aria-label="Sign in with Google"
                                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300 md:backdrop-blur-sm group"
                            >
                                <svg className="w-6 h-6 text-white group-hover:text-[#FFB040] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>

                            <button
                                aria-label="Sign in with Apple"
                                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300 md:backdrop-blur-sm group"
                            >
                                <svg className="w-6 h-6 text-white group-hover:text-white/90 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.8.07 3.04.88 3.85 1.96-3.41 1.85-2.91 5.91.43 7.35-.61 1.68-1.57 3.42-2.73 4.46zM12.03 7.25c-.25-2.19 1.62-4.04 3.55-4.25.32 2.37-2.31 4.42-3.55 4.25z" />
                                </svg>
                            </button>

                            <button
                                aria-label="Sign in with Facebook"
                                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300 md:backdrop-blur-sm group"
                            >
                                <svg className="w-6 h-6 text-blue-500 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
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
