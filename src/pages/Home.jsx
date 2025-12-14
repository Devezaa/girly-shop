import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Heart } from "lucide-react";
import Background from "../components/Background";
import Card from "../components/Card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <Background />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-24 md:py-32">
        {/* Hero Section */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-pink-600 mb-4 drop-shadow-sm"
        >
          Lovely Boutique 💖
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 max-w-xl leading-relaxed mb-8"
        >
          Discover your beauty, style, and confidence — all in one place.
          Explore our curated selection of <strong>makeup</strong>,
          <strong>fashion</strong>, and <strong>accessories</strong>
          designed for modern, confident women.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/shop"
            className="px-5 py-2.5 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow hover:shadow-md transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            Shop Now ✨
          </Link>
        </motion.div>

        {/* Feature Section */}
        <section className="mt-20 max-w-6xl w-full">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-pink-700 mb-8"
          >
            Why You’ll Love Shopping With Us 💕
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Trendy Fashion"
              icon={<ShoppingBag className="w-5 h-5 text-pink-500" />}
            >
              We bring the latest and most stylish clothing
              designed to make you shine in every occasion.
            </Card>

            <Card
              title="Makeup & Skincare"
              icon={<Sparkles className="w-5 h-5 text-pink-500" />}
            >
              Discover our premium beauty products that enhance
              your natural glow and confidence every day.
            </Card>

            <Card
              title="Made With Love"
              icon={<Heart className="w-5 h-5 text-pink-500" />}
            >
              Every product is chosen with care to make you
              feel loved, confident, and truly beautiful 💖
            </Card>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="mt-20 text-sm text-gray-500">
          © {new Date().getFullYear()} Lovely Boutique — Be lovely, every day 🌸
        </footer>
      </div>
    </div>
  );
}
