import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from '../config';

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
  const [isCartOpen, setIsCartOpen] = useState(false); // 🛒 Drawer State

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  /** ✅ Load from localStorage on first render */
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("girly_cart") || "[]");
      const savedVoucher = JSON.parse(localStorage.getItem("girly_voucher") || "null");
      setCart(savedCart);
      setAppliedVoucher(savedVoucher);
    } catch {
      console.warn("Failed to load saved cart data.");
      setCart([]);
      setAppliedVoucher(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  /** 🔄 Fetch Vouchers from API */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/vouchers`)
      .then(res => res.json())
      .then(data => setAvailableVouchers(data))
      .catch(err => console.error("Failed to load vouchers", err));
  }, []);

  /** ✅ Save to localStorage on changes (safe) */
  useEffect(() => {
    if (!isInitialized) return; // 🛡️ Prevent saving empty state before load

    try {
      localStorage.setItem("girly_cart", JSON.stringify(cart));
      localStorage.setItem("girly_voucher", JSON.stringify(appliedVoucher));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart, appliedVoucher, isInitialized]);

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
  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null); // Optional: clear voucher too? Or keep it? Usually clearing cart clears voucher context.
    // Let's keep voucher for now, it's safer unless user explicitly removes it or logic dictates otherwise.
    // Actually, usually clearing cart (checkout success) should clear voucher.
    // But if just clearing items, maybe keep it? Let's check `clearCart` usage.
    // If it's used for logout manually, we might want to clear.
    // For now, let's play it safe and NOT clear voucher automatically unless explicitly requested, 
    // to match standard e-commerce "persistence" behavior. 
    // Wait, if cart is empty, discount shouldn't apply financially, but the code remains "applied" ready for next item.
  };

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

    // Check Date Validity (Optional Enhancement - now possible with ISO dates in vouchers)
    if (voucher.expiryDate) {
      const now = new Date();
      const expiry = new Date(voucher.expiryDate);
      if (expiry < now) {
        return { success: false, message: "Voucher expired" };
      }
    }

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
    removeVoucher,
    isCartOpen,
    openCart,
    closeCart
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
