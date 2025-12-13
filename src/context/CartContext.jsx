import { createContext, useContext, useState, useEffect, useMemo } from "react";

// 🌷 Create context
const CartContext = createContext();

/**
 * 🛍️ CartProvider
 * Wrap your entire app with this to manage the cart globally.
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { code, discountAmount, type }
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]); // 🎟️ Dynamic Vouchers

  /** ✅ Load from localStorage on first render */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("girly_cart") || "[]");
      setCart(saved);
    } catch {
      console.warn("Failed to load saved cart data.");
      setCart([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  /** 🔄 Fetch Vouchers from API */
  useEffect(() => {
    fetch('http://localhost:5001/api/vouchers')
      .then(res => res.json())
      .then(data => setAvailableVouchers(data))
      .catch(err => console.error("Failed to load vouchers", err));
  }, []);

  /** ✅ Save to localStorage on changes (safe) */
  useEffect(() => {
    if (!isInitialized) return; // 🛡️ Prevent saving empty state before load

    try {
      localStorage.setItem("girly_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart, isInitialized]);

  /** 🛒 Add item to cart */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  /** ➖ Remove item */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  /** ♻️ Update quantity */
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };

  /** 🧹 Clear cart */
  const clearCart = () => setCart([]);

  /** 🩷 Helper — Get product quantity */
  const getItemQty = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  /** 🧮 Derived values */
  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === "percentage") {
      return totalPrice * appliedVoucher.discountAmount;
    }
    return appliedVoucher.discountAmount; // Fixed amount
  }, [totalPrice, appliedVoucher]);

  const finalTotal = totalPrice - discount;

  /** 🎟️ Apply Voucher */
  const applyVoucher = (code) => {
    // 🔍 Search in fetched vouchers instead of static file
    const voucher = availableVouchers.find(v => v.code === code);

    if (!voucher) {
      return { success: false, message: "Invalid voucher code" };
    }

    // Check Date Validity (Optional Enhancement)
    // const now = new Date();
    // if (new Date(voucher.validUntil) < now) return { success: false, message: "Voucher expired" };

    setAppliedVoucher(voucher);
    return { success: true, message: `Voucher applied! ${voucher.displayDiscount} OFF` };
  };

  /** 🎫 Remove Voucher */
  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  /** 💝 Provided value */
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getItemQty,
    totalItems,
    totalPrice,
    discount,
    finalTotal,
    appliedVoucher,
    applyVoucher,
    removeVoucher
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * 💫 useCart Hook
 * Access cart state and actions anywhere.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
