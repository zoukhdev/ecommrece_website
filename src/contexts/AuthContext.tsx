'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check if there's a stored user session
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else if (storedToken) {
        // If we have a token but no user, try to decode it for demo users
        try {
          const tokenData = JSON.parse(Buffer.from(storedToken, 'base64').toString());
          
          // Check if token is expired
          if (tokenData.exp && Date.now() > tokenData.exp) {
            console.log('Token expired, clearing session');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return;
          }
          
          if (tokenData.userId && tokenData.email && tokenData.role) {
            // Create user object from token data
            const userFromToken = {
              id: tokenData.userId,
              email: tokenData.email,
              first_name: tokenData.firstName || 'Demo',
              last_name: tokenData.lastName || 'User',
              role: tokenData.role,
              is_active: true,
              created_at: new Date().toISOString()
            };
            setUser(userFromToken);
            localStorage.setItem('user', JSON.stringify(userFromToken));
          }
        } catch (tokenError) {
          console.error('Error parsing token:', tokenError);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
