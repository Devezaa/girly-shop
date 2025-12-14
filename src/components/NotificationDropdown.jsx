import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Welcome to Lovely Boutique! 🎀", time: "Just now" },
        { id: 2, text: "Your order #1234 is on the way 🚚", time: "2 hours ago" },
        { id: 3, text: "New Collection Drop: Phka Blush 🌸", time: "1 day ago" }
    ]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-500 hover:text-rose-500 transition-colors relative p-1"
                aria-label="Notifications"
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
    );
}
