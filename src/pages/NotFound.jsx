import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { SearchX } from "lucide-react";
import Background from "../components/Background";

export default function NotFound() {
  const location = useLocation();
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-sans">
      {/* Animated Background */}
      <Background />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative z-10">
        {/* 404 Icon & Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <SearchX className="w-16 h-16 text-pink-500" />
          </div>
          <h1 className="text-6xl font-extrabold text-pink-600 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Oops! Page not found 💔
            <span className="block text-sm text-gray-400 mt-2 font-mono bg-gray-100 py-1 px-3 rounded-full">
              Path: {location.pathname}
            </span>
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
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 relative z-10">
        © {new Date().getFullYear()} Lovely Boutique — Keep shining 💖
      </footer>
    </div>
  );
}
