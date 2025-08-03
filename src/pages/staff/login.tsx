'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function StaffLoginPage() {
  const { loginStaff } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const ok = await loginStaff({ email, password });
    setLoading(false);
    if (!ok) setError('Login failed. Check your credentials.');
    else window.location.href = '/staff';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-teal-100 p-4">
      <form
        className="max-w-md bg-white shadow-xl rounded-lg p-8 w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-teal-600">Staff Login</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email<br />
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-4">Password<br />
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          />
        </label>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-2 mt-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-500 transition disabled:bg-gray-300"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
