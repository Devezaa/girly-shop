import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BrandsRail({ brands = [] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <div className="mt-8 px-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Brands We Love</h3>
                <Link to="/shop" className="text-gray-400 text-sm hover:text-[#FFB040] transition-colors">View All</Link>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-6 md:mx-0 md:px-0 md:overflow-visible">
                {brands.map((brand, idx) => (
                    <motion.div
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        className="min-w-[80px] h-[80px] bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer snap-center"
                    >
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                    e.target.nextSibling.classList.remove('hidden');
                                }}
                            />
                            {/* Fallback if image fails */}
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 text-sm font-bold hidden">
                                {brand.name[0]}
                            </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">{brand.name}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
