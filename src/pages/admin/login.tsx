'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const ok = await loginAdmin({ email, password });
    setLoading(false);
    if (!ok) setError('Login failed. Check your credentials.');
    else window.location.href = '/admin';
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <form
        className="max-w-md bg-white shadow-xl rounded-lg p-8 w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Admin Login</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email<br />
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-4">Password<br />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 mt-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition disabled:bg-gray-300">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
