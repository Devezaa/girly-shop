import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sparkles, Droplet, SprayCan, Gift,
    Wind, Sun, PenTool, LayoutGrid
} from "lucide-react";

const categories = [
    { id: "all", label: "Show All", icon: <LayoutGrid size={20} /> },
    { id: "perfume", label: "Perfume", icon: <SprayCan size={20} /> },
    { id: "moisturizer", label: "Moisturizer", icon: <Droplet size={20} /> },
    { id: "shampoo", label: "Shampoo", icon: <Sparkles size={20} /> }, // Placeholder icon
    { id: "giftcards", label: "Gift Cards", icon: <Gift size={20} /> },
    { id: "toner", label: "Toner", icon: <Wind size={20} /> },
    { id: "faceoils", label: "Face oils", icon: <Droplet size={20} className="fill-amber-400" /> },
    { id: "foundation", label: "Foundation", icon: <Sun size={20} /> },
    { id: "suncare", label: "Suncare", icon: <Sun size={20} /> },
    { id: "tools", label: "Tools", icon: <PenTool size={20} /> },
];

export default function CategorySelection() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(["all"]);

    const toggleCategory = (id) => {
        if (id === "all") {
            setSelected(["all"]);
            return;
        }

        // If 'all' was selected, unselect it when choosing others
        let newSelected = selected.filter(item => item !== "all");

        if (selected.includes(id)) {
            newSelected = newSelected.filter(item => item !== id);
        } else {
            newSelected.push(id);
        }

        if (newSelected.length === 0) newSelected = ["all"];

        setSelected(newSelected);
    };

    const handleContinue = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-[#FFFBF2] px-6 py-10 flex flex-col justify-between">
            {/* 🌸 Header Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10 text-center"
            >
                <h1 className="font-serif text-3xl text-gray-800 mb-3 font-semibold">
                    Choose your favourite<br />category
                </h1>
                <p className="text-gray-400 font-light text-sm">
                    You can choose more than one
                </p>
            </motion.div>

            {/* 🧬 Category Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex-1 my-10"
            >
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat, index) => {
                        const isSelected = selected.includes(cat.id);
                        return (
                            <motion.button
                                key={cat.id}
                                viewport={{ once: true }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                onClick={() => toggleCategory(cat.id)}
                                className={`
                  flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 shadow-sm
                  ${isSelected
                                        ? "bg-[#6B9C96] text-white shadow-md ring-2 ring-[#6B9C96]/20"
                                        : "bg-white text-gray-500 hover:bg-white/80"}
                `}
                            >
                                <span className={`${isSelected ? "text-white" : "text-rose-400"}`}>
                                    {cat.icon}
                                </span>
                                <span className="font-medium text-sm">{cat.label}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* 🦶 Footer Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 space-y-4"
            >
                <button
                    onClick={handleContinue}
                    className="w-full bg-[#90A583] hover:bg-[#7e9271] text-white font-medium py-4 rounded-full shadow-lg shadow-[#90A583]/30 transition-all active:scale-95"
                >
                    Continue
                </button>

                <button
                    onClick={handleContinue}
                    className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
                >
                    Skip for now
                </button>
            </motion.div>
        </div>
    );
}
