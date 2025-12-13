import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from '../config';
import { X, Image as ImageIcon, Upload, Loader2, DollarSign, Package, Tag, Type } from "lucide-react";

const CATEGORIES = ["Cleanse", "Treat", "Moisturize", "Protect", "Mask", "Repair", "Makeup", "Body Care", "Lip Care"];

export default function AdminProductForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        category: "Cleanse",
        image: "",
        brand: "",
        stock: 0,
        volume: ""
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || "",
                oldPrice: initialData.oldPrice || "",
                category: initialData.category || "Cleanse",
                image: initialData.image || "",
                brand: initialData.brand || "",
                stock: initialData.stock !== undefined ? initialData.stock : 0,
                volume: initialData.volume || ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();

            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.url }));
            } else {
                alert("Upload failed: " + result.message);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed. Please check server connection.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert("Please upload an image or provide a URL");
            return;
        }
        if (parseFloat(formData.price) < 0) {
            alert("Price cannot be negative!");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">

                {/* 📸 LEFT: Media & Preview */}
                <div className="w-full md:w-5/12 bg-gray-50/80 p-6 border-r border-gray-100 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ImageIcon size={14} /> Product Image
                    </h3>

                    <div
                        className="flex-1 border-2 border-dashed border-gray-300 rounded-xl bg-white relative group overflow-hidden hover:border-pink-300 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-contain p-4"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <Upload size={32} className="mb-2 opacity-50" />
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB</span>
                            </div>
                        )}

                        {/* Overlay for Edit */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                            {formData.image ? "Change Image" : "Upload Image"}
                        </div>

                        {/* Loading State */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 text-pink-500">
                                <Loader2 size={32} className="animate-spin" />
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*"
                    />

                    {/* URL Fallback */}
                    <div className="mt-4">
                        <label className="text-xs font-semibold text-gray-400 mb-1 block">Or enter image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-pink-300 focus:border-pink-300 outline-none"
                        />
                    </div>
                </div>

                {/* 📝 RIGHT: Details Form */}
                <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {initialData ? "Edit Product" : "Add New Product"}
                            </h2>
                            <p className="text-sm text-gray-500">Fill in the details below.</p>
                        </div>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name</label>
                                    <div className="relative">
                                        <Type size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Laneige Sleeping Mask"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Brand</label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            placeholder="e.g. Laneige"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter detailed product description..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-2"></div>

                        {/* Pricing & Stock */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price ($)</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all font-semibold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Old Price ($)</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        name="oldPrice"
                                        value={formData.oldPrice}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        step="0.01"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
                                <div className="relative">
                                    <Package size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="Qty"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    initialData ? "Save Changes" : "Create Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
