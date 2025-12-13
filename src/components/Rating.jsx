import { Star } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Rating Component
 * ----------------
 * Props:
 *  - value: number → rating value (0–5)
 *  - size: number → icon size (optional)
 *  - showValue: boolean → show numeric rating (default true)
 */

export default function Rating({ value = 0, size = 16, showValue = true }) {
  const stars = Math.round(value);
  const starArray = Array.from({ length: 5 });

  return (
    <div className="flex items-center gap-1">
      {starArray.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 250 }}
        >
          <Star
            className={`transition-colors duration-200 ${
              i < stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            style={{ width: size, height: size }}
          />
        </motion.div>
      ))}

      {showValue && (
        <span className="text-xs text-gray-600 ml-1 select-none">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
