import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import Background from "../components/Background";
import Card from "../components/Card";

const About = () => {
  // 🌱 SEO: Title & Description
  useEffect(() => {
    document.title = "About Us | Lovely Boutique";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Learn more about Lovely Boutique – your destination for modern beauty, fashion, and self-love. 🌸");
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* Lightweight Animated Background */}
      <Background />

      {/* Content */}
      <section
        className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
        aria-labelledby="about-heading"
      >
        <motion.h1
          id="about-heading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-4 leading-tight"
        >
          About Lovely Boutique 💖
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-base md:text-lg"
        >
          Lovely Boutique is a modern beauty and fashion brand for every woman
          who loves elegance and confidence. Our curated collections include
          <strong> makeup</strong>, <strong>clothing</strong>,{" "}
          <strong>accessories</strong>, <strong>skincare</strong>, and
          <strong> perfumes</strong> — all chosen to make you feel beautiful
          every single day.
        </motion.p>

        {/* Cards Section */}
        <div
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-8 sm:gap-6"
          aria-label="Lovely Boutique Highlights"
        >
          <Card
            title="Premium Quality"
            icon={<Star className="w-6 h-6 text-pink-500" aria-hidden="true" />}
          >
            Only the finest products — for a safe, elegant, and delightful
            shopping experience.
          </Card>

          <Card
            title="Modern & Stylish"
            icon={<Sparkles className="w-6 h-6 text-pink-500" aria-hidden="true" />}
          >
            Curated with love and passion for style — perfect for the modern
            woman who shines with confidence.
          </Card>

          <Card
            title="Love & Positivity"
            icon={<Heart className="w-6 h-6 text-pink-500" aria-hidden="true" />}
          >
            Beauty comes from love and self-care. Lovely Boutique helps you feel
            that love every day 💕
          </Card>
        </div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl mx-auto fade-up"
          aria-labelledby="mission-heading"
        >
          <h2
            id="mission-heading"
            className="text-2xl font-semibold text-pink-700 mb-3"
          >
            Our Mission 🌷
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We aim to provide beauty and fashion that not only enhances your
            look but also empowers your confidence, self-love, and joy — inside
            and out.
          </p>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 text-sm text-gray-500">
          © {new Date().getFullYear()} Lovely Boutique — Be lovely, every day 💄
        </footer>
      </section>
    </main>
  );
};

export default memo(About);
