'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, refresh } from '@/services/api';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      try {
        const res = await refresh();
        if (res.data && res.data.user) {
          setUser(res.data.user);
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
    
    // Check localStorage first for faster initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    
    checkAuth();
  }, []);

  async function loginUser(data: { email: string; password: string }) {
    try {
      const res = await login(data);
      console.log('Login response:', res.data);
      
      if (res.data && res.data.data && res.data.data.user) {
        const userData = res.data.data.user;
        const accessToken = res.data.data.accessToken;
        
        // Store user data and token
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        
        // Convert role to lowercase for consistency
        const role = userData.role.toLowerCase();
        return { success: true, role };
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return { success: false };
  }

  function logout() {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
