import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔄 Check if user is logged in on mount
    // 🔄 Check if user is logged in on mount and fetch fresh data
    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Set immediately to avoid flash

                // Fetch fresh data from backend
                try {
                    const res = await fetch(`http://localhost:5001/api/users/${parsedUser.id}`);
                    const data = await res.json();
                    if (data.success) {
                        setUser(data.user);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                } catch (error) {
                    console.error("Failed to sync user data", error);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // 🔐 Login
    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error" };
        }
    };

    // 📝 Register
    const register = async (username, email, password) => {
        try {
            const res = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error" };
        }
    };

    // 👤 Update User Profile
    const updateUser = async (updatedData) => {
        if (!user || !user.id) return { success: false, message: "User not identified" };

        try {
            const res = await fetch(`http://localhost:5001/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                const text = await res.text();
                return { success: false, message: `Server error (${res.status}): ${text}` };
            }

            const data = await res.json();


            if (data.success) {
                // Merge with existing user data to keep things like token if present
                const newUser = { ...user, ...data.user };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error " + error.message };
        }
    };

    // 🚪 Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
