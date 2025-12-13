import { useEffect, useState, useMemo } from "react";

/**
 * 🌸 useCart Hook — Lovely Boutique
 * ---------------------------------
 * Reusable shopping cart hook with full persistence and helper functions.
 * Perfect for small or independent components.
 */
export default function useCart() {
  const [cart, setCart] = useState([]);

  /** 🩷 Load cart from localStorage */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("girly_cart") || "[]");
      setCart(saved);
    } catch {
      setCart([]);
    }
  }, []);

  /** 🩷 Save cart whenever it changes */
  useEffect(() => {
    localStorage.setItem("girly_cart", JSON.stringify(cart));
  }, [cart]);

  /** ➕ Add product to cart */
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  /** ➖ Remove product completely */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /** 🔁 Update quantity */
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
  };

  /** 🧹 Clear all cart items */
  const clearCart = () => setCart([]);

  /** 📊 Derived totals */
  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const totalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  /** 🛒 Check if product exists */
  const inCart = (id) => cart.some((p) => p.id === id);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalItems,
    totalPrice,
    inCart,
  };
}
