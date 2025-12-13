import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, Mail, MapPin, Phone, CreditCard, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* 1. Brand & Social */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-white group-hover:text-[#FFB040] transition-colors">
                Lovely<span className="text-[#FFB040]">.</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 font-light tracking-wide">
                PREMIUM K-BEAUTY BOUTIQUE
              </p>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curating the finest Korean skincare and makeup for your daily glow. Authentic, affordable, and adorable.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Send, href: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#FFB040] hover:text-white transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Shop Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-[#FFB040]">Shop</h3>
            <ul className="space-y-4">
              {["New Arrivals", "Best Sellers", "Skincare", "Makeup", "Body Care", "Sets & Bundles"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Help & Support */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-[#FFB040]">Help</h3>
            <ul className="space-y-4">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Shipping Info", href: "/terms" },
                { label: "Returns & Exchanges", href: "/terms" },
                { label: "FAQ", href: "/contact" },
                { label: "Track Order", href: "/order-details" }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-[#FFB040]">Stay in the Loop</h3>
            <p className="text-gray-400 text-sm mb-6">
              Subscribe for exclusive offers, new drops, and beauty tips.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB040] focus:ring-1 focus:ring-[#FFB040] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FFB040] text-white rounded-lg hover:bg-[#ff9f1a] transition-colors shadow-lg shadow-orange-500/20">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our <Link to="/terms" className="underline hover:text-gray-300">Terms</Link> & <Link to="/terms" className="underline hover:text-gray-300">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2024 Lovely Boutique. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} /> <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="h-3 w-px bg-gray-700" />
            <div className="flex items-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="font-semibold text-gray-400">KHQR</span>
              <span className="font-semibold text-blue-400">VISA</span>
              <span className="font-semibold text-red-400">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
