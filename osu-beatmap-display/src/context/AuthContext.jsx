import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create and export named context
export const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

// 2. Named provider component
export const AuthProvider = ({ children }) => {
  const VITE_API_LINK = import.meta.env.VITE_API_LINK;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${VITE_API_LINK}/api/auth/profile/`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${VITE_API_LINK}/api/auth/login/`, {
        username,
        password
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      const userResponse = await axios.get(`${VITE_API_LINK}/api/auth/profile/`);
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (username, password, email) => {
    try {
      await axios.post(`${VITE_API_LINK}/api/auth/register/`, {
        username,
        password,
        email
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Named hook export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};