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

            <div className="flex items-center gap-3 opacity-90 transition-all">
              {/* Visa */}
              <div className="h-8 w-12 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 48 48" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.776 9.872L12.72 37.12H17.808L24.864 9.872H19.776Z" fill="#1A1F70" />
                  <path d="M33.792 9.872C32.328 9.872 30.048 10.616 29.352 12.2L24.96 37.12H30.432L31.488 34.096H38.16L38.832 37.12H43.92L38.4 12.008C37.896 10.424 36.192 9.872 33.792 9.872ZM32.88 28.16L34.68 20.36C34.92 19.4 35.592 18.296 36.336 18.296C36.432 18.296 36.528 18.32 36.624 18.344L36.912 28.144H32.88V28.16Z" fill="#1A1F70" />
                  <path d="M12.24 33.6C12.024 32.784 9.984 22.032 9.984 22.032C9.936 21.864 9.888 21.576 9.864 21.36L8.4 29.4C7.992 31.128 7.392 31.656 5.832 32.112C3.864 32.712 1.488 32.856 0.168 32.904L0 33.48H7.032C8.76 33.48 9.96 32.808 10.464 30.552L10.512 30.312L12.336 37.12H18.024L12.24 33.6Z" fill="#1A1F70" />
                  <path d="M47.9999 37.12H43.3439L40.9199 9.872H46.1279C47.2319 9.872 47.9279 10.424 48.1679 11.456L47.9999 37.12Z" fill="#FF5F00" />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="h-8 w-12 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="12" r="7" fill="#EB001B" fillOpacity="0.8" />
                  <circle cx="17" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
                  <path d="M12 16.8571C13.5714 15.7143 14.5714 14 14.5714 12C14.5714 10 13.5714 8.28571 12 7.14286C10.4286 8.28571 9.42857 10 9.42857 12C9.42857 14 10.4286 15.7143 12 16.8571Z" fill="#FF5F00" />
                </svg>
              </div>

              {/* KHQR */}
              <div className="h-8 w-12 bg-white border border-red-100 rounded flex items-center justify-center shadow-sm gap-1">
                <div className="w-4 h-4 bg-red-600 rounded-[2px] grid place-items-center">
                  <div className="w-3 h-3 border-2 border-white rounded-[1px]" />
                </div>
                <span className="text-[9px] font-bold text-red-600 tracking-tighter leading-none mt-0.5">KH<br />QR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
