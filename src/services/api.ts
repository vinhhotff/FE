import { Guest, Order, MenuItem, Payment, Table, User } from '@/types';
import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // For authentication endpoints, don't re-throw certain errors
  // Let the calling code handle them gracefully
  if (error.config?.url?.includes('/auth/login') &&
      (error.response?.status === 400 || error.response?.status === 401)) {
    return Promise.resolve({ error: error.response }); // Resolve instead of reject for specific authentication errors
  }

  return Promise.reject(error);
});
// AUTH
export const login = (data: { email: string, password: string }) => api.post('/auth/login', data);
export const loginStaff = (data: { email: string, password: string }) => api.post('/auth/login-staff', data);
export const refresh = () => api.get('/auth/refresh');
export const logout = () => api.post('/auth/logout');
// GUEST
export const createGuest = (data: { tableName: string, guestName: string }) => api.post<Guest>('/guest', data);
export const getGuests = (params: Record<string, unknown>) => api.get<Guest[]>('/guest', { params });
export const getGuest = (id: string) => api.get<Guest>(`/guest/${id}`);
export const updateGuest = (id: string, data: Partial<Guest>) => api.patch<Guest>(`/guest/${id}`, data);
export const deleteGuest = (id: string) => api.delete<void>(`/guest/${id}`);

// ORDER
export const createOrder = (data: Partial<Order>) => api.post<Order>('/order', data);
export const getOrders = (params: Record<string, unknown>) => api.get<Order[]>('/order', { params });
export const getOrder = (id: string) => api.get<Order>(`/order/${id}`);
export const updateOrder = (id: string, data: Partial<Order>) => api.patch<Order>(`/order/${id}`, data);
export const deleteOrder = (id: string) => api.delete<void>(`/order/${id}`);

// FILE UPLOAD
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<{ data: { _id: string } }>('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// MENU ITEM
export const getMenuItems = (params: Record<string, unknown>) => api.get<MenuItem[]>('/menu-items', { params });
export const getMenuItem = (id: string) => api.get<MenuItem>(`/menu-items/${id}`);
export const createMenuItem = (data: Partial<MenuItem>) => api.post<MenuItem>('/menu-items', data);
export const updateMenuItem = (id: string, data: Partial<MenuItem>) => api.patch<MenuItem>(`/menu-items/${id}`, data);
export const deleteMenuItem = (id: string) => api.delete<void>(`/menu-items/${id}`);

// PAYMENT
export const getPayments = (params: Record<string, unknown>) => api.get<Payment[]>('/payment', { params });
export const getPayment = (id: string) => api.get<Payment>(`/payment/${id}`);
export const createPayment = (data: Partial<Payment>) => api.post<Payment>('/payment', data);
export const updatePayment = (id: string, data: Partial<Payment>) => api.patch<Payment>(`/payment/${id}`, data);
export const deletePayment = (id: string) => api.delete<void>(`/payment/${id}`);

// TABLE
export const getTables = (params: Record<string, unknown>) => api.get<Table[]>('/table', { params });
export const getTable = (id: string) => api.get<Table>(`/table/${id}`);
export const createTable = (data: Partial<Table>) => api.post<Table>('/table', data);
export const updateTable = (id: string, data: Partial<Table>) => api.patch<Table>(`/table/${id}`, data);
export const deleteTable = (id: string) => api.delete<void>(`/table/${id}`);

// USER
export const getUsers = (params: Record<string, unknown>) => api.get<User[]>('/user', { params });
export const getUser = (id: string) => api.get<User>(`/user/${id}`);
export const createUser = (data: Partial<User>) => api.post<User>('/user', data);
export const updateUser = (id: string, data: Partial<User>) => api.patch<User>(`/user/${id}`, data);
export const deleteUser = (id: string) => api.delete<void>(`/user/${id}`);

// ANALYTICS
export const getTodayStats = () => api.get('/analytics/today');
export const getWeeklyTrends = () => api.get('/analytics/weekly-trends');

// Helper functions for frontend
export const fetchTables = async () => {
  try {
    const response = await getTables({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};

export const fetchOrders = async () => {
  try {
    const response = await getOrders({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const fetchPayments = async () => {
  try {
    const response = await getPayments({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const fetchMenuItems = async () => {
  try {
    const response = await getMenuItems({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const fetchGuests = async () => {
  try {
    const response = await getGuests({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await getUsers({});
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

