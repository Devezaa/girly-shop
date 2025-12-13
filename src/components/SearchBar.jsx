import { Search } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 🌸 Lovely Boutique SearchBar
 * Soft glassmorphism design for modern girly style.
 */
export default function SearchBar({
  q,
  setQ,
  placeholder = "ស្វែងរកផលិតផល… (Lipstick, Dress, Serum...)",
}) {
  return (
    <motion.div
      layout
      className="relative w-full md:max-w-md"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Icon */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 w-5 h-5 opacity-80" />

      {/* Input */}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-pink-100/60 bg-white/60 backdrop-blur-sm px-11 py-2.5 text-sm md:text-base text-gray-700 placeholder-pink-300 outline-none shadow-[0_2px_6px_rgba(236,72,153,0.05)] focus:ring-2 focus:ring-pink-200/60 focus:bg-white/80 transition-all"
        aria-label="Search products"
      />

      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow:
            q.length > 0
              ? "0 0 14px rgba(236, 72, 153, 0.25)"
              : "0 0 0px rgba(236, 72, 153, 0)",
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}
