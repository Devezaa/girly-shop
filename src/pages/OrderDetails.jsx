import React, { useState } from "react";
import { API_BASE_URL } from '../config';
import { ArrowLeft, ArrowRight, MapPin, ChevronRight, Plus, Minus, Trash2, ShoppingBag, CheckCircle, Loader2, CreditCard, ShieldCheck, X, PenLine, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Background from "../components/Background"; // Using consistent background

export default function OrderDetails() {
    const navigate = useNavigate();
    const { cart, updateQty, removeFromCart, totalPrice, clearCart, applyVoucher, removeVoucher, discount, appliedVoucher } = useCart();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // 📍 Address State
    const [address, setAddress] = useState("Jl. Westview, New Jersey"); // Default Mock
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [tempAddress, setTempAddress] = useState("");
    const [voucherCode, setVoucherCode] = useState("");

    const handleApplyVoucher = () => {
        if (!voucherCode.trim()) return;
        const result = applyVoucher(voucherCode);
        if (result.success) {
            alert(result.message);
            setVoucherCode("");
        } else {
            alert(result.message);
        }
    };

    const shippingCost = cart.length > 0 ? 5.00 : 0; // Adjusted for realism
    const subTotal = totalPrice - discount;
    const finalTotal = subTotal + shippingCost;

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsLoading(true);
        // Simulate network delay for better UX feel
        setTimeout(async () => {
            try {
                const orderData = {
                    userId: user.id || user.username,
                    items: cart,
                    total: finalTotal,
                    address: address, // ✅ Use dynamic address
                    paymentMethod: "Paylater"
                };

                const res = await fetch(`${API_BASE_URL}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const data = await res.json();

                if (data.success) {
                    setShowSuccess(true);
                    clearCart();
                } else {
                    alert("Failed to place order: " + data.message);
                }
            } catch (error) {
                console.error("Checkout Error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    // ✏️ Open Address Modal
    const openAddressModal = () => {
        setTempAddress(address);
        setIsEditingAddress(true);
    };

    // 💾 Save Address
    const saveAddress = () => {
        if (tempAddress.trim()) {
            setAddress(tempAddress);
            setIsEditingAddress(false);
        }
    };

    if (cart.length === 0 && !showSuccess) {
        return (
            <div className="min-h-screen relative font-sans overflow-hidden flex flex-col items-center justify-center text-center px-4 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 p-10 rounded-3xl bg-white shadow-sm border border-gray-100"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6 mx-auto">
                        <ShoppingBag size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your Bag is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs leading-relaxed mx-auto text-sm">
                        Looks like you haven't added anything yet.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all text-sm"
                    >
                        Start Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative font-sans overflow-hidden bg-gray-50 pb-32">

            {/* 🔙 Header (Mobile Only) */}
            <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center shadow-sm">
                <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all">
                    <ArrowLeft size={18} />
                </button>
                <h1 className="flex-1 text-center font-serif text-lg font-bold text-gray-900">
                    Shopping Bag <span className="text-xs font-sans font-normal text-gray-500 ml-1">({cart.length})</span>
                </h1>
                <div className="w-9"></div> {/* Spacer for symmetry */}
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

                    {/* 🛒 Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all border border-gray-100"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-serif text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{item.name}</h3>
                                                <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">{item.brand || 'Collection'}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                                <button
                                                    onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}
                                                    className="w-6 h-6 bg-white rounded-md shadow-sm flex items-center justify-center text-gray-600 hover:text-black active:scale-95 transition-all outline-none"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="font-semibold text-gray-900 min-w-[1rem] text-center text-sm">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-6 h-6 bg-gray-900 text-white rounded-md shadow-sm flex items-center justify-center hover:bg-black active:scale-95 transition-all outline-none"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                {item.oldPrice && <p className="text-gray-400 text-[10px] line-through mb-0 text-right">${(item.oldPrice * item.qty).toFixed(2)}</p>}
                                                <p className="font-bold text-lg text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* 📝 Summary Card (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-4">
                            {/* Address Card (Interactive) */}
                            <div
                                onClick={openAddressModal}
                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                        <MapPin size={12} /> Shipping To
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded hover:bg-[#FFB040] hover:text-white transition-colors">CHANGE</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                            <MapPin size={14} fill="currentColor" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-900 text-sm">Home</p>
                                            <p className="text-gray-500 text-xs truncate max-w-[150px]">{address}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* 🎟️ Voucher Code Input */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                    <Ticket size={16} className="text-[#FFB040]" />
                                    Voucher Code
                                </h3>

                                {appliedVoucher ? (
                                    <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-100">
                                        <span className="font-bold text-sm">{appliedVoucher.code}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium">-{appliedVoucher.displayDiscount}</span>
                                            <button onClick={removeVoucher} className="text-red-400 hover:text-red-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                            placeholder="ENTER CODE"
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FFB040] font-medium uppercase min-w-0"
                                        />
                                        <button
                                            onClick={handleApplyVoucher}
                                            className="bg-gray-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-black transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-serif text-lg font-bold text-gray-900 mb-5 font-khmer">សង្ខេបការបញ្ជាទិញ</h3>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span className="font-khmer text-xs">សរុបបណ្តោះអាសន្ន</span>
                                        <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 text-sm font-medium">
                                            <span className="font-khmer text-xs">បញ្ចុះតម្លៃ (Voucher)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span className="font-khmer text-xs">សេវាដឹកជញ្ជូន</span>
                                        <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-100 pt-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-500 font-medium font-khmer text-sm">សរុបរួម</span>
                                        <span className="text-2xl font-serif font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-base hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <span className="font-khmer">បញ្ជាទិញឥឡូវនេះ</span> <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-[10px]">
                                    <ShieldCheck size={12} />
                                    <span className="font-khmer">ការទូទាត់ដែលមានសុវត្ថិភាព</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            {/* ✏️ Address Edit Modal */}
            < AnimatePresence >
                {isEditingAddress && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditingAddress(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-serif font-bold text-gray-900">Delivery Address</h3>
                                <button
                                    onClick={() => setIsEditingAddress(false)}
                                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wide">Street Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={tempAddress}
                                            onChange={(e) => setTempAddress(e.target.value)}
                                            placeholder="Enter your address..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFB040] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* 🗺️ Live Google Map Preview */}
                                <div className="rounded-xl overflow-hidden border border-gray-200 h-40 bg-gray-100 relative">
                                    {tempAddress ? (
                                        <iframe
                                            title="Map Preview"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            marginHeight="0"
                                            marginWidth="0"
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(tempAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                            className="w-full h-full object-cover"
                                        ></iframe>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                            Enter an address to see the map
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={saveAddress}
                                    className="w-full bg-[#FFB040] text-white font-bold py-3.5 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    Save Address
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >

            {/* 🎉 Success Modal */}
            < AnimatePresence >
                {showSuccess && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-sm">
                                <CheckCircle size={40} strokeWidth={2} />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                                Thank you for your purchase! <br /> Your beauty treats are on the way to: <br />
                                <span className="font-bold text-gray-900">{address}</span>
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/home')}
                                    className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="w-full bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
            {/* 📱 Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t border-gray-100 md:hidden z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total</p>
                        <p className="font-serif font-bold text-2xl text-gray-900 leading-none">${finalTotal.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <span>Place Order</span> <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}
