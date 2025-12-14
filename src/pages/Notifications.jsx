import React, { useState } from "react";
import { Bell, Package, Tag, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
    const navigate = useNavigate();

    // Mock notifications data matching Layout.jsx dummy data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "welcome",
            title: "Welcome to Lovely Boutique! 🎀",
            message: "Thanks for joining our community. Here's a 10% off voucher for your first order.",
            time: "Just now",
            read: false,
            icon: Bell,
            color: "bg-pink-100 text-pink-500",
            link: "/vouchers"
        },
        {
            id: 2,
            type: "order",
            title: "Order #1234 on the way 🚚",
            message: "Good news! Your order has been shipped and will arrive in 2-3 days.",
            time: "2 hours ago",
            read: false,
            icon: Package,
            color: "bg-blue-100 text-blue-500",
            link: "/orders/1234"
        },
        {
            id: 3,
            type: "promo",
            title: "New Collection Drop: Phka Blush 🌸",
            message: "Discover our new organic blush collection inspired by Cambodian flowers.",
            time: "1 day ago",
            read: true,
            icon: Tag,
            color: "bg-purple-100 text-purple-500",
            link: "/shop"
        }
    ]);

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleNotificationClick = (notif) => {
        // Mark as read when clicked
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));

        // Navigate if link exists
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500 mt-1 text-sm">Stay updated with your orders and exclusives</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm font-bold text-pink-500 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        >
                            <CheckCircle size={16} />
                            <span className="hidden sm:inline">Mark all as read</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-5 md:px-6 py-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {notifications.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-6 flex gap-5 hover:bg-gray-50 transition-colors cursor-pointer group ${!notif.read ? 'bg-pink-50/30' : ''}`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <notif.icon size={20} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold text-gray-900 group-hover:text-pink-600 transition-colors ${!notif.read ? 'text-pink-600' : ''}`}>
                                                    {notif.title}
                                                </h3>
                                                <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                                                    <Clock size={12} />
                                                    {notif.time}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                                {notif.message}
                                            </p>
                                            {!notif.read && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6 h-full flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
                            <p className="text-gray-500">We'll let you know when something important arrives.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
