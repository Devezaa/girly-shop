import { motion } from "framer-motion";
import { useState, useEffect, memo } from "react";
import Background from "../components/Background";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  // 🌸 Automatically hide toast after 2.5s with cleanup
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => setSent(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [sent]);

  /** 🌸 Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 💌 Handle form submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (name.trim() && email.trim() && message.trim()) {
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* 🌸 Lightweight Animated Background */}
      <Background />

      {/* 💕 Header Section */}
      <header
        className="relative z-10 text-center py-14 px-6"
        aria-labelledby="contact-heading"
      >
        <motion.h1
          id="contact-heading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-2"
        >
          Contact Us 💌
        </motion.h1>
        <p className="text-gray-600">
          We’d love to hear from you! Drop us a message below 🌸
        </p>
      </header>

      {/* 🩰 Form Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24" aria-label="Contact form">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-5 card-shadow"
        >
          {/* 🧁 Name Field */}
          <div>
            <label htmlFor="name" className="block text-pink-600 font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full border border-pink-200 rounded-lg px-4 py-2 text-gray-800 focus:border-pink-400 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* 📧 Email Field */}
          <div>
            <label htmlFor="email" className="block text-pink-600 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full border border-pink-200 rounded-lg px-4 py-2 text-gray-800 focus:border-pink-400 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* 💬 Message Field */}
          <div>
            <label htmlFor="message" className="block text-pink-600 font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-pink-200 rounded-lg px-4 py-2 text-gray-800 focus:border-pink-400 outline-none transition-all resize-none"
              placeholder="Write your message here..."
            />
          </div>

          {/* 🌷 Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 rounded-full font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            Send Message 💌
          </button>
        </motion.form>

        {/* 💖 Toast Message */}
        {sent && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-pink-500 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            💖 Message sent successfully!
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default memo(Contact);
