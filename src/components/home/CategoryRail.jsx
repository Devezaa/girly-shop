import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryRail({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div className="px-5 mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-900 rounded-full"></div>
                    <h3 className="font-serif text-gray-900 text-xl font-bold tracking-tight">Explore Collections</h3>
                </div>
            </div>

            <div className="flex gap-3 justify-start overflow-x-auto no-scrollbar pb-4 px-1 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-5 md:gap-6 md:justify-center">
                {/* All Button */}
                <motion.button
                    onClick={() => onSelectCategory("All")}
                    className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all duration-300 group snap-center focus:outline-none focus:ring-0
                        ${selectedCategory === 'All'
                            ? 'bg-gray-900 text-white border-transparent shadow-md'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedCategory === 'All' ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                        <SlidersHorizontal size={18} strokeWidth={1.5} className={selectedCategory === 'All' ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <span className="text-xs font-medium">All</span>
                </motion.button>

                {categories.map((cat, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => onSelectCategory(cat.name)}
                        className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all duration-300 group snap-center focus:outline-none focus:ring-0
                            ${selectedCategory === cat.name
                                ? 'bg-gray-900 text-white border-transparent shadow-md'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                            }`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedCategory === cat.name ? 'bg-white/20' : cat.iconBgClass}`}>
                            <cat.icon size={18} strokeWidth={1.5} className={selectedCategory === cat.name ? 'text-white' : cat.iconColorClass} />
                        </div>
                        <span className={`text-xs font-medium ${selectedCategory === cat.name ? 'text-white' : 'text-gray-500 group-hover:text-gray-800'}`}>{cat.name}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
