import React, { useState, useEffect, useRef } from "react";
import { Send, User, Mic, Video, Image as ImageIcon, Paperclip, Edit2, Trash2, MoreVertical, RefreshCw, MessageSquare, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

const socket = io(API_BASE_URL);

// Mock Active Rooms (in real app, fetch from API)
const ACTIVE_ROOMS = [
    { id: 'global_support', name: 'General Support', lastMsg: 'Can you help me?', time: '2m', unread: 2 },
    { id: 'user_123', name: 'Sarah J.', lastMsg: 'Order #445 is late', time: '1h', unread: 0 },
    { id: 'user_456', name: 'Mike T.', lastMsg: 'Thanks for the info!', time: '3h', unread: 0 },
];

export default function AdminChat() {
    const [activeRoom, setActiveRoom] = useState('global_support');
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
            socket.emit('join_chat', { room: activeRoom });
        });

        // 🚀 Optimistic UI: We append local message immediately, so we filter out duplicates from server echo
        socket.on('receive_message', (data) => {
            setMessages((prev) => {
                // Check if message already exists (by temp ID or similar content/timestamp)
                const exists = prev.some(m => m.id === data.id);
                if (exists) return prev;
                return [...prev, data];
            });
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
    }, [activeRoom]);

    // Handle Room Switch
    const switchRoom = (roomId) => {
        if (roomId === activeRoom) return;
        socket.emit('leave_chat', { room: activeRoom });
        setActiveRoom(roomId);
        setMessages([]); // Clear messages or fetch history for new room
        socket.emit('join_chat', { room: roomId });
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const msgData = {
            id: Date.now(),
            text: inputValue,
            sender: "admin",
            type: "text",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            room: activeRoom
        };

        // 🚀 Optimistic Update: Add to UI immediately
        setMessages(prev => [...prev, msgData]);

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

        // Optimistic update for edit
        setMessages(prev => prev.map(msg => msg.id === editingMessage.id ? { ...msg, text: inputValue } : msg));

        socket.emit('edit_message', { id: editingMessage.id, newText: inputValue });
        setEditingMessage(null);
        setInputValue("");
    };

    // 🗑️ Handle Delete
    const deleteMessage = (id) => {
        if (window.confirm("Delete this message?")) {
            // Optimistic update for delete
            setMessages(prev => prev.filter(msg => msg.id !== id));
            socket.emit('delete_message', { id });
        }
        setContextMenu(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-6 h-screen">
            <div className="max-w-6xl mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex h-full">

                {/* 🗂️ Sidebar - Rooms List */}
                <div className="w-80 border-r border-gray-100 bg-gray-50/30 flex flex-col">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <MessageSquare size={20} className="text-pink-500" /> Inbox
                        </h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {ACTIVE_ROOMS.map(room => (
                            <div
                                key={room.id}
                                onClick={() => switchRoom(room.id)}
                                className={`p-3 rounded-xl cursor-pointer transition-all ${activeRoom === room.id
                                        ? 'bg-white shadow-md shadow-gray-100 border border-gray-100'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold text-sm ${activeRoom === room.id ? 'text-gray-900' : 'text-gray-600'}`}>{room.name}</h3>
                                    <span className="text-[10px] text-gray-400">{room.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 truncate max-w-[140px]">{room.lastMsg}</p>
                                    {room.unread > 0 && (
                                        <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {room.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💬 Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-50 rounded-full flex items-center justify-center text-pink-500 font-bold">
                                {activeRoom === 'global_support' ? <User size={20} /> : activeRoom.charAt(5).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">
                                    {ACTIVE_ROOMS.find(r => r.id === activeRoom)?.name || 'Support Chat'}
                                </h1>
                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {isConnected ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><Search size={18} /></button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-6 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-20">
                                <p className="mb-2">No messages in this thread yet.</p>
                                <p className="text-sm">Start the conversation!</p>
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
                                        className={`px-5 py-3 rounded-2xl text-[15px] shadow-sm relative group ${msg.sender === 'admin'
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

                                        {/* Context Menu Trigger */}
                                        {msg.sender === 'admin' && (
                                            <button
                                                onClick={() => setContextMenu(contextMenu?.id === msg.id ? null : { id: msg.id })}
                                                className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm border border-gray-100"
                                            >
                                                <MoreVertical size={12} />
                                            </button>
                                        )}

                                        {/* Context Menu Dropdown */}
                                        {contextMenu?.id === msg.id && (
                                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 w-32 overflow-hidden">
                                                {msg.type === 'text' && (
                                                    <button
                                                        onClick={() => startEdit(msg)}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
                                                    >
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
                                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-rose-50 flex items-center gap-2 text-rose-500 font-medium"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium">
                                        {msg.time}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 bg-white border-t border-gray-100">
                        <div className="relative flex items-center gap-3">
                            <button className="p-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your reply..."
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 transition-all font-medium text-sm placeholder:text-gray-400"
                            />
                            <button
                                onClick={editingMessage ? saveEdit : handleSend}
                                className="bg-gray-900 text-white p-3.5 rounded-xl shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all"
                            >
                                {editingMessage ? <RefreshCw size={18} /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
