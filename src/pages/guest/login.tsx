import React, { useState } from 'react';
import { createGuest } from '@/services/api';
import { GuestFormData } from '@/types';
import { useRouter } from 'next/router';

export default function GuestLogin() {
  const [formData, setFormData] = useState<GuestFormData>({
    tableName: '',
    guestName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createGuest(formData);
      if (response.data.success) {
        // Redirect to table page
        router.push(`/guest/table/${formData.tableName}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-pink-100 p-4">
      <form
        className="max-w-md bg-white shadow-xl rounded-lg p-8 w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-600">Guest Access</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Table Name
          </label>
          <input
            type="text"
            value={formData.tableName}
            onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
            required
            placeholder="e.g. Table 1, A1, etc."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            required
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 transition disabled:bg-gray-300"
        >
          {loading ? 'Accessing...' : 'Access Table'}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>🍽️ Welcome to our restaurant!</p>
          <p>Please enter your table information to start ordering.</p>
        </div>
      </form>
    </div>
  );
}
