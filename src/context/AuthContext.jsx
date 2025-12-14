import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Global initial load
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    /**
     * 🔄 Silent Refresh Token Logic
     * Used to obtain a new access token without logging the user out.
     */
    const refreshAccessToken = useCallback(async () => {
        // Implement refresh logic here.
        // Usually involves sending a refresh token (HttpOnly cookie or localStorage) to /api/auth/refresh
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken'); // Assuming we store one
            if (!storedRefreshToken) return false;

            const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            const data = await res.json();
            if (data.success && data.token) {
                localStorage.setItem('token', data.token); // Update access token
                return true;
            }
        } catch (error) {
            console.error("Refresh token failed", error);
        }
        return false;
    }, []);

    /**
     * 🛡️ Authorized Fetch Wrapper
     * Automatically attempts to refresh token on 401 Unauthorized.
     */
    const authFetch = useCallback(async (url, options = {}) => {
        let token = localStorage.getItem('token');
        const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };

        let res = await fetch(url, { ...options, headers });

        // If unauthorized, try to refresh token and retry request once
        if (res.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = localStorage.getItem('token');
                const newHeaders = { ...options.headers, 'Authorization': `Bearer ${token}` };
                res = await fetch(url, { ...options, headers: newHeaders });
            } else {
                logout(); // Refresh failed, force logout
            }
        }
        return res;
    }, [refreshAccessToken]);

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
                    const res = await authFetch(`${API_BASE_URL}/api/users/${parsedUser.id}`);

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success) {
                            setUser(data.user);
                            localStorage.setItem('user', JSON.stringify(data.user));
                        }
                    }
                } catch (error) {
                    console.error("Failed to sync user data", error);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, [authFetch]);

    // 🔐 Login
    const login = async (email, password) => {
        setIsLoggingIn(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error" };
        } finally {
            setIsLoggingIn(false);
        }
    };

    // 📝 Register
    const register = async (username, email, password) => {
        setIsRegistering(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error" };
        } finally {
            setIsRegistering(false);
        }
    };

    // 👤 Update User Profile
    const updateUser = async (updatedData) => {
        if (!user || !user.id) return { success: false, message: "User not identified" };

        try {
            const res = await authFetch(`${API_BASE_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                const text = await res.text();
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
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            updateUser,
            loading,       // Initial app load
            isLoggingIn,   // Login button spinner
            isRegistering  // Register button spinner
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
