import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag, User, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function BottomNav() {
    const { totalItems } = useCart();
    const { wishlistCount } = useWishlist();

    const navItems = [
        { to: "/home", icon: <Home size={24} />, label: "Home" },
        { to: "/shop", icon: <Search size={24} />, label: "Shop" },
        {
            to: "/cart",
            icon: <ShoppingBag size={24} />,
            label: "Cart",
            badge: totalItems
        },
        {
            to: "/wishlist",
            icon: <Heart size={24} />,
            label: "Wishlist",
            badge: wishlistCount
        },
        { to: "/profile", icon: <User size={24} />, label: "Profile" }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 md:hidden z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => `
              relative flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-90
              ${isActive ? "text-pink-500" : "text-gray-400 hover:text-gray-600"}
            `}
                    >
                        <div className="relative">
                            {item.icon}
                            {/* Challenge: Badge logic */}
                            {item.badge > 0 && (
                                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
