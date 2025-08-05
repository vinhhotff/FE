'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchMenuItems, fetchOrders, fetchUsers, fetchPayments, getTodayStats, getWeeklyTrends } from '@/services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  menuItems: number;
  totalOrders: number;
  revenue: string;
  users: number;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    menuItems: 0,
    totalOrders: 0,
    revenue: '$0',
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<any>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [menuItems, orders, users, payments, todayStatsResponse, weeklyTrendsResponse] = await Promise.all([
        fetchMenuItems(),
        fetchOrders(),
        fetchUsers(),
        fetchPayments(),
        getTodayStats(),
        getWeeklyTrends(),
      ]);

      // Set analytics data
      setTodayStats(todayStatsResponse.data?.data || null);
      setWeeklyTrends(weeklyTrendsResponse.data?.data || null);

      // Calculate revenue from payments
      const totalRevenue = payments.reduce((sum: number, payment: any) => {
        return sum + (payment.amount || 0);
      }, 0);

      setStats({
        menuItems: menuItems.length,
        totalOrders: orders.length,
        revenue: `$${totalRevenue.toLocaleString()}`,
        users: users.length,
      });

      // Get recent orders (last 5)
      const sortedOrders = orders.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatCards = (): StatCard[] => [
    {
      label: 'Menu Items',
      value: loading ? '...' : stats.menuItems,
      icon: '🍽️',
      href: '/admin/menu-items',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      label: 'Total Orders',
      value: loading ? '...' : stats.totalOrders,
      icon: '🛒',
      href: '/admin/orders',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Revenue',
      value: loading ? '...' : stats.revenue,
      icon: '💰',
      href: '/admin/revenue',
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Registered Users',
      value: loading ? '...' : stats.users,
      icon: '👤',
      href: '/admin/users',
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-tr from-orange-500 to-amber-700 text-white shadow-lg py-6 px-4">
        <div className="text-2xl font-bold mb-8 tracking-wide flex items-center">
          <span className="mr-3">🍽️</span> Admin Panel
        </div>
        <div className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="block py-2 px-4 rounded bg-orange-700 bg-opacity-60 font-semibold">
            Dashboard
          </Link>
          <Link href="/admin/menu-items" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Menu Items
          </Link>
          <Link href="/admin/orders" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Orders
          </Link>
          <Link href="/admin/users" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Users
          </Link>
          <Link href="/admin/revenue" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Revenue
          </Link>
          <Link href="/" className="block py-2 px-4 rounded hover:bg-orange-700 transition">
            Go Home
          </Link>
        </div>
        <hr className="my-4 border-amber-300" />
        <div className="text-sm text-orange-100 mt-auto">
          {user && (
            <>
              <div className="font-bold">{user.name}</div>
              <div className="text-xs">({user.email})</div>
              <div className="mt-1 text-orange-300">Role: {user.role}</div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => logout()}
                  className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition"
                >
                  Logout to Login
                </button>
                <button
                  onClick={() => logout('/')}
                  className="w-full py-2 px-4 bg-red-400 hover:bg-red-500 text-white rounded text-sm font-semibold transition"
                >
                  Logout to Home
                </button>
                <button
                  onClick={() => logout('/admin/login')}
                  className="w-full py-2 px-4 bg-red-300 hover:bg-red-400 text-white rounded text-sm font-semibold transition"
                >
                  Logout to Admin Login
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-orange-800 mb-2 sm:mb-0">Dashboard Overview</h1>
          <Link
            href="/admin/menu-items/create"
            className="inline-block bg-amber-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-500 transition"
          >
            + Add New Menu Item
          </Link>
        </div>

        {/* Quick stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getStatCards().map((stat) => (
            <Link href={stat.href} key={stat.label} className="group">
              <div className={`p-6 rounded-xl shadow bg-white group-hover:shadow-lg transition flex flex-col items-start`}>
                <div className={`text-3xl mb-3 rounded-full p-3 ${stat.color}`}>{stat.icon}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                <div className="text-2xl font-bold mt-1 mb-1">{stat.value}</div>
                <div className="ml-auto text-xs text-amber-500 mt-2 group-hover:underline">View details</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Analytics Sections */}
        {todayStats && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-700">📊 Today's Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-600">Orders Today</h3>
                  <span className="text-3xl">📦</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{todayStats.totalOrders || 0}</div>
                <p className="text-sm text-gray-500 mt-2">Orders placed today</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-600">Today's Revenue</h3>
                  <span className="text-3xl">💵</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ${(todayStats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-gray-500 mt-2">Total revenue today</p>
              </div>
            </div>
          </div>
        )}

        {weeklyTrends && weeklyTrends.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-700">📈 Weekly Trends (Last 7 Days)</h2>
            <div className="p-6 bg-white rounded-xl shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {weeklyTrends.map((day: any, index: number) => {
                      const avgOrderValue = day.totalOrders > 0 ? day.totalRevenue / day.totalOrders : 0;
                      const dateObj = new Date(day.date);
                      const isToday = new Date().toDateString() === dateObj.toDateString();
                      
                      return (
                        <tr key={index} className={isToday ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {isToday && <span className="ml-2 text-xs text-blue-600 font-semibold">(Today)</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="font-semibold">{day.totalOrders}</span> orders
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="font-semibold text-green-600">
                              ${day.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Orders (7 days)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {weeklyTrends.reduce((sum: number, day: any) => sum + day.totalOrders, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Revenue (7 days)</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${weeklyTrends.reduce((sum: number, day: any) => sum + day.totalRevenue, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Daily Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${(weeklyTrends.reduce((sum: number, day: any) => sum + day.totalRevenue, 0) / 7).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Recent Orders</h2>
          <div className="p-6 bg-white rounded-xl shadow">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-400 italic">No recent orders found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

