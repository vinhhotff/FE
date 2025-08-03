'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, loginStaff, refresh } from '@/services/api';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAdmin: (data: { email: string; password: string }) => Promise<boolean>;
  loginStaff: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used in AuthProvider');
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
        if (res.data && res.data.user) setUser(res.data.user);
        else setUser(null);
      } catch { setUser(null); }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function loginAdmin(data: { email: string; password: string }) {
    try {
      const res = await login(data);
      if (res.data && res.data.user) { setUser(res.data.user); return true; }
    } catch { /* fail silently for UX */ }
    return false;
  }

  async function loginStaffFunc(data: { email: string; password: string }) {
    try {
      const res = await loginStaff(data);
      if (res.data && res.data.user) { setUser(res.data.user); return true; }
    } catch { /* fail silently for UX */ }
    return false;
  }

  function logout() {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    setUser(null);
    window.location.href = '/admin/login';
  }
  return <AuthContext.Provider value={{ user, loading, loginAdmin, loginStaff: loginStaffFunc, logout }}>{children}</AuthContext.Provider>;
}

