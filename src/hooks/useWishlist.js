import { createContext, useContext, useEffect, useState, useMemo } from "react";

/**
 * 🌷 Wishlist Context — Lovely Boutique
 * -------------------------------------
 * Global state for managing user's wishlist.
 */
const WishlistContext = createContext();

export function WishlistProvider({ children }) {
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

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
        isWished,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * 🌷 useWishlist Hook
 * -------------------
 * Consumes the global WishlistContext.
 */
export default function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider 🌸");
  }
  return context;
}
