import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell, Shield, ScrollText, Ticket, ChevronRight, HelpCircle, Heart, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const sections = [
        {
            title: "Account",
            items: [
                { icon: <Bell size={20} />, label: "Notifications", path: "/notifications", desc: "Manage your alerts" },
                { icon: <Heart size={20} />, label: "My Wishlist", path: "/wishlist", desc: "See your savory saves" },
            ]
        },
        {
            title: "Support & Info",
            items: [
                { icon: <Ticket size={20} />, label: "How to use Voucher?", path: "/voucher-guide", desc: "Guide to savings" },
                { icon: <ScrollText size={20} />, label: "Terms & Conditions", path: "/terms", desc: "Our contract with you" },
                { icon: <HelpCircle size={20} />, label: "About Girly Shop", path: "/about", desc: "Learn our story" },
                { icon: <Shield size={20} />, label: "Privacy Policy", path: "/terms", desc: "How we protect data" },
            ]
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Not Logged In</h2>
                <p className="text-gray-500 mb-6">Please login to view your settings and profile.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-colors"
                >
                    Login Now
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans relative">
            {/* Header (Mobile Only) */}
            <div className="md:hidden bg-white px-6 py-6 border-b border-gray-100 sticky top-0 z-30">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your account and preferences</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto px-5 md:px-6 py-6 md:py-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* 👈 Left Sidebar: Profile Card */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-md mb-4">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-pink-400 font-serif">{user.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <h2 className="font-bold text-xl text-gray-900">{user.username}</h2>
                                <p className="text-sm text-gray-500 mb-6">{user.email}</p>

                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full py-2.5 rounded-xl border border-pink-100 text-pink-500 font-medium hover:bg-pink-50 transition-colors mb-2"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="w-full py-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 👉 Right Content: Settings Grid */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-8">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 + 0.2 }}
                            >
                                <h3 className="font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                                    {section.title === "Account" ? <User size={18} className="text-pink-500" /> : <SettingsIcon size={18} className="text-pink-500" />}
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.items.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => navigate(item.path)}
                                            className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block group-hover:text-pink-600 transition-colors">{item.label}</span>
                                                <span className="text-xs text-gray-400 font-medium">{item.desc}</span>
                                            </div>
                                            <ChevronRight size={18} className="ml-auto text-gray-200 group-hover:text-pink-400 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* Mobile Logout (Hidden on Desktop) */}
                        <div className="md:hidden mt-8">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full bg-white border border-rose-100 text-rose-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors shadow-sm"
                            >
                                <LogOut size={20} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4">
                                <LogOut size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h3>
                            <p className="text-gray-500 mb-6">Are you sure you want to sign out of your account?</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-200 hover:bg-rose-600"
                                >
                                    Log Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
