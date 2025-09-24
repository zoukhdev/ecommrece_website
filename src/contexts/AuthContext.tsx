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
      console.log('🔍 AuthContext: Checking user session...');
      
      // Check if there's a stored user session
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      console.log('🔍 AuthContext: storedUser:', storedUser ? 'exists' : 'null');
      console.log('🔍 AuthContext: storedToken:', storedToken ? 'exists' : 'null');
      
      if (storedUser) {
        console.log('🔍 AuthContext: Found stored user, parsing...');
        const parsedUser = JSON.parse(storedUser);
        console.log('🔍 AuthContext: Parsed user:', parsedUser);
        setUser(parsedUser);
      } else if (storedToken) {
        console.log('🔍 AuthContext: No stored user, checking token...');
        // If we have a token but no user, try to decode it for demo users
        try {
          const tokenData = JSON.parse(Buffer.from(storedToken, 'base64').toString());
          console.log('🔍 AuthContext: Token data:', tokenData);
          
          // Check if token is expired
          if (tokenData.exp && Date.now() > tokenData.exp) {
            console.log('🔍 AuthContext: Token expired, clearing session');
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
            console.log('🔍 AuthContext: Created user from token:', userFromToken);
            setUser(userFromToken);
            localStorage.setItem('user', JSON.stringify(userFromToken));
          }
        } catch (tokenError) {
          console.error('🔍 AuthContext: Error parsing token:', tokenError);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('🔍 AuthContext: No stored user or token found');
      }
    } catch (error) {
      console.error('🔍 AuthContext: Error checking user:', error);
    } finally {
      setLoading(false);
      console.log('🔍 AuthContext: Loading set to false');
    }
  };

  const login = (userData: User) => {
    console.log('🔍 AuthContext: Login called with user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('🔍 AuthContext: User stored in localStorage');
  };

  const logout = async () => {
    console.log('🔍 AuthContext: Logout called');
    try {
      await signOut();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('🔍 AuthContext: User session cleared');
    } catch (error) {
      console.error('🔍 AuthContext: Error during logout:', error);
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
