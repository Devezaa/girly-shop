import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Header Component
 * ----------------
 * Props:
 *  - cartCount: number (optional) => total items in cart
 */
export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add subtle background when scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 md:bg-white/80 md:backdrop-blur-md border-b border-pink-100 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span className="font-bold text-lg text-pink-600 tracking-tight">
            Lovely Boutique
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/home" className="hover:text-pink-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-pink-600 transition">
            Shop
          </Link>
          <a href="#about" className="hover:text-pink-600 transition">
            About
          </a>
          <a href="#contact" className="hover:text-pink-600 transition">
            Contact
          </a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-full hover:bg-pink-50 transition"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-pink-600" />
          </button>

          <button
            className="relative p-2 rounded-full hover:bg-pink-50 transition"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-pink-500 text-white rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-pink-50 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-pink-600" />
            ) : (
              <Menu className="w-5 h-5 text-pink-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-pink-100 shadow-sm"
          >
            <nav className="flex flex-col px-6 py-3 space-y-3 text-sm">
              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-600 transition"
              >
                Home
              </a>
              <a
                href="#shop"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-600 transition"
              >
                Shop
              </a>
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-600 transition"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-600 transition"
              >
                Contact
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
