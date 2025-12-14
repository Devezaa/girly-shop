import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Vouchers() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");
    const [copiedId, setCopiedId] = useState(null);
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/vouchers`)
            .then(res => res.json())
            .then(data => setVouchers(data))
            .catch(err => console.error(err));
    }, []);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // 🏷️ Filtered List
    const filteredVouchers = vouchers.filter(v => activeTab === 'All' || v.type === activeTab);

    return (
        <div className="min-h-screen bg-[#FFFBEF] pb-10 pt-4 font-sans px-5 md:px-0">
            <div className="max-w-7xl mx-auto">

                {/* 🔙 Header / Title */}
                <div className="flex items-center gap-4 px-6 md:px-0 py-6 md:py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-[#FFB040] hover:scale-110 transition-all border border-gray-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Vouchers</h2>
                        <p className="hidden md:block text-gray-500 text-sm">Manage your discounts and special offers</p>
                    </div>
                </div>

                {/* 🏷️ Tabs */}
                <div className="px-6 md:px-0 flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
                    {["All", "Face", "Hair", "Body"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? "bg-[#FFB040] text-white shadow-md shadow-orange-200"
                                : "bg-white text-[#FFB040] border border-[#FFB040]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 🎟️ Voucher List */}
                <div className="px-6 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVouchers.map((v) => (
                        <div key={v.id} className={`relative flex rounded-2xl overflow-hidden shadow-sm min-h-[140px] bg-gradient-to-r ${v.color}`}>
                            {/* Left Side (Content) */}
                            <div className="flex-[2] p-5 flex flex-col justify-center relative z-10">
                                <h3 className={`font-serif font-bold text-lg leading-tight mb-1 ${v.textColor} uppercase`}>
                                    {v.title}
                                </h3>
                                <p className="text-[10px] text-gray-500 mb-4 tracking-wide">
                                    {v.subtitle}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-auto">
                                    {v.valid}
                                </p>
                            </div>

                            {/* Dashed Line Divider */}
                            <div className="w-[1px] my-3 border-l-2 border-dashed border-gray-400/30 relative">
                                {/* Matched Background Cutouts (#FFFBEF) */}
                                <div className="absolute -top-4 -left-2 w-4 h-4 bg-[#FFFBEF] rounded-full" />
                                <div className="absolute -bottom-4 -left-2 w-4 h-4 bg-[#FFFBEF] rounded-full" />
                            </div>

                            {/* Right Side (Discount) */}
                            <div className="flex-1 flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-white/30 relative">
                                <span className="text-4xl font-light text-gray-700">{v.displayDiscount}</span>
                                <span className="text-sm font-light text-gray-600 mb-2">OFF</span>

                                <button
                                    onClick={() => handleCopy(v.code, v.id)}
                                    className="bg-white/40 hover:bg-white/60 text-gray-800 p-1.5 rounded-full transition-all active:scale-90"
                                    title="Copy Code"
                                >
                                    {copiedId === v.id ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 📄 Terms Section */}
                <div className="px-6 mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
                        <div className="flex justify-center gap-6 mb-4 border-b border-gray-100 pb-2">
                            <button className="text-xs font-bold text-gray-800 border-b-2 border-gray-800 pb-2">Terms & Condition</button>
                            <button className="text-xs text-gray-400 pb-2">About</button>
                            <button className="text-xs text-gray-400 pb-2">How to use voucher</button>
                        </div>
                        <ul className="list-disc pl-4 text-[11px] text-gray-600 space-y-1 leading-relaxed">
                            <li>Voucher is eligible for all products</li>
                            <li>The voucher can be redeemed until the expired date</li>
                            <li>Valid for only one transaction</li>
                            <li>The voucher cannot be used with other promotions</li>
                            <li>The voucher you recieved cannot be swapped with other voucher...</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
