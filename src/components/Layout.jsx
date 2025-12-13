import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([
        { id: 1, text: "Welcome to Lovely Boutique! 🎀", time: "Just now" },
        { id: 2, text: "Your order #1234 is on the way 🚚", time: "2 hours ago" },
        { id: 3, text: "New Collection Drop: Phka Blush 🌸", time: "1 day ago" }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* 🖥️ Desktop Header (Fixed) */}
            <header className="hidden md:flex px-6 py-4 items-center justify-between bg-[#FFFBF2] fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100 h-[72px]">
                {/* Logo & Nav */}
                <div className="flex items-center gap-12">
                    <Link to="/home" className="text-center md:text-left group">
                        <h1 className="font-serif font-bold text-2xl leading-none text-gray-800 group-hover:text-[#FFB040] transition-colors">Lovely<br />Boutique</h1>
                    </Link>

                    <nav className="flex items-center gap-8">
                        <Link to="/home" className={`font-medium transition-colors ${location.pathname === '/home' ? 'text-[#FFB040]' : 'text-gray-600 hover:text-[#FFB040]'}`}>Home</Link>
                        <Link to="/vouchers" className={`font-medium transition-colors ${location.pathname === '/vouchers' ? 'text-[#FFB040]' : 'text-gray-600 hover:text-[#FFB040]'}`}>Vouchers</Link>
                        <Link to="/wishlist" className={`font-medium transition-colors ${location.pathname === '/wishlist' ? 'text-[#FFB040]' : 'text-gray-600 hover:text-[#FFB040]'}`}>Wishlist</Link>
                        <Link to="/order-details" className={`font-medium transition-colors ${location.pathname === '/order-details' ? 'text-[#FFB040]' : 'text-gray-600 hover:text-[#FFB040]'}`}>Orders</Link>
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin/products" className={`font-medium transition-colors ${location.pathname === '/admin/products' ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>
                                    Products
                                </Link>
                                <Link to="/admin/banners" className={`font-medium transition-colors ${location.pathname === '/admin/banners' ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>
                                    Banners
                                </Link>
                                <Link to="/admin/vouchers" className={`font-medium transition-colors ${location.pathname === '/admin/vouchers' ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>
                                    Vouchers
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex gap-6 items-center">

                    {/* 🔔 Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="text-gray-500 hover:text-rose-500 transition-colors relative p-1"
                        >
                            <Bell size={24} />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in-down">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800">Notifications</h3>
                                    <button onClick={() => setNotifications([])} className="text-xs text-rose-500 hover:underline">Clear all</button>
                                </div>
                                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-rose-500">
                                                    <Bell size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-800 font-medium leading-tight">{notif.text}</p>
                                                    <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Avatar */}
                    <Link to="/settings">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#FFB040] transition-all">
                            <img src="/user-avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                </div>
            </header>

            {/* 📱 Content Area (Push down for fixed header on desktop) */}
            <main className="relative w-full flex-1 md:pt-[72px]">
                <Outlet />
            </main>

            {/* 🦶 Footer (Visible on all screens, matches theme) */}
            <Footer />

            {/* 📱 Mobile Bottom Nav (Global, but hidden on desktop via CSS inside the component) */}
            <BottomNav />

            {/* 💬 Live Chat Widget */}
            <ChatWidget />
        </div>
    );
};

export default Layout;
