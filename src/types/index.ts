// Backend Model Types
export interface Guest {
  _id: string;
  tableName: string;
  guestName: string;
  orders: Order[];
  payment: Payment[];
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  guest: string | Guest;
  items: {
    menuItem: string | MenuItem;
    quantity: number;
  }[];
  totalAmount: number;
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
  category?: string;
  images?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  guest: string | Guest;
  amount: number;
  method: 'cash' | 'QR' | 'card';
  status?: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  _id: string;
  tableName: string;
  status: 'available' | 'occupied';
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'USER' | 'admin' | 'staff' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Types
export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartItem extends OrderItem {
  _tempId?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAdmin: (credentials: { email: string; password: string }) => Promise<boolean>;
  loginStaff: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export interface GuestOrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  submitOrder: (guestId: string) => Promise<boolean>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GuestFormData {
  tableName: string;
  guestName: string;
}

export interface MenuItemFormData {
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
  category?: string;
}

export interface TableFormData {
  tableName: string;
  status: 'available' | 'occupied';
}

export interface PaymentFormData {
  guest: string;
  amount: number;
  method: 'cash' | 'QR' | 'card';
}

export type Role = 'ADMIN' | 'STAFF' | 'GUEST';

