import React from "react";
import { ArrowLeft, ScrollText, ShieldCheck, RefreshCcw, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">

                {/* Intro Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-4">
                        <ScrollText size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Welcome to Girly Shop! 🎀</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        By using our app, you agree to these simple terms. We want to ensure a fair and lovely shopping experience for everyone.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6">

                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck size={20} className="text-[#FFB040]" />
                            <h3 className="font-bold text-gray-800">1. Privacy Policy</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                            <p className="mb-2">Your data is safe with us.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>We only collect info needed for delivery.</li>
                                <li>We never share your personal details with third parties.</li>
                                <li>Payments are processed securely via our partners.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <RefreshCcw size={20} className="text-blue-400" />
                            <h3 className="font-bold text-gray-800">2. Returns & Refunds</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                            <p className="mb-2">Changed your mind? No problem!</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Returns accepted within <strong>7 days</strong> of delivery.</li>
                                <li>Items must be unused and in original packaging.</li>
                                <li>Refunds are processed to your original payment method within 3-5 business days.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Truck size={20} className="text-green-500" />
                            <h3 className="font-bold text-gray-800">3. Shipping</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                            Delays can happen, but we promise to do our best. Usually standard delivery takes 1-3 days in Phnom Penh and 2-5 days for provinces.
                        </div>
                    </section>

                </div>

                <div className="mt-12 text-center text-gray-400 text-xs">
                    Last updated: December 2025
                </div>
            </div>
        </div>
    );
}
