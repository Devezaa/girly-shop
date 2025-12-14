import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modal Component
 * ----------------
 * Props:
 *  - open: boolean → whether modal is visible
 *  - onClose: function → close handler
 *  - title: string → optional title text
 *  - children: ReactNode → modal content
 *  - size: "sm" | "md" | "lg" (optional, default = "md")
 */

export default function Modal({ open, onClose, title, children, size = "md" }) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (open && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-white rounded-3xl border border-pink-100 shadow-xl p-6 w-full ${sizes[size]}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-4">
              <h3 className="text-pink-700 font-semibold text-lg">
                {title || "Lovely Modal 💖"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-pink-50 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-pink-600" />
              </button>
            </div>

            {/* Body */}
            <div className="text-sm text-gray-700 leading-relaxed">{children}</div>

            {/* Pink Glow Border */}
            <div className="absolute inset-0 rounded-3xl border border-transparent shadow-[0_0_20px_rgba(236,72,153,0.15)] pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
