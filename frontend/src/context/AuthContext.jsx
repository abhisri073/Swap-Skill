// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket.js'; // Import the socket instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthHeader(token);
      // Register user with socket.io when authenticated
      if (parsedUser._id) { // Ensure _id exists
        socket.emit('registerUser', parsedUser._id);
      }
    }
    setLoading(false);
  }, []); // Run once on component mount

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthHeader(token);
      setUser(userData);
      
      // Register user with socket.io after successful login
      if (userData._id) {
        socket.emit('registerUser', userData._id);
      }

    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      throw error; 
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthHeader(null);
    setUser(null);
    // Disconnect socket or unregister user
    socket.emit('unregisterUser', user._id); // Optional: if you want to explicitly unregister
    socket.disconnect(); // Or just let the server handle disconnect on page close
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};