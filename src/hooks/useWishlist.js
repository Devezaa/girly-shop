import { useEffect, useState, useMemo } from "react";

/**
 * 🌷 useWishlist Hook — Lovely Boutique
 * -------------------------------------
 * Custom hook for managing user's wishlist.
 * Persistent, lightweight, and reusable.
 */
export default function useWishlist() {
  const [wishlist, setWishlist] = useState(new Set());

  /** 🩷 Load wishlist from localStorage on mount */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("girly_wishlist") || "[]");
      setWishlist(new Set(saved));
    } catch {
      setWishlist(new Set());
    }
  }, []);

  /** 🩷 Save wishlist to localStorage whenever it changes */
  useEffect(() => {
    localStorage.setItem("girly_wishlist", JSON.stringify(Array.from(wishlist)));
  }, [wishlist]);

  /** ❤️ Toggle product (add or remove) */
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  /** ❌ Remove product from wishlist by ID */
  const removeFromWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  /** 🧹 Clear wishlist */
  const clearWishlist = () => setWishlist(new Set());

  /** 📊 Derived value */
  const wishlistCount = useMemo(() => wishlist.size, [wishlist]);

  /** 💕 Check if a product is wished */
  const isWished = (id) => wishlist.has(id);

  return {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount,
    isWished,
  };
}
