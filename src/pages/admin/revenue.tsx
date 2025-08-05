import { useEffect, useState } from 'react';
import { fetchPayments } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminRevenue() {
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setLoading(true);
        const payments = await fetchPayments();
        const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        setRevenue(totalRevenue);
      } catch (error) {
        console.error('Error loading revenue:', error);
        toast.error('Failed to load revenue');
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revenue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Total Revenue</h1>
      <p className="text-lg">$<span className="font-bold">{revenue.toLocaleString()}</span></p>
    </div>
  );
}

