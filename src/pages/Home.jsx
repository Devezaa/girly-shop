import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Heart } from "lucide-react";
import Background from "../components/Background";
import Card from "../components/Card";
import HeroSlider from "../components/HeroSlider";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <Background />

      {/* Hero Slider (Replaces static content) */}
      <HeroSlider />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Feature Section */}
        <section className="mt-8 md:mt-20 max-w-6xl w-full">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-pink-700 mb-6 md:mb-8"
          >
            Why You’ll Love Shopping With Us 💕
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
        <footer className="mt-20 pb-24 md:pb-0 text-sm text-gray-500">
          © {new Date().getFullYear()} Lovely Boutique — Be lovely, every day 🌸
        </footer>
      </div>
    </div>
  );
}
