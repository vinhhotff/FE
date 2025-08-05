import axios from 'axios';

console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log('Making API request to:', config.baseURL + config.url);
  console.log('Request data:', config.data);
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use((response) => {
  console.log('API response:', response.status, response.data);
  return response;
}, (error) => {
  console.error('API error:', error.response?.status, error.response?.data);
  
  // For authentication endpoints, don't re-throw certain errors
  // Let the calling code handle them gracefully
  if (error.config?.url?.includes('/auth/login') && 
      (error.response?.status === 400 || error.response?.status === 401)) {
    console.log('Authentication error intercepted, allowing graceful handling');
    return Promise.resolve({ error: error.response }); // Resolve instead of reject for specific authentication errors
  }
  
  return Promise.reject(error);
});

// Test endpoint
export const testConnection = () => api.get('/');

// AUTH
export const login = (data: { email: string, password: string }) => api.post('/auth/login', data);
export const loginStaff = (data: { email: string, password: string }) => api.post('/auth/login-staff', data);
export const refresh = () => api.get('/auth/refresh');
export const logout = () => api.post('/auth/logout');

// GUEST
export const createGuest = (data: { tableName: string, guestName: string }) => api.post('/guest', data);
export const getGuests = (params: any) => api.get('/guest', { params });
export const getGuest = (id: string) => api.get(`/guest/${id}`);
export const updateGuest = (id: string, data: any) => api.patch(`/guest/${id}`, data);
export const deleteGuest = (id: string) => api.delete(`/guest/${id}`);

// ORDER
export const createOrder = (data: any) => api.post('/order', data);
export const getOrders = (params: any) => api.get('/order', { params });
export const getOrder = (id: string) => api.get(`/order/${id}`);
export const updateOrder = (id: string, data: any) => api.patch(`/order/${id}`, data);
export const deleteOrder = (id: string) => api.delete(`/order/${id}`);

// MENU ITEM
export const getMenuItems = (params: any) => api.get('/menu-items', { params });
export const getMenuItem = (id: string) => api.get(`/menu-items/${id}`);
export const createMenuItem = (data: any) => api.post('/menu-items', data);
export const updateMenuItem = (id: string, data: any) => api.patch(`/menu-items/${id}`, data);
export const deleteMenuItem = (id: string) => api.delete(`/menu-items/${id}`);

// PAYMENT
export const getPayments = (params: any) => api.get('/payment', { params });
export const getPayment = (id: string) => api.get(`/payment/${id}`);
export const createPayment = (data: any) => api.post('/payment', data);
export const updatePayment = (id: string, data: any) => api.patch(`/payment/${id}`, data);
export const deletePayment = (id: string) => api.delete(`/payment/${id}`);

// TABLE
export const getTables = (params: any) => api.get('/table', { params });
export const getTable = (id: string) => api.get(`/table/${id}`);
export const createTable = (data: any) => api.post('/table', data);
export const updateTable = (id: string, data: any) => api.patch(`/table/${id}`, data);
export const deleteTable = (id: string) => api.delete(`/table/${id}`);

// USER
export const getUsers = (params: any) => api.get('/user', { params });
export const getUser = (id: string) => api.get(`/user/${id}`);
export const createUser = (data: any) => api.post('/user', data);
export const updateUser = (id: string, data: any) => api.patch(`/user/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/user/${id}`);

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

