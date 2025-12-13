import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔄 Check if user is logged in on mount
    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser && storedToken) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // Fetch fresh data from backend (with token)
                try {
                    const res = await fetch(`http://localhost:5001/api/users/${parsedUser.id}`, {
                        headers: { 'Authorization': `Bearer ${storedToken}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success) {
                            setUser(data.user);
                            localStorage.setItem('user', JSON.stringify(data.user));
                        }
                    } else {
                        // If token invalid/expired, logout
                        logout();
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
                localStorage.setItem('token', data.token); // Store Token
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
                localStorage.setItem('token', data.token); // Store Token
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
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5001/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                const text = await res.text();
                // Handle unauthorized (401/403) by logging out potentially
                if (res.status === 401 || res.status === 403) {
                    return { success: false, message: "Session expired, please login again." };
                }
                return { success: false, message: `Server error (${res.status}): ${text}` };
            }

            const data = await res.json();

            if (data.success) {
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
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
