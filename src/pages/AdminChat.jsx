import React, { useState, useEffect, useRef } from "react";
import { Send, User, Mic, Video, Image as ImageIcon, Paperclip, Edit2, Trash2, MoreVertical, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

export default function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Admin connected to chat server');
            setIsConnected(true);
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

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('message_updated');
            socket.off('message_deleted');
            socket.off('disconnect');
        };
    }, []);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const msgData = {
            id: Date.now(),
            text: inputValue,
            sender: "admin", // Admin sender
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

    // 🗑️ Handle Delete
    const deleteMessage = (id) => {
        if (window.confirm("Delete this message?")) {
            socket.emit('delete_message', { id });
        }
        setContextMenu(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-6">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[85vh]">

                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 font-bold text-xl">
                            <User />
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-2xl text-gray-900">Support Chat</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {isConnected ? 'Live Connection' : 'Disconnected'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <p>No messages yet.</p>
                            <p className="text-sm">Waiting for customers to connect...</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col max-w-[70%] ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-6 py-4 rounded-3xl text-base shadow-sm ${msg.sender === 'admin'
                                        ? 'bg-gray-900 text-white rounded-tr-sm'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                                        }`}
                                >
                                    {msg.type === 'media' ? (
                                        msg.mediaType === 'image' ? (
                                            <img src={msg.mediaUrl} alt="sent" className="max-w-xs rounded-xl" />
                                        ) : (
                                            <p className="italic text-sm">[Media Message]</p>
                                        )
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 px-2 flex items-center gap-1">
                                    {msg.sender === 'admin' ? 'You' : 'Customer'} • {msg.time}
                                    {msg.sender === 'admin' && (
                                        <button
                                            onClick={() => setContextMenu(contextMenu?.id === msg.id ? null : { id: msg.id })}
                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                    )}
                                </span>
                            </div>

                            {/* Context Menu */}
                            {contextMenu?.id === msg.id && (
                                <div className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 w-32">
                                    {msg.type === 'text' && (
                                        <button
                                            onClick={() => startEdit(msg)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 flex items-center gap-2 text-rose-500 font-medium"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-3">
                        <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your reply..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all font-medium"
                        />
                        <button
                            onClick={editingMessage ? saveEdit : handleSend}
                            className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-black hover:scale-105 transition-all"
                        >
                            {editingMessage ? <RefreshCw size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
