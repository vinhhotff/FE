'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function StaffDashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="p-12 text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <button onClick={logout} className="bg-gray-100 px-4 py-1 rounded text-sm">Logout</button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/staff/tables" className="bg-orange-500 text-white py-4 px-6 rounded text-center hover:bg-orange-600 transition">
          Manage Tables
        </Link>
        <Link href="/staff/orders" className="bg-orange-500 text-white py-4 px-6 rounded text-center hover:bg-orange-600 transition">
          Manage Orders
        </Link>
        <Link href="/staff/payments" className="bg-orange-500 text-white py-4 px-6 rounded text-center hover:bg-orange-600 transition">
          Payments
        </Link>
      </div>
    </div>
  );
}

