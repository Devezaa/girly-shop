import { motion } from "framer-motion";

/**
 * CategoryTabs Component
 * ----------------------
 * Props:
 *  - active: string → current active category
 *  - setActive: function → updates active category
 *  - categories: array → [{ id, label }]
 */
export default function CategoryTabs({ active, setActive, categories = [] }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <motion.button
            key={cat.id}
            layout
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(cat.id)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all border 
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md"
                  : "bg-white border-pink-200 text-pink-700 hover:border-pink-400 hover:text-pink-600"
              }`}
          >
            {cat.label}
            {isActive && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 rounded-full bg-pink-500/10"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
