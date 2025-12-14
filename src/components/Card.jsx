import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Create a motion-enabled Link component
const MotionLink = motion(Link);

/**
 * Card Component
 * ----------------
 * Props:
 *  - children: ReactNode → content inside the card
 *  - title: string → optional title text
 *  - icon: ReactNode → optional icon (Lucide icon or custom SVG)
 *  - className: string → optional extra Tailwind classes
 *  - onClick: function → optional click handler
 *  - to: string → optional URL path (makes card a link)
 */

export default function Card({ children, title, icon, className = "", onClick, to }) {
  // Determine if the card is interactive
  const isInteractive = !!onClick || !!to;

  // Choose the component type (Link or div)
  const Component = to ? MotionLink : motion.div;

  return (
    <Component
      layout
      to={to}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white border border-pink-100 rounded-3xl p-5 shadow-sm transition-all ${isInteractive ? "cursor-pointer hover:shadow-md hover:-translate-y-1" : ""
        } ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {icon && (
            <span className="text-pink-500 flex items-center justify-center">
              {icon}
            </span>
          )}
          <h3 className="text-base font-semibold text-pink-700">{title}</h3>
        </div>
      )}
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>

      {/* Subtle gradient overlay for girly feel */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-50/10 via-rose-50/10 to-fuchsia-50/10 pointer-events-none" />
    </Component>
  );
}
