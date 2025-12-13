import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import Background from "../components/Background";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* Animated Background */}
      <Background />

      {/* 404 Icon & Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-6"
      >
        <div className="flex justify-center mb-4">
          <SearchX className="w-16 h-16 text-pink-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-pink-600 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700">
          Oops! Page not found 💔
        </h2>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-600 max-w-md mb-8"
      >
        It seems like the page you’re looking for doesn’t exist or has been moved.
        Don’t worry — let’s get you back to something lovely 💖
      </motion.p>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow hover:shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          Back to Home 🌷
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Lovely Boutique — Keep shining 💖
      </footer>
    </div>
  );
}
