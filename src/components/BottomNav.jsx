import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Gift, User } from "lucide-react";

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { id: "home", icon: <Home size={24} />, path: "/home" },
        { id: "wishlist", icon: <Heart size={24} />, path: "/wishlist" },
        { id: "voucher", icon: <Gift size={24} />, path: "/vouchers" },
        { id: "profile", icon: <User size={24} />, path: "/settings" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-6 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-[#FFB040] scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {/* Icon Status */}
                        <div className={`transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`}>
                            {React.cloneElement(item.icon, {
                                fill: isActive ? "currentColor" : "none",
                                strokeWidth: isActive ? 2.5 : 2
                            })}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
