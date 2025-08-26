import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (token exists in localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Add token to default headers for all future requests
          api.setAuthToken(token);
          // Validate token by getting current user info
          const data = await api.auth.getCurrentUser();
          if (data.success && data.data) {
            setUser(data.data);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('token');
            api.setAuthToken(null);
            setUser(null);
          }
        } else {
          api.setAuthToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
        api.setAuthToken(null);
        setUser(null);
        setError('Authentication failed. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login user
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.auth.login(credentials);
      if (response.success && response.token && response.data) {
        // Store token and setup auth
        api.setAuthToken(response.token);
        // Set user data
        setUser(response.data);
        return {
          success: true,
          token: response.token,
          data: response.data
        };
      } else {
        const errorMsg = response.error || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.auth.register(userData);
      if (data.success && data.token) {
        setUser(data.data);
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Registration failed');
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API fails, remove token from local storage
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.auth.updateUserDetails(userData);
      if (data.success && data.data) {
        // Update user state with new user data
        setUser(data.data);
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Profile update failed');
        return { success: false, error: data.error || 'Profile update failed' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.auth.updatePassword(passwordData);
      if (data.success) {
        return { success: true };
      } else {
        setError(data.error || 'Password update failed');
        return { success: false, error: data.error || 'Password update failed' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Password update failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser,
        isLoading, 
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        setError,
        isAuthenticated: !!user,
        setAuth: ({ token, user }) => {
          localStorage.setItem('token', token);
          api.setAuthToken(token);
          setUser(user);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
