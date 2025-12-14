import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        // TODO: Implement actual API call
        console.log("Subscribing email:", email);
        alert(`Thanks for subscribing! 🎀\nWe've sent a confirmation to ${email}`);
        setEmail("");
    };

    return (
        <div className="mt-10 px-5 mb-8">
            <div className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-3xl p-6 relative overflow-hidden text-center">
                <Sparkles className="absolute top-4 right-4 text-white/40" size={40} />
                <h3 className="text-xl font-bold text-rose-900 mb-2">Stay in the Loop 🎀</h3>
                <p className="text-rose-800/80 text-sm mb-6">Get the latest trends and exclusive deals sent to your inbox.</p>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-4 pr-12 py-3.5 bg-white/90 backdrop-blur rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-rose-300 transition-shadow"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-md hover:bg-rose-600 transition-colors"
                        aria-label="Subscribe"
                    >
                        <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
