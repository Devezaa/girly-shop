import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, Tag, CheckCircle, AlertCircle } from "lucide-react"; // Custom Note: Added Tag, CheckCircle, AlertCircle for voucher UI
import { useState } from "react";
import { useCart } from "../context/CartContext";

/**
 * CartDrawer Component
 * ---------------------
 * Props:
 *  - open: boolean → whether cart drawer is visible
 *  - items: array → list of cart items {id, name, price, qty, image}
 *  - onClose: function → close cart drawer
 *  - onRemove: function → remove specific item
 *  - onClear: function → clear all items
 */
export default function CartDrawer({ open, items = [], onClose, onRemove, onClear }) {
  // Use context for voucher logic
  const { discount, finalTotal, applyVoucher, removeVoucher, appliedVoucher, totalPrice } = useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    const result = applyVoucher(voucherCode);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setVoucherCode("");
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    setMessage(null);
  };

  const formatCurrency = (n) => `$${n.toFixed(2)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          {/* Drawer */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col rounded-l-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-pink-100">
              <div className="flex items-center gap-2 text-pink-600 font-semibold text-lg">
                <ShoppingBag className="w-5 h-5" />
                <span>My Cart</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-pink-50 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 py-12 text-sm">
                  🛍️ Cart គ្មានទំនិញទេ <br />
                  ចុច “Add to cart” ដើម្បីបន្ថែមផលិតផល cuteៗ ❤️
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border border-pink-100 rounded-xl p-2 hover:shadow-sm transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm leading-tight">{item.name}</h3>
                      <p className="text-xs opacity-70">Qty: {item.qty}</p>
                      <p className="text-pink-600 font-semibold text-sm">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 rounded-full hover:bg-pink-50 text-gray-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-pink-100 p-4 space-y-4">

              {/* VOUCHER SECTION */}
              <div className="bg-pink-50/50 p-3 rounded-xl space-y-3">

                {/* Applied Voucher State */}
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-white border border-green-200 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs font-semibold text-green-700">{appliedVoucher.code}</p>
                        <p className="text-[10px] text-green-600">Saved {formatCurrency(discount)}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveVoucher} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Input State */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Enter voucher code"
                      className="flex-1 text-sm border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500 bg-white"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode.trim()}
                      className="bg-pink-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Messages */}
                {message && (
                  <div className={`flex items-center gap-1.5 text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {message.text}
                  </div>
                )}
              </div>

              {/* TOTALS */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                    <span>Discount</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-dashed border-pink-200 mt-2">
                  <span>Total</span>
                  <span className="text-pink-600 text-lg">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={onClear}
                  className="w-1/2 rounded-xl border border-pink-300 text-pink-700 px-3 py-2 hover:bg-pink-50 transition"
                >
                  Clear All
                </button>
                <button
                  className="w-1/2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 shadow-md hover:shadow-lg active:scale-[0.98] transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
