import React, { useState, useEffect } from "react";
import { Save, Trash2, Plus, Ticket } from "lucide-react";

export default function AdminVouchers() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5001/api/vouchers')
            .then(res => res.json())
            .then(data => {
                setVouchers(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (index, field, value) => {
        const newVouchers = [...vouchers];
        newVouchers[index][field] = value;
        setVouchers(newVouchers);
    };

    const handleDelete = (index) => {
        if (window.confirm("Delete this voucher?")) {
            const newVouchers = vouchers.filter((_, i) => i !== index);
            setVouchers(newVouchers);
        }
    };

    const handleAdd = () => {
        setVouchers([...vouchers, {
            id: Date.now(),
            code: "NEW CODE",
            title: "NEW VOUCHER",
            subtitle: "DISCOUNT SUBTITLE",
            displayDiscount: "10%",
            valid: "Valid until 31 Dec",
            color: "from-pink-200 to-pink-100",
            textColor: "text-gray-800",
            type: "percentage",
            discountAmount: 0.10
        }]);
    };

    const handleSave = () => {
        fetch('http://localhost:5001/api/vouchers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vouchers)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) alert("Vouchers Saved Successfully!");
                else alert("Failed to save");
            });
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Voucher Manager</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage discounts and coupons.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all text-sm"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                {vouchers.map((v, index) => (
                    <div key={v.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Preview */}
                            <div className={`relative flex rounded-2xl overflow-hidden shadow-sm h-[140px] bg-gradient-to-r ${v.color}`}>
                                <div className="flex-[2] p-5 flex flex-col justify-center relative z-10">
                                    <h3 className={`font-serif font-bold text-lg leading-tight mb-1 ${v.textColor} uppercase`}>{v.title}</h3>
                                    <p className="text-[10px] text-gray-500 mb-4 tracking-wide">{v.subtitle}</p>
                                    <p className="text-[10px] text-gray-500 mt-auto">{v.valid}</p>
                                </div>
                                <div className="w-[1px] my-3 border-l-2 border-dashed border-gray-400/30 relative"></div>
                                <div className="flex-1 flex flex-col items-center justify-center p-2 text-center relative">
                                    <span className="text-3xl font-light text-gray-700">{v.displayDiscount}</span>
                                    <span className="text-sm font-light text-gray-600">OFF</span>
                                </div>
                            </div>

                            {/* Editors */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={v.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="Title"
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-bold uppercase"
                                    />
                                    <input
                                        type="text"
                                        value={v.displayDiscount}
                                        onChange={(e) => handleChange(index, 'displayDiscount', e.target.value)}
                                        placeholder="Ex: 30%"
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={v.subtitle}
                                    onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                                    placeholder="Subtitle"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={v.code}
                                        onChange={(e) => handleChange(index, 'code', e.target.value)}
                                        placeholder="Code (e.g. SAVE30)"
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono"
                                    />
                                    <input
                                        type="text"
                                        value={v.valid}
                                        onChange={(e) => handleChange(index, 'valid', e.target.value)}
                                        placeholder="Valid Until..."
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-400">Gradient Class:</label>
                                    <input
                                        type="text"
                                        value={v.color}
                                        onChange={(e) => handleChange(index, 'color', e.target.value)}
                                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-400 hover:text-red-600 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAdd}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-all"
                >
                    <Plus size={20} /> Add New Voucher
                </button>
            </div>
        </div>
    );
}
