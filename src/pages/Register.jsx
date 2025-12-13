import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Mouse move effect for background parallax
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        setTimeout(async () => {
            const res = await register(formData.username, formData.email, formData.password);
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
                    style={{ x: backgroundX, y: backgroundY }}
                    animate={{ scale: 1.1 }}
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
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[150px] animate-pulse delay-1000"></div>
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
                        <span className="uppercase tracking-[0.3em] text-sm font-medium text-[#FFB040]">Join The Club</span>
                    </div>
                    <h1 className="text-7xl font-serif font-medium leading-[1.1] mb-8">
                        Unlock Exclusive <br />
                        <span className="italic text-[#FFB040] relative">
                            Benefits
                            <Sparkles className="absolute -top-4 -right-10 text-white/50 animate-bounce" size={32} />
                        </span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-md font-light leading-relaxed backdrop-blur-sm bg-black/10 p-4 rounded-xl border border-white/5">
                        Create an account to enjoy personalized recommendations, faster checkout, and member-only offers.
                    </p>
                </motion.div>

                {/* 📝 Right Side: Glass Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-full max-w-[480px] lg:mr-12 my-8"
                >
                    <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/20 overflow-hidden">

                        {/* Glass Gloss Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[50px]"></div>

                        <div className="text-center mb-8 relative z-10">
                            <h2 className="font-serif text-3xl text-white mb-2 tracking-wide">Create Account</h2>
                            <p className="text-white/60 font-light text-sm">Join us for a premium shopping experience.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
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

                            <div className="space-y-4">
                                <div className="group space-y-1">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Username</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium backdrop-blur-sm"
                                            placeholder="Jane Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Email</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium backdrop-blur-sm"
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Password</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium tracking-wider backdrop-blur-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group space-y-1">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-2">Confirm Password</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-white/40 group-focus-within:text-[#FFB040] transition-colors" size={18} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3 bg-black/20 text-white placeholder:text-white/30 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:border-[#FFB040]/50 focus:ring-1 focus:ring-[#FFB040]/30 transition-all font-medium tracking-wider backdrop-blur-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-[#FFB040] hover:bg-[#ffbf60] text-black font-bold text-lg py-4 rounded-2xl shadow-lg shadow-[#FFB040]/20 hover:shadow-[#FFB040]/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Create Account
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
                                <span className="text-white/40 font-medium tracking-widest bg-[#2a1e1e] rounded px-4">Or sign up with</span>
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
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm group"
                                >
                                    <span className={`text-lg font-medium ${social.color || 'text-white'} group-hover:rotate-6 transition-transform block`}>
                                        {social.icon}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-white/50 text-sm">
                                Already have an account? <Link to="/login" className="text-[#FFB040] font-bold hover:text-white transition-colors ml-1">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
