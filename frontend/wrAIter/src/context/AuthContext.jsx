import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password,
        });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            name,
            email,
            password,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        // Fetch the full profile after registration
        await fetchProfile();
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data) => {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, data);
        setUser((prev) => ({ ...prev, ...response.data }));
        return response.data;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        fetchProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
