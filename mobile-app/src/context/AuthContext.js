import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

const AuthContext = createContext();

const AUTH_KEY = '@laliga_user_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check stored session on app start
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load auth session:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const loginUser = async (username, password) => {
    const response = await api.login(username, password);
    if (response && response.success) {
      const userData = { username };
      setUser(userData);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return response;
    } else {
      throw new Error(response?.message || 'Login failed');
    }
  };

  const registerUser = async (username, password) => {
    const response = await api.register(username, password);
    if (response && response.success) {
      const userData = { username };
      setUser(userData);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return response;
    } else {
      throw new Error(response?.message || 'Registration failed');
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
