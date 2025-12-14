import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OfferBanner() {
    return (
        <div className="px-5 mt-6 mb-2">
            <Link to="/vouchers" aria-label="Claim new member discount">
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-pink-200"
                >
                    <div>
                        <h4 className="text-white font-bold text-lg">New Member?</h4>
                        <p className="text-white/90 text-sm">Claim your <span className="font-extrabold text-yellow-200">30% OFF</span> here!</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <ArrowRight className="text-white" size={20} />
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
