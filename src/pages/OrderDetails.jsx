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
            <div className="min-h-screen relative font-sans overflow-hidden flex flex-col items-center justify-center text-center px-4">
                <Background />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 p-8 rounded-[3rem] bg-white/60 backdrop-blur-xl shadow-xl border border-white/50"
                >
                    <div className="w-24 h-24 bg-gradient-to-tr from-pink-100 to-rose-50 rounded-full flex items-center justify-center text-pink-500 mb-6 mx-auto shadow-inner">
                        <ShoppingBag size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-3">Your Bag is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs leading-relaxed mx-auto">
                        Looks like you haven't indulged in any self-care treats yet.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
                    >
                        Start Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative font-sans overflow-hidden pb-32">
            <Background />

            {/* 🔙 Header (Mobile Only) */}
            <header className="md:hidden sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-black hover:scale-105 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="flex-1 text-center font-serif text-2xl font-bold text-gray-900">
                    Shopping Bag <span className="text-sm font-sans font-normal text-gray-500 ml-2">({cart.length} items)</span>
                </h1>
                <div className="w-10"></div> {/* Spacer for symmetry */}
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* 🛒 Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white/70 backdrop-blur-lg rounded-[2rem] p-4 flex gap-6 hover:shadow-lg transition-all border border-white/50"
                                >
                                    {/* Product Image */}
                                    <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                                                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{item.brand || 'Boutique Collection'}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-100">
                                                <button
                                                    onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}
                                                    className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:text-black active:scale-90 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-semibold text-gray-900 min-w-[1.5rem] text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-8 h-8 bg-black text-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-800 active:scale-90 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                {item.oldPrice && <p className="text-gray-400 text-xs line-through mb-0.5">${(item.oldPrice * item.qty).toFixed(2)}</p>}
                                                <p className="font-bold text-xl text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* 📝 Summary Card (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            {/* Address Card (Interactive) */}
                            <div
                                onClick={openAddressModal}
                                className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                        <MapPin size={14} /> Shipping To
                                    </div>
                                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-[#FFB040] group-hover:text-white transition-colors">EDIT</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <MapPin size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Home</p>
                                            <p className="text-gray-500 text-sm truncate max-w-[180px]">{address}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>



                            {/* 🎟️ Voucher Code Input */}
                            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Ticket size={18} className="text-pink-500" />
                                    Have a Voucher?
                                </h3>

                                {appliedVoucher ? (
                                    <div className="flex justify-between items-center bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200">
                                        <span className="font-bold">{appliedVoucher.code}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">-{appliedVoucher.displayDiscount}</span>
                                            <button onClick={removeVoucher} className="text-red-500 hover:text-red-700">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                            placeholder="Enter Code"
                                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium uppercase"
                                        />
                                        <button
                                            onClick={handleApplyVoucher}
                                            className="bg-gray-900 text-white px-5 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl">
                                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 font-khmer">សង្ខេបការបញ្ជាទិញ</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span className="font-khmer">សរុបបណ្តោះអាសន្ន</span>
                                        <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 text-sm font-medium">
                                            <span className="font-khmer">បញ្ចុះតម្លៃ (Voucher)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span className="font-khmer">សេវាដឹកជញ្ជូន</span>
                                        <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm items-center">
                                        <span className="font-khmer">ពន្ធ</span>
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-khmer">បានបញ្ចូលរួច</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-500 font-medium font-khmer">សរុបរួម</span>
                                        <span className="text-3xl font-serif font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <span className="font-khmer">បញ្ជាទិញឥឡូវនេះ</span> <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                                    <ShieldCheck size={14} />
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
                            className="absolute inset-0 bg-black/30 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative z-10 shadow-2xl border border-white/50"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-serif font-bold text-gray-900">Delivery Address</h3>
                                <button
                                    onClick={() => setIsEditingAddress(false)}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Street Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={tempAddress}
                                            onChange={(e) => setTempAddress(e.target.value)}
                                            placeholder="Enter your address..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FFB040] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* 🗺️ Live Google Map Preview */}
                                <div className="rounded-2xl overflow-hidden border border-gray-200 h-48 bg-gray-100 relative">
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
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                            Enter an address to see the map
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={saveAddress}
                                    className="w-full bg-[#FFB040] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
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
                            className="absolute inset-0 bg-black/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            className="bg-white rounded-[3rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl border border-white/50"
                        >
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-sm">
                                <CheckCircle size={48} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Order Confirmed</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Thank you for your purchase! <br /> Your beauty treats are on the way to: <br />
                                <span className="font-bold text-gray-900">{address}</span>
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/home')}
                                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="w-full bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
            {/* 📱 Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t border-gray-100 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total</p>
                        <p className="font-serif font-bold text-2xl text-gray-900">${finalTotal.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (
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
