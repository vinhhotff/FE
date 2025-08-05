'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchMenuItems, fetchOrders } from '@/services/api';
import toast from 'react-hot-toast';
import {
  HomeIcon,
  UserIcon,
  ClockIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  isPopular: boolean;
}

interface Order {
  _id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function UserHome() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalFavorites: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load data
    loadUserData();
  }, [user, router]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading user dashboard data...');

      // Fetch data in parallel for better performance
      const [menuItemsData, ordersData] = await Promise.all([
        fetchMenuItems().catch(err => {
          console.error('Error fetching menu items:', err);
          return [];
        }),
        fetchOrders().catch(err => {
          console.error('Error fetching orders:', err);
          return [];
        })
      ]);

      console.log('Menu Items Data:', menuItemsData);
      console.log('Orders Data:', ordersData);

      // Process menu items - filter popular items
      if (Array.isArray(menuItemsData)) {
        // Get popular items (you can filter by rating > 4.5 or isPopular field)
        const popular = menuItemsData
          .filter(item => item.rating >= 4.5 || item.isPopular)
          .slice(0, 6); // Limit to 6 items
        
        setPopularItems(popular);
        console.log('Popular items:', popular);
      } else {
        console.warn('Menu items data is not an array:', menuItemsData);
        setPopularItems([]);
      }

      // Process orders - filter user's orders if possible
      if (Array.isArray(ordersData)) {
        // Filter orders for current user if backend provides user-specific orders
        // For now, we'll take all orders as example
        const userOrders = ordersData
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10); // Get latest 10 orders
        
        setRecentOrders(userOrders);
        
        // Calculate stats
        const stats = {
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          totalFavorites: favoriteItems.length
        };
        
        setOrderStats(stats);
        console.log('User orders:', userOrders);
        console.log('Order stats:', stats);
      } else {
        console.warn('Orders data is not an array:', ordersData);
        setRecentOrders([]);
        setOrderStats({
          totalOrders: 0,
          totalSpent: 0,
          totalFavorites: favoriteItems.length
        });
      }

      toast.success('Dashboard data loaded successfully!');
    } catch (error: any) {
      console.error('Error loading user data:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
      
      // Set fallback data to prevent empty dashboard
      setPopularItems([]);
      setRecentOrders([]);
      setOrderStats({
        totalOrders: 0,
        totalSpent: 0,
        totalFavorites: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const navigation = [
    { name: 'Home', id: 'home', icon: HomeIcon },
    { name: 'Menu', id: 'menu', icon: ShoppingCartIcon },
    { name: 'Orders', id: 'orders', icon: ClockIcon },
    { name: 'Favorites', id: 'favorites', icon: HeartIcon },
    { name: 'Profile', id: 'profile', icon: UserIcon },
  ];

  const renderHome = () => (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={loadUserData}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-orange-100 text-lg">Ready to order something delicious?</p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl">🍽️</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button 
            onClick={() => router.push('/user/menu')}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
          >
            Order Now
          </button>
          <button 
            onClick={() => router.push('/user/menu')}
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{recentOrders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <HeartIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{favoriteItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${recentOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Items</h2>
          <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
            View All <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
                <button 
                  onClick={() => toggleFavorite(item._id)}
                  className="ml-2 p-1"
                >
                  {favoriteItems.includes(item._id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">{item.rating}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${item.price}</p>
                  <button className="bg-orange-600 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-700 transition mt-1">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
              View All <ChevronRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-green-600 capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome();
      case 'menu':
        return (
          <div className="text-center py-20">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Coming Soon</h2>
            <p className="text-gray-500">Browse our delicious menu items</p>
          </div>
        );
      case 'orders':
        return (
          <div className="text-center py-20">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
            <p className="text-gray-500">View your past orders</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Favorites</h2>
            <p className="text-gray-500">Items you love</p>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <UserIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-orange-600 capitalize">Role: {user?.role}</p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Notifications</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">SMS Notifications</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <button 
                  onClick={() => logout()}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return renderHome();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🍽️ La Bella Vita</h1>
        </div>
        
        <div className="flex">
          {/* Sidebar placeholder */}
          <div className="hidden lg:block w-64 bg-white shadow-lg">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <h1 className="text-xl font-bold text-gray-900">🍽️ La Bella Vita</h1>
            </div>
          </div>
          
          {/* Loading content */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">🍽️ La Bella Vita</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
          
          {/* Logo */}
          <div className="hidden lg:flex items-center justify-center h-16 px-4 border-b flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">🍽️ La Bella Vita</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-8 px-4 overflow-y-auto">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'menu') {
                        router.push('/user/menu');
                      } else {
                        setActiveTab(item.id);
                      }
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Restaurant Info */}
          <div className="flex-shrink-0 p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>123 Food Street, City</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>10:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
