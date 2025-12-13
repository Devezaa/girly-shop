import { motion } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * WishlistButton Component
 * ------------------------
 * Props:
 *  - active: boolean → whether item is already in wishlist
 *  - onToggle: function → handle wishlist toggle
 *  - size: number → optional size of button (default 36px)
 */

export default function WishlistButton({ active = false, onToggle, size = 36 }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`relative flex items-center justify-center rounded-full border transition-all duration-300 shadow-sm ${
        active
          ? "bg-pink-100 border-pink-300 hover:bg-pink-200"
          : "bg-white border-pink-100 hover:border-pink-300 hover:bg-pink-50"
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          active ? "fill-pink-500 text-pink-500" : "text-pink-600"
        }`}
      />
      {active && (
        <motion.span
          key="pulse"
          layoutId="pulse"
          className="absolute inset-0 rounded-full bg-pink-400/20"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
}
