import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const res = await register(formData.username, formData.email, formData.password);
        if (res.success) {
            navigate("/home");
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBEF] flex items-center justify-center p-6 relative overflow-hidden">
            {/* ... gradients ... */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none transform -translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-[80px] -z-10 opacity-40 pointer-events-none transform translate-x-1/4 translate-y-1/4"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/30 backdrop-blur-sm rounded-3xl p-8 md:bg-white md:shadow-xl md:p-12 border border-white/50"
            >
                {/* 📝 Header */}
                <div className="text-center mb-10">
                    <h1 className="font-serif font-bold text-4xl text-[#FFB040] mb-2 tracking-wide">Register now</h1>
                    <p className="text-[#F8A488] font-light text-base max-w-[200px] mx-auto leading-tight">And get a special voucher only for you!</p>
                </div>

                {/* 📝 Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center font-bold bg-red-100 p-2 rounded-xl">{error}</p>}

                    <div className="bg-white rounded-2xl px-6 py-2 border border-rose-100 shadow-sm focus-within:ring-2 focus-within:ring-[#FFB040]/50 transition-all">
                        <label className="block text-rose-300 text-xs font-medium mb-0">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Jandoe@mail.co.id"
                            className="w-full text-gray-700 placeholder:text-gray-300 focus:outline-none text-base font-medium py-1"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-2 border border-rose-100 shadow-sm focus-within:ring-2 focus-within:ring-[#FFB040]/50 transition-all">
                        <label className="block text-rose-300 text-xs font-medium mb-0">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className="w-full text-gray-700 placeholder:text-gray-300 focus:outline-none text-base font-medium py-1"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-2 border border-rose-100 shadow-sm focus-within:ring-2 focus-within:ring-[#FFB040]/50 transition-all relative">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <label className="block text-rose-300 text-xs font-medium mb-0">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full text-gray-700 placeholder:text-gray-300 focus:outline-none text-base font-medium py-1 tracking-widest"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-rose-300 hover:text-rose-400 p-2"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-2 border border-rose-100 shadow-sm focus-within:ring-2 focus-within:ring-[#FFB040]/50 transition-all relative">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <label className="block text-rose-300 text-xs font-medium mb-0">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full text-gray-700 placeholder:text-gray-300 focus:outline-none text-base font-medium py-1 tracking-widest"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-rose-300 hover:text-rose-400 p-2"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full bg-[#FFB040] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Register
                        </button>
                    </div>
                </form>

                {/* 🔗 Social Auth */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-12 bg-gray-300/50"></div>
                        <span className="text-gray-400 text-xs font-light">Or sign in with</span>
                        <div className="h-[1px] w-12 bg-gray-300/50"></div>
                    </div>
                    <div className="flex justify-center gap-6">
                        <button className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
                            <span className="text-xl">G</span>
                        </button>
                        <button className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
                            <span className="text-xl">🍎</span>
                        </button>
                        <button className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
                            <span className="text-xl text-blue-600">f</span>
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-[#FFB040] font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
