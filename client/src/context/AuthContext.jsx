import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check token in localStorage (persistent) or sessionStorage (session)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // You could add a verify token endpoint and check token validity here
      const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      setUser(userData);
    } else {
      console.log('AuthContext useEffect - no token found');
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = true) => {
    try {
      console.log('Attempting login to:', `${API_URL}/api/auth/login`);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'An error occurred',
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      console.log('Attempting signup to:', `${API_URL}/api/auth/signup`);
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'An error occurred',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, rememberMe, setRememberMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 