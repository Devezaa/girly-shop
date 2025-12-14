import React from "react";
import { ArrowLeft, Ticket, CheckCircle2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VoucherGuide() {
    const navigate = useNavigate();

    const steps = [
        {
            title: "Find Your Code",
            desc: "Go to the 'Vouchers' page. Find a coupon that you like and copy the code (e.g., SAVE30).",
            icon: <Ticket className="text-pink-500" />,
            color: "bg-pink-50"
        },
        {
            title: "Shop Your Favorites",
            desc: "Add items to your cart. Make sure you meet the minimum spend requirement if there is one.",
            icon: <ShoppingBag className="text-blue-500" />,
            color: "bg-blue-50"
        },
        {
            title: "Apply at Checkout",
            desc: "On the Checkout page, paste the code in the 'Promo Code' box and tap Apply.",
            icon: <CheckCircle2 className="text-green-500" />,
            color: "bg-green-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Header - Glassmorphism */}
            <div className="sticky top-0 z-30 px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-[#FFFBF2]/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">How to use Voucher?</h1>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8">

                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Save More with Vouchers! 💸</h2>
                    <p className="text-gray-500">A simple 3-step guide to claiming your discounts.</p>
                </div>

                <div className="space-y-8 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.5 }}
                            className="flex gap-6"
                        >
                            <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${step.color} z-10`}>
                                {step.icon}
                            </div>
                            <div className="pt-2">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">Step {idx + 1}: {step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-12 bg-gray-50 rounded-2xl p-6 text-center"
                >
                    <p className="font-medium text-gray-800 mb-4">Ready to save?</p>
                    <button
                        onClick={() => navigate('/vouchers')}
                        className="bg-[#FFB040] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform"
                    >
                        Get Vouchers Now
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
