import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/admin/login';
    }
  }, [user, loading]);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="bg-gray-100 px-4 py-1 rounded text-sm">Logout</button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded bg-green-100 p-6">
          <div className="text-2xl font-bold">TBD</div>
          <div className="text-gray-600 mt-2">Active Tables</div>
        </div>
        <div className="rounded bg-blue-100 p-6">
          <div className="text-2xl font-bold">TBD</div>
          <div className="text-gray-600 mt-2">Today Revenue</div>
        </div>
        <div className="rounded bg-yellow-100 p-6">
          <div className="text-2xl font-bold">TBD</div>
          <div className="text-gray-600 mt-2">Top Selling Items</div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <a href="/admin/tables" className="bg-primary text-white py-2 px-4 rounded text-center">Manage Tables</a>
        <a href="/admin/menu" className="bg-primary text-white py-2 px-4 rounded text-center">Manage Menu</a>
        <a href="/admin/orders" className="bg-primary text-white py-2 px-4 rounded text-center">Manage Orders</a>
        <a href="/admin/payments" className="bg-primary text-white py-2 px-4 rounded text-center">Payments</a>
        <a href="/admin/guests" className="bg-primary text-white py-2 px-4 rounded text-center">Guests</a>
      </div>
      <div className="mt-8 text-gray-500 text-xs text-center">Statistics are coming soon, ready for API integration.</div>
    </div>
  );
}

