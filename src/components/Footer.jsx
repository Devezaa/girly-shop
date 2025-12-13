import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, MapPin, ArrowRight, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1a0b0b] text-white pt-20 pb-10 font-sans overflow-hidden border-t border-white/5">

      {/* 🎨 Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
          {/* 1. Brand & Social */}
          <div className="space-y-8">
            <Link to="/" className="inline-block group">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-white group-hover:text-[#FFB040] transition-colors">
                Lovely<span className="text-[#FFB040]">.</span>
              </h2>
              <div className="h-0.5 w-12 bg-[#FFB040] mt-2 group-hover:w-full transition-all duration-500"></div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed font-light">
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
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#FFB040] hover:text-black hover:border-[#FFB040] hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Shop Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-8 text-white relative inline-block">
              Shop
              <span className="absolute -bottom-2 left-0 w-1/2 h-px bg-[#FFB040]"></span>
            </h3>
            <ul className="space-y-4">
              {["New Arrivals", "Best Sellers", "Skincare", "Makeup", "Body Care", "Sets & Bundles"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-white/60 hover:text-[#FFB040] hover:translate-x-1 transition-all inline-block text-sm font-light">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Help & Support */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-8 text-white relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-px bg-[#FFB040]"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Shipping Info", href: "/terms" },
                { label: "Returns & Exchanges", href: "/terms" },
                { label: "FAQ", href: "/contact" },
                { label: "Track Order", href: "/order-details" }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/60 hover:text-[#FFB040] hover:translate-x-1 transition-all inline-block text-sm font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-8 text-white relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-1/2 h-px bg-[#FFB040]"></span>
            </h3>
            <p className="text-white/60 text-sm mb-6 font-light">
              Subscribe for exclusive offers, new drops, and expert beauty tips directly to your inbox.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFB040]/50 focus:bg-white/10 transition-all font-light"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#FFB040] text-black rounded-lg hover:bg-[#ffcf87] transition-all shadow-lg shadow-[#FFB040]/20 hover:shadow-[#FFB040]/40">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-xs text-white/40 mt-4 font-light">
              By subscribing, you agree to our <Link to="/terms" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40 font-light">
          <p>© 2024 Lovely Boutique. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-white/60 transition-colors cursor-default">
              <MapPin size={14} /> <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="h-3 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Simple Payment Icons representation */}
              <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center font-bold text-[10px] tracking-tighter">VISA</div>
              <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center font-bold text-[10px] tracking-tighter">MC</div>
              <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center font-bold text-[10px] tracking-tighter">KHQR</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
