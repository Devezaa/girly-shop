import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import CartDrawer from "./CartDrawer";
import NotificationDropdown from "./NotificationDropdown"; // Added Import
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Layout = () => {
    const { user } = useAuth();
    const { totalItems, openCart, isCartOpen, closeCart } = useCart(); // Get cart controls
    const location = useLocation();

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
                                <Link to="/admin/chat" className={`font-medium transition-colors ${location.pathname === '/admin/chat' ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>
                                    Chat
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex gap-6 items-center">

                    {/* 🛍️ Cart Button */}
                    <button
                        onClick={openCart}
                        className="relative p-1 text-gray-500 hover:text-[#FFB040] transition-colors"
                    >
                        <ShoppingBag size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* 🔔 Notifications */}
                    <NotificationDropdown />

                    {/* Profile Avatar */}
                    <Link to="/settings">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#FFB040] transition-all">
                            <img src="https://res.cloudinary.com/daqrcfqrt/image/upload/v1765713212/girly-shop/ui/user-avatar_ve2cpa.jpg" alt="Profile" className="w-full h-full object-cover" />
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

            {/* 🛒 Cart Drawer */}
            <CartDrawer open={isCartOpen} onClose={closeCart} />

            {/* 💬 Live Chat Widget */}
            <ChatWidget />
        </div>
    );
};

export default Layout;
