'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        setTimeout(() => {
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }, 100);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
