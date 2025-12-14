import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, MapPin, ArrowRight, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-800 pt-20 pb-10 font-sans overflow-hidden border-t border-gray-100">

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
          {/* 1. Brand & Social */}
          <div className="space-y-8">
            <Link to="/" className="inline-block group">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-900 group-hover:text-[#FFB040] transition-colors">
                Lovely<span className="text-[#FFB040]">.</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Curating the finest Korean skincare and makeup for your daily glow.
              Authentic, affordable, and absolutely adorable.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#FFB040] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Shop Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-gray-900">
              Shop
            </h3>
            <ul className="space-y-3">
              {["New Arrivals", "Best Sellers", "Skincare", "Makeup", "Body Care", "Sets & Bundles"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-500 hover:text-[#FFB040] hover:translate-x-1 transition-all inline-block text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Help & Support */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-gray-900">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Shipping Info", href: "/terms" },
                { label: "Returns & Exchanges", href: "/terms" },
                { label: "FAQ", href: "/contact" },
                { label: "Track Order", href: "/order-details" }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-500 hover:text-[#FFB040] hover:translate-x-1 transition-all inline-block text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-gray-900">
              Stay Updated
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Subscribe for exclusive offers and new drops.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB040]/20 focus:border-[#FFB040] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FFB040] text-white rounded-lg hover:bg-[#ffcf87] transition-all shadow-md hover:shadow-lg">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our <Link to="/terms" className="underline hover:text-[#FFB040] transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <p>© 2024 Lovely Boutique. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-default">
              <MapPin size={14} /> <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="h-3 w-px bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-all">
              {/* Clean Payment Icons */}
              <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-bold text-[10px] text-gray-600 tracking-tighter">VISA</div>
              <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-bold text-[10px] text-gray-600 tracking-tighter">MC</div>
              <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-bold text-[10px] text-gray-600 tracking-tighter">KHQR</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
