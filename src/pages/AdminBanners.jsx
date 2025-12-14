import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { Save, Trash2, Plus, Image as ImageIcon, Loader2, Upload, ChevronUp, ChevronDown } from "lucide-react";

export default function AdminBanners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/banners`)
            .then(res => res.json())
            .then(data => {
                setBanners(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (index, field, value) => {
        const newBanners = [...banners];
        newBanners[index][field] = value;
        setBanners(newBanners);
    };

    const handleDelete = (index) => {
        if (window.confirm("Delete this banner?")) {
            const newBanners = banners.filter((_, i) => i !== index);
            setBanners(newBanners);
        }
    };

    const handleMove = (index, direction) => {
        const newBanners = [...banners];
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newBanners.length) return;

        // Swap items
        const temp = newBanners[index];
        newBanners[index] = newBanners[targetIndex];
        newBanners[targetIndex] = temp;

        setBanners(newBanners);
    };

    const handleAdd = () => {
        setBanners([...banners, {
            id: Date.now(),
            src: "",
            title: "New Banner",
            subtitle: "Subtitle goes here",
            btnText: "Shop Now"
        }]);
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                handleChange(index, 'src', data.url);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        // Validation Logic
        const isInvalid = banners.some(b => !b.src || !b.title.trim());
        if (isInvalid) {
            alert("Please ensure all banners have both an Image and a Title before saving.");
            return;
        }

        fetch(`${API_BASE_URL}/api/banners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(banners)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) alert("Banners Saved Successfully!");
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
                        <h1 className="text-xl font-bold text-gray-900">Banner Manager</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage homepage carousel slides.</p>
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
                {banners.map((banner, index) => (
                    <div key={banner.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start group">

                        {/* Order Controls */}
                        <div className="flex flex-col gap-1 pt-2">
                            <button
                                onClick={() => handleMove(index, -1)}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                            >
                                <ChevronUp size={20} />
                            </button>
                            <span className="text-xs font-bold text-gray-400 text-center">{index + 1}</span>
                            <button
                                onClick={() => handleMove(index, 1)}
                                disabled={index === banners.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Image Preview / Upload */}
                        <div className="w-full md:w-1/3 aspect-video bg-gray-100 rounded-xl overflow-hidden relative cursor-pointer border-2 border-transparent hover:border-pink-300 transition-colors">
                            {banner.src ? (
                                <img src={banner.src} className="w-full h-full object-cover" alt="Banner" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={32} />
                                    <span className="text-xs mt-2">No Image</span>
                                </div>
                            )}

                            {/* Upload Overlay */}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer">
                                {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                                <span className="text-xs font-bold mt-2">Change Image</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={banner.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        className={`w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none font-bold ${!banner.title.trim() ? 'border-red-300' : 'border-gray-200'}`}
                                        placeholder="Banner Title"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Button Text</label>
                                    <input
                                        type="text"
                                        value={banner.btnText}
                                        onChange={(e) => handleChange(index, 'btnText', e.target.value)}
                                        className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                                <textarea
                                    value={banner.subtitle}
                                    onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                                    rows="2"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-red-400 hover:text-red-600 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} /> Remove Banner
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Button */}
                <button
                    onClick={handleAdd}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-all"
                >
                    <Plus size={20} /> Add New Banner
                </button>
            </div>
        </div>
    );
}
