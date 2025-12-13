import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minus, RefreshCw, Paperclip, Mic, Video, Image as ImageIcon, Edit2, Trash2, MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [contextMenu, setContextMenu] = useState(null); // { id: 123, x: 0, y: 0 }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // 🔌 Socket Connection & Listeners
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to chat server');
            socket.emit('join_chat', { room: 'global_support' });
        });

        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on('message_updated', (data) => {
            setMessages(prev => prev.map(msg => msg.id === data.id ? { ...msg, text: data.newText } : msg));
        });

        socket.on('message_deleted', (data) => {
            setMessages(prev => prev.filter(msg => msg.id !== data.id));
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('message_updated');
            socket.off('message_deleted');
        };
    }, []);

    // 📤 Send Text Message
    const handleSend = () => {
        if (!inputValue.trim()) return;

        const msgData = {
            id: Date.now(),
            text: inputValue,
            sender: "user",
            type: "text",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('send_message', msgData);
        setInputValue("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (editingMessage) {
                saveEdit();
            } else {
                handleSend();
            }
        }
    };

    // ✏️ Handle Edit
    const startEdit = (msg) => {
        setEditingMessage(msg);
        setInputValue(msg.text);
        setContextMenu(null);
    };

    const saveEdit = () => {
        if (!inputValue.trim() || !editingMessage) return;
        socket.emit('edit_message', { id: editingMessage.id, newText: inputValue });
        setEditingMessage(null);
        setInputValue("");
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setInputValue("");
    };

    // 🗑️ Handle Delete
    const deleteMessage = (id) => {
        if (window.confirm("Delete this message?")) {
            socket.emit('delete_message', { id });
        }
        setContextMenu(null);
    };

    // 📎 Handle File Upload (Image/Video)
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const msgData = {
                    id: Date.now(),
                    text: "",
                    mediaUrl: data.url,
                    mediaType: file.type.startsWith('video') ? 'video' : 'image',
                    sender: "user",
                    type: "media",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                socket.emit('send_message', msgData);
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    // 🎙️ Handle Voice Recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], "voice-note.webm", { type: 'audio/webm' });

                // Upload Audio
                const formData = new FormData();
                formData.append('image', audioFile); // Reusing 'image' field for simplicity on server

                const res = await fetch('http://localhost:5001/api/upload', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.success) {
                    const msgData = {
                        id: Date.now(),
                        mediaUrl: data.url,
                        mediaType: 'audio',
                        sender: "user",
                        type: "media",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    socket.emit('send_message', msgData);
                }

                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50">
                                        <img src="/user-avatar.jpg" alt="Support" className="w-full h-full object-cover rounded-full opacity-90" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-pink-500 rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Lovely Support</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80" title="Video Call">
                                    <Video size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                    <Minus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-tr-none'
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.type === 'media' ? (
                                            msg.mediaType === 'image' ? (
                                                <img src={msg.mediaUrl} alt="sent" className="w-full h-auto" />
                                            ) : msg.mediaType === 'video' ? (
                                                <video src={msg.mediaUrl} controls className="w-full h-auto" />
                                            ) : (
                                                <div className="p-3 flex items-center gap-2">
                                                    <Mic size={16} />
                                                    <audio src={msg.mediaUrl} controls className="h-8 w-40" />
                                                </div>
                                            )
                                        ) : (
                                            <div className="px-4 py-2.5">{msg.text}</div>
                                        )}

                                        {msg.time}
                                        {msg.sender === 'user' && (
                                            <button
                                                onClick={() => setContextMenu(contextMenu?.id === msg.id ? null : { id: msg.id })}
                                                className="ml-2 text-white/70 hover:text-white"
                                            >
                                                <MoreVertical size={12} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Context Menu */}
                                    {contextMenu?.id === msg.id && (
                                        <div className="absolute top-8 right-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 w-24">
                                            {msg.type === 'text' && (
                                                <button
                                                    onClick={() => startEdit(msg)}
                                                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />

                            <div className="relative flex items-center gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                                >
                                    <Paperclip size={20} />
                                </button>

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all placeholder:text-gray-400"
                                />

                                {inputValue.trim() ? (
                                    <button
                                        onClick={editingMessage ? saveEdit : handleSend}
                                        className="absolute right-0 w-9 h-9 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {editingMessage ? <RefreshCw size={16} /> : <Send size={16} className="ml-0.5" />}
                                    </button>
                                ) : (
                                    <button
                                        onMouseDown={startRecording}
                                        onMouseUp={stopRecording}
                                        onMouseLeave={stopRecording}
                                        className={`absolute right-0 w-9 h-9 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 text-gray-500 hover:text-pink-500'} rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer`}
                                    >
                                        <Mic size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-colors duration-300 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-pink-500/30'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div >
    );
}
