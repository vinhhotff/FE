'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, loginStaff as loginStaffAPI, refresh, logout as logoutAPI } from '@/services/api';
import Cookies from 'js-cookie';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; role?: string }>;
  loginAdmin: (data: { email: string; password: string }) => Promise<boolean>;
  loginStaff: (data: { email: string; password: string }) => Promise<boolean>;
  logout: (redirectTo?: string) => void;
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
      
      // Check localStorage first for faster initial load
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('accessToken');
      
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return; // Không cần gọi refresh nữa
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }
      
      // Nếu không có stored data thì thử refresh từ backend
      if (!storedUser || !storedToken) {
        try {
          const res = await refresh();
          if (res.data && res.data.data && res.data.data.user) {
            const userData = res.data.data.user;
            const accessToken = res.data.data.accessToken;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', accessToken);
          } else {
            setUser(null);
          }
        } catch {
          // Nếu refresh fail thì user chưa login
          setUser(null);
        }
      }
      
      setLoading(false);
    }
    
    checkAuth();
  }, []);

  async function loginUser(data: { email: string; password: string }): Promise<{ success: boolean; role?: string }> {
    // Wrap everything in a try-catch to absolutely prevent any errors from escaping
    try {
      console.log('Starting login process...');
      
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
          
          // Show success toast
          toast.success(`Welcome back, ${userData.name}!`);
          
          // Convert role to lowercase for consistency
          const role = userData.role.toLowerCase();
          return { success: true, role };
        } else {
          // Login failed - wrong credentials
          toast.error('Invalid email or password. Please try again.');
          return { success: false };
        }
      } catch (apiError: any) {
        console.error('API Error in loginUser:', apiError);
        
        // Handle different error types with more specific error messages
        if (apiError.response?.status === 400) {
          // Bad request - usually invalid credentials
          toast.error('Invalid email or password. Please try again.');
        } else if (apiError.response?.status === 401) {
          // Unauthorized
          toast.error('Invalid email or password. Please try again.');
        } else if (apiError.response?.status === 403) {
          // Forbidden
          toast.error('Access denied. Please check your credentials.');
        } else if (apiError.response?.status >= 500) {
          // Server errors
          toast.error('Server error. Please try again later.');
        } else if (apiError.code === 'NETWORK_ERROR' || apiError.message?.includes('Network Error')) {
          // Network errors
          toast.error('Network error. Please check your connection.');
        } else if (apiError.response?.data?.message) {
          // Custom error message from server
          toast.error(apiError.response.data.message);
        } else if (apiError.name === 'AxiosError') {
          // Generic Axios error
          toast.error('Login failed. Please check your credentials and try again.');
        } else {
          // Fallback error
          toast.error('Login failed. Please try again.');
        }
        
        // Always return success: false instead of throwing the error
        return { success: false };
      }
    } catch (outerError: any) {
      // This should never happen, but just in case
      console.error('Outer error in loginUser:', outerError);
      toast.error('An unexpected error occurred. Please try again.');
      return { success: false };
    }
  }

  async function loginAdmin(data: { email: string; password: string }) {
    try {
      const res = await login(data);
      console.log('Admin login response:', res.data);
      
      if (res.data && res.data.data && res.data.data.user) {
        const userData = res.data.data.user;
        const accessToken = res.data.data.accessToken;
        
        // Check if user is admin
        if (userData.role.toLowerCase() !== 'admin') {
          toast.error('Access denied. Admin privileges required.');
          return false;
        }
        
        // Store user data and token
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        
        // Show success toast
        toast.success(`Welcome back, Admin ${userData.name}!`);
        return true;
      } else {
        // Login failed - wrong credentials
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      console.error('Admin login failed:', error);
      
      // Handle different error types
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
    return false;
  }

  async function loginStaffUser(data: { email: string; password: string }) {
    try {
      const res = await loginStaffAPI(data);
      console.log('Staff login response:', res.data);
      
      if (res.data && res.data.data && res.data.data.user) {
        const userData = res.data.data.user;
        const accessToken = res.data.data.accessToken;
        
        // Store user data and token
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        
        // Show success toast
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        // Login failed - wrong credentials
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      console.error('Staff login failed:', error);
      
      // Handle different error types
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Staff privileges required.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
    return false;
  }

  async function logout(redirectTo?: string) {
    try {
      // Call logout API to remove refresh token from server
      await logoutAPI();
      console.log('Logout API called successfully');
    } catch (error) {
      console.error('Logout API failed:', error);
      // Continue with logout process even if API fails
    }
    
    // Clear local storage and cookies
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to specified page or default to login after a short delay to allow toast to be seen
    const finalRedirectTo = redirectTo || '/login';
    setTimeout(() => {
      window.location.href = finalRedirectTo;
    }, 1500);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: loginUser, loginAdmin, loginStaff: loginStaffUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
