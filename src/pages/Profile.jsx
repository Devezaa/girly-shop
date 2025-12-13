import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Save, User, Mail, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
    const { user, updateUser } = useAuth(); // Use updateUser from context
    const navigate = useNavigate();

    // Local state for form fields
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // 🔄 Sync local state with user context (crucial for page reloads)
    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
            // If we are NOT currently uploading a new file, sync the avatar from the user object
            // This prevents the "old" avatar from overwriting our optimistic preview
            if (!selectedFile) {
                setAvatar(user.avatar || "");
            }
        }
    }, [user, selectedFile]);

    // 🚀 Auto-Save Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Optimistic Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
        setIsSaving(true);

        // 2. Upload to Server immediately
        const formData = new FormData();
        formData.append("image", file);

        try {
            const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                // 3. Save URL to User Profile immediately
                const result = await updateUser({ ...user, avatar: uploadData.url }); // Keep existing fields, update avatar
                if (result.success) {
                    alert("Upload success!");
                    setSelectedFile(null); // Clear selected file to allow sync again
                } else {
                    alert("Failed to save profile: " + result.message);
                }
            } else {
                alert("Image upload failed: " + uploadData.message);
            }
        } catch (err) {
            alert("Upload error: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Save only for text fields now
    const handleSave = async () => {
        setIsSaving(true);
        // Only update username and email
        const result = await updateUser({ username, email, avatar: user.avatar }); // Use current stored avatar
        setIsSaving(false);

        if (result.success) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile: " + result.message);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Not Logged In</h2>
                <p className="text-gray-500 mb-6">Please login to view your profile.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-colors"
                >
                    Login Now
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-30 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            </div>

            <main className="max-w-xl mx-auto px-5 py-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                        <div className="w-28 h-28 bg-pink-100 rounded-full flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-md">
                            {avatar ? (
                                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-pink-400 font-bold">{username?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-pink-500 text-white p-2.5 rounded-full shadow-lg hover:bg-pink-600 transition-transform active:scale-95">
                            <Camera size={18} />
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm">Tap to change photo (Auto-saves)</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-2xl border-2 border-transparent focus-within:border-pink-500/20 focus-within:bg-pink-50/30 transition-all">
                            <User size={20} className="text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                placeholder="Your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-2xl border-2 border-transparent focus-within:border-pink-500/20 focus-within:bg-pink-50/30 transition-all">
                            <Mail size={20} className="text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <Save size={20} />
                    {isSaving ? "Saving..." : "Save Text Changes"}
                </motion.button>
            </main>
        </div>
    );
}
