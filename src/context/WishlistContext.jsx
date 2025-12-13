import { createContext, useContext, useEffect, useState } from "react";

// 💕 Create context
const WishlistContext = createContext();

/**
 * 🌸 WishlistProvider
 * Wrap this around your App to manage wishlist globally.
 */
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  /** ✅ Load from localStorage on mount */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("girly_wishlist") || "[]");
      // Ensure all loaded IDs are strings
      setWishlist(new Set(saved.map(id => String(id))));
    } catch {
      console.warn("Failed to load wishlist data.");
      setWishlist(new Set());
    } finally {
      setIsInitialized(true);
    }
  }, []);

  /** ✅ Save wishlist to localStorage safely */
  useEffect(() => {
    if (!isInitialized) return; // 🛡️ Prevent saving empty state before load

    try {
      localStorage.setItem("girly_wishlist", JSON.stringify([...wishlist]));
    } catch (err) {
      console.error("Failed to save wishlist:", err);
    }
  }, [wishlist, isInitialized]);

  /** ❤️ Toggle item in wishlist */
  const toggleWishlist = (product) => {
    const id = String(product.id);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** ❌ Remove product by ID */
  const removeFromWishlist = (id) => {
    const strId = String(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(strId);
      return next;
    });
  };

  /** 🧹 Clear all wishlist items */
  const clearWishlist = () => setWishlist(new Set());

  /** 💕 Helper to check if an item is wished */
  const isWished = (id) => wishlist.has(String(id));

  /** 📊 Derived data */
  const wishlistCount = wishlist.size;

  /** 🌼 Provided value */
  const value = {
    wishlist,
    wishlistCount,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isWished,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * 💫 useWishlist Hook
 * Access wishlist state and actions anywhere.
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
